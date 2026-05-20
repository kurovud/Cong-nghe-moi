param(
  [string]$BaseUrl = "http://localhost:4000"
)

$ErrorActionPreference = "Stop"
$results = @()

function Add-Result {
  param(
    [string]$Role,
    [string]$Action,
    [string]$Endpoint,
    [int]$ExpectedStatus,
    [int]$ActualStatus,
    [bool]$Passed,
    [string]$Evidence
  )

  $script:results += [PSCustomObject]@{
    Role = $Role
    Action = $Action
    Endpoint = $Endpoint
    Expected = $ExpectedStatus
    Actual = $ActualStatus
    Status = if ($Passed) { "PASS" } else { "FAIL" }
    Evidence = $Evidence
  }

  if ($Passed) {
    Write-Host "[PASS] [$Role] $Action $Endpoint => $ActualStatus" -ForegroundColor Green
  } else {
    Write-Host "[FAIL] [$Role] $Action $Endpoint => expected $ExpectedStatus, got $ActualStatus" -ForegroundColor Red
  }
}

function Invoke-Api {
  param(
    [string]$Method,
    [string]$Path,
    [object]$Body,
    [string]$Token
  )

  $headers = @{ "Content-Type" = "application/json" }
  if ($Token) { $headers["Authorization"] = "Bearer $Token" }

  $uri = "$BaseUrl$Path"
  $params = @{
    Method = $Method
    Uri = $uri
    Headers = $headers
    TimeoutSec = 30
  }

  if ($null -ne $Body) {
    $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
  }

  try {
    $response = Invoke-RestMethod @params
    return @{ Ok = $true; StatusCode = 200; Body = $response }
  } catch {
    $status = 0
    $errBody = $null

    if ($_.Exception.Response) {
      try { $status = [int]$_.Exception.Response.StatusCode } catch {}
      try {
        $stream = $_.Exception.Response.GetResponseStream()
        if ($stream) {
          $reader = New-Object System.IO.StreamReader($stream)
          $raw = $reader.ReadToEnd()
          if ($raw) {
            try { $errBody = $raw | ConvertFrom-Json } catch { $errBody = $raw }
          }
        }
      } catch {}
    }

    return @{ Ok = $false; StatusCode = $status; Body = $errBody }
  }
}

function Test-ExpectedStatus {
  param(
    [string]$Role,
    [string]$Action,
    [string]$Method,
    [string]$Endpoint,
    [object]$Body,
    [string]$Token,
    [int]$ExpectedStatus
  )

  $res = Invoke-Api -Method $Method -Path $Endpoint -Body $Body -Token $Token
  $passed = ($res.StatusCode -eq $ExpectedStatus)
  $evidence = if ($res.Body) { ($res.Body | ConvertTo-Json -Depth 4 -Compress) } else { "no-body" }
  Add-Result -Role $Role -Action $Action -Endpoint $Endpoint -ExpectedStatus $ExpectedStatus -ActualStatus $res.StatusCode -Passed $passed -Evidence $evidence
  return $res
}

Write-Host "=== RBAC smoke test started: $BaseUrl ===" -ForegroundColor Cyan

# Login seeded users
$adminLogin = Invoke-Api -Method "POST" -Path "/api/auth/login" -Body @{ email = "admin@pcshop.vn"; password = "Admin@123" }
$staffLogin = Invoke-Api -Method "POST" -Path "/api/auth/login" -Body @{ email = "staff@pcshop.vn"; password = "Staff@123" }
$customerLogin = Invoke-Api -Method "POST" -Path "/api/auth/login" -Body @{ email = "user@pcshop.vn"; password = "User@123" }

if (-not $adminLogin.Ok -or -not $staffLogin.Ok -or -not $customerLogin.Ok) {
  Write-Host "Cannot login seeded accounts. Check seed data first." -ForegroundColor Red
  exit 1
}

$adminToken = $adminLogin.Body.data.accessToken
$staffToken = $staffLogin.Body.data.accessToken
$customerToken = $customerLogin.Body.data.accessToken

# Resolve one product for order creation
$search = Invoke-Api -Method "GET" -Path "/api/products?limit=1"
if (-not $search.Ok -or -not $search.Body.data -or $search.Body.data.Count -eq 0) {
  Write-Host "No products available for order flow" -ForegroundColor Red
  exit 1
}
$product = $search.Body.data[0]
$unitPrice = if ($product.discountPrice) { [double]$product.discountPrice } else { [double]$product.price }

# Customer negative permissions
Test-ExpectedStatus -Role "customer" -Action "forbidden create product" -Method "POST" -Endpoint "/api/products" -Body @{ name="rbac-customer-block"; category="cpu"; brand="x"; price=1000; stock=1 } -Token $customerToken -ExpectedStatus 403 | Out-Null
Test-ExpectedStatus -Role "customer" -Action "forbidden order admin list" -Method "GET" -Endpoint "/api/orders/all" -Body $null -Token $customerToken -ExpectedStatus 403 | Out-Null
Test-ExpectedStatus -Role "customer" -Action "forbidden users list" -Method "GET" -Endpoint "/api/users" -Body $null -Token $customerToken -ExpectedStatus 403 | Out-Null

# Staff permissions on products
$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$newProductBody = @{
  name = "RBAC STAFF Product $stamp"
  category = "cpu"
  brand = "RBAC"
  price = 123456
  stock = 5
  shortDesc = "Role test product"
}
$staffCreate = Test-ExpectedStatus -Role "staff" -Action "create product" -Method "POST" -Endpoint "/api/products" -Body $newProductBody -Token $staffToken -ExpectedStatus 200
$productId = $staffCreate.Body.data.id
if (-not $productId) {
  Write-Host "Staff create product failed, cannot continue product CRUD tests." -ForegroundColor Red
  $results | Format-Table -AutoSize
  exit 1
}

Test-ExpectedStatus -Role "staff" -Action "update product" -Method "PUT" -Endpoint "/api/products/$productId" -Body @{ price = 222222; stock = 8 } -Token $staffToken -ExpectedStatus 200 | Out-Null
Test-ExpectedStatus -Role "staff" -Action "delete product" -Method "DELETE" -Endpoint "/api/products/$productId" -Body $null -Token $staffToken -ExpectedStatus 200 | Out-Null

# Create an order using customer for staff/admin order management tests
$orderBody = @{
  items = @(@{
    id = $product.id
    productId = $product.id
    name = $product.name
    quantity = 1
    price = $unitPrice
    discountPrice = $unitPrice
    image = $product.image
  })
  shippingAddress = @{
    fullName = "RBAC Customer"
    phone = "0900000000"
    province = "Ho Chi Minh"
    district = "District 1"
    ward = "Ben Nghe"
    street = "1 Role Test Street"
  }
  paymentMethod = "COD"
  note = "RBAC order"
}
$createdOrder = Invoke-Api -Method "POST" -Path "/api/orders" -Body $orderBody -Token $customerToken
if (-not $createdOrder.Ok -or -not $createdOrder.Body.data.id) {
  Write-Host "Cannot create order for RBAC tests" -ForegroundColor Red
  $results | Format-Table -AutoSize
  exit 1
}
$orderId = $createdOrder.Body.data.id

# Staff permissions on order management
Test-ExpectedStatus -Role "staff" -Action "list all orders" -Method "GET" -Endpoint "/api/orders/all" -Body $null -Token $staffToken -ExpectedStatus 200 | Out-Null
Test-ExpectedStatus -Role "staff" -Action "order stats" -Method "GET" -Endpoint "/api/orders/stats" -Body $null -Token $staffToken -ExpectedStatus 200 | Out-Null
Test-ExpectedStatus -Role "staff" -Action "update order status" -Method "PUT" -Endpoint "/api/orders/$orderId/status" -Body @{ status = "CONFIRMED" } -Token $staffToken -ExpectedStatus 200 | Out-Null
Test-ExpectedStatus -Role "staff" -Action "delete order" -Method "DELETE" -Endpoint "/api/orders/$orderId" -Body $null -Token $staffToken -ExpectedStatus 200 | Out-Null
Test-ExpectedStatus -Role "staff" -Action "forbidden user management" -Method "GET" -Endpoint "/api/users" -Body $null -Token $staffToken -ExpectedStatus 403 | Out-Null

# Admin permissions on user CRUD
Test-ExpectedStatus -Role "admin" -Action "list users" -Method "GET" -Endpoint "/api/users" -Body $null -Token $adminToken -ExpectedStatus 200 | Out-Null

$newUser = Test-ExpectedStatus -Role "admin" -Action "create managed user" -Method "POST" -Endpoint "/api/users" -Body @{
  email = "rbac-user-$stamp@pcshop.vn"
  password = "Rbac12345"
  name = "RBAC Managed"
  phone = "0911222333"
  role = "USER"
  status = "ACTIVE"
} -Token $adminToken -ExpectedStatus 200

$managedUserId = $null
if ($newUser.Body -and $newUser.Body.user -and $newUser.Body.user.id) {
  $managedUserId = $newUser.Body.user.id
} elseif ($newUser.Body -and $newUser.Body.data -and $newUser.Body.data.id) {
  $managedUserId = $newUser.Body.data.id
} elseif ($newUser.Body -and $newUser.Body.data -and $newUser.Body.data.user -and $newUser.Body.data.user.id) {
  $managedUserId = $newUser.Body.data.user.id
}
if ($managedUserId) {
  Test-ExpectedStatus -Role "admin" -Action "update managed user" -Method "PUT" -Endpoint "/api/users/$managedUserId" -Body @{ role = "STAFF"; status = "INACTIVE"; name = "RBAC Managed Updated" } -Token $adminToken -ExpectedStatus 200 | Out-Null
  Test-ExpectedStatus -Role "admin" -Action "delete managed user" -Method "DELETE" -Endpoint "/api/users/$managedUserId" -Body $null -Token $adminToken -ExpectedStatus 200 | Out-Null
}

Write-Host "`n=== RBAC smoke summary ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize

if ($results.Status -contains "FAIL") {
  exit 1
}

Write-Host "`nRBAC smoke completed successfully." -ForegroundColor Green
exit 0
