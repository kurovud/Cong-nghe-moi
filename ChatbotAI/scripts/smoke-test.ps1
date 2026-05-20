param(
  [string]$BaseUrl = "http://localhost:4000",
  [switch]$RequireAiKey
)

$ErrorActionPreference = "Stop"

$results = @()

function Add-Result {
  param(
    [string]$Step,
    [bool]$Passed,
    [string]$Evidence
  )

  $script:results += [PSCustomObject]@{
    Step = $Step
    Status = if ($Passed) { "PASS" } else { "FAIL" }
    Evidence = $Evidence
  }

  if ($Passed) {
    Write-Host "[PASS] $Step - $Evidence" -ForegroundColor Green
  } else {
    Write-Host "[FAIL] $Step - $Evidence" -ForegroundColor Red
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
    return @{ Ok = $true; StatusCode = 200; Body = $response; Error = $null }
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

    return @{ Ok = $false; StatusCode = $status; Body = $null; Error = $errBody }
  }
}

Write-Host "=== Smoke test started: $BaseUrl ===" -ForegroundColor Cyan

$health = Invoke-Api -Method "GET" -Path "/health"
if ($health.Ok -and $health.Body.status -eq "ok") {
  Add-Result -Step "Gateway health" -Passed $true -Evidence "/health => ok"
} else {
  Add-Result -Step "Gateway health" -Passed $false -Evidence "Cannot reach $BaseUrl/health"
  $results | Format-Table -AutoSize
  exit 1
}

$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$email = "smoke+$stamp@pcshop.local"
$password = "Smoke12345"
$name = "Smoke User"

$registerBody = @{
  email = $email
  password = $password
  name = $name
  phone = "0900000000"
}
$register = Invoke-Api -Method "POST" -Path "/api/auth/register" -Body $registerBody
if ($register.Ok -and $register.Body.success -eq $true) {
  Add-Result -Step "Register" -Passed $true -Evidence "/api/auth/register => success"
} else {
  Add-Result -Step "Register" -Passed $false -Evidence "status=$($register.StatusCode)"
  $results | Format-Table -AutoSize
  exit 1
}

$loginBody = @{ email = $email; password = $password }
$login = Invoke-Api -Method "POST" -Path "/api/auth/login" -Body $loginBody
$token = $login.Body.data.accessToken
if ($login.Ok -and $login.Body.success -eq $true -and $token) {
  Add-Result -Step "Login" -Passed $true -Evidence "/api/auth/login => token issued"
} else {
  Add-Result -Step "Login" -Passed $false -Evidence "status=$($login.StatusCode)"
  $results | Format-Table -AutoSize
  exit 1
}

$search = Invoke-Api -Method "GET" -Path "/api/products/search?q=rtx&limit=1"
$product = $null
if ($search.Ok -and $search.Body.success -eq $true -and $search.Body.data.Count -ge 1) {
  $product = $search.Body.data[0]
  Add-Result -Step "Search product" -Passed $true -Evidence "/api/products/search returned 1+"
} else {
  $fallback = Invoke-Api -Method "GET" -Path "/api/products?limit=1"
  if ($fallback.Ok -and $fallback.Body.success -eq $true -and $fallback.Body.data.Count -ge 1) {
    $product = $fallback.Body.data[0]
    Add-Result -Step "Search product" -Passed $true -Evidence "/api/products fallback returned 1+"
  } else {
    Add-Result -Step "Search product" -Passed $false -Evidence "No product from search/fallback"
    $results | Format-Table -AutoSize
    exit 1
  }
}

$unitPrice = if ($product.discountPrice) { [double]$product.discountPrice } else { [double]$product.price }
$cartItem = @{
  id = $product.id
  productId = $product.id
  name = $product.name
  quantity = 1
  price = $unitPrice
  discountPrice = $unitPrice
  image = $product.image
}

$cartPut = Invoke-Api -Method "PUT" -Path "/api/cart" -Body @{ items = @($cartItem) } -Token $token
if ($cartPut.Ok -and $cartPut.Body.success -eq $true) {
  Add-Result -Step "Add cart" -Passed $true -Evidence "/api/cart PUT => success"
} else {
  Add-Result -Step "Add cart" -Passed $false -Evidence "status=$($cartPut.StatusCode)"
  $results | Format-Table -AutoSize
  exit 1
}

$cartGet = Invoke-Api -Method "GET" -Path "/api/cart" -Token $token
if ($cartGet.Ok -and $cartGet.Body.success -eq $true -and $cartGet.Body.data.Count -ge 1) {
  Add-Result -Step "Read cart" -Passed $true -Evidence "/api/cart GET contains item"
} else {
  Add-Result -Step "Read cart" -Passed $false -Evidence "Cart empty or request failed"
  $results | Format-Table -AutoSize
  exit 1
}

$orderBody = @{
  items = @($cartItem)
  shippingAddress = @{
    fullName = "Smoke User"
    phone = "0900000000"
    province = "Ho Chi Minh"
    district = "District 1"
    ward = "Ben Nghe"
    street = "1 Smoke Street"
  }
  paymentMethod = "COD"
  note = "Smoke test order"
}

$order = Invoke-Api -Method "POST" -Path "/api/orders" -Body $orderBody -Token $token
$orderId = $order.Body.data.id
if ($order.Ok -and $order.Body.success -eq $true -and $orderId) {
  Add-Result -Step "Checkout/create order" -Passed $true -Evidence "/api/orders POST => created"
} else {
  Add-Result -Step "Checkout/create order" -Passed $false -Evidence "status=$($order.StatusCode)"
  $results | Format-Table -AutoSize
  exit 1
}

$orders = Invoke-Api -Method "GET" -Path "/api/orders" -Token $token
if ($orders.Ok -and $orders.Body.success -eq $true) {
  Add-Result -Step "Read orders" -Passed $true -Evidence "/api/orders GET => success"
} else {
  Add-Result -Step "Read orders" -Passed $false -Evidence "status=$($orders.StatusCode)"
  $results | Format-Table -AutoSize
  exit 1
}

$reviewBody = @{
  productId = $product.id
  rating = 5
  title = "Smoke review"
  content = "Smoke test review content for endpoint validation"
  pros = @("fast")
  cons = @("none")
}
$review = Invoke-Api -Method "POST" -Path "/api/reviews" -Body $reviewBody -Token $token
if ($review.Ok -and $review.Body.success -eq $true) {
  Add-Result -Step "Create review" -Passed $true -Evidence "/api/reviews POST => created"
} else {
  Add-Result -Step "Create review" -Passed $false -Evidence "status=$($review.StatusCode)"
  $results | Format-Table -AutoSize
  exit 1
}

$sessionId = "smoke-session-$stamp"
$chatBody = @{ message = "Tu van build PC gaming 20 trieu"; sessionId = $sessionId }
$chat = Invoke-Api -Method "POST" -Path "/api/chat" -Body $chatBody
$chatData = $chat.Body.data
$responseId = $chatData.responseId

if ($chat.Ok -and $chat.Body.success -eq $true -and $chatData.message) {
  Add-Result -Step "Chatbot response" -Passed $true -Evidence "/api/chat POST => response returned"
} else {
  Add-Result -Step "Chatbot response" -Passed $false -Evidence "status=$($chat.StatusCode)"
  $results | Format-Table -AutoSize
  exit 1
}

if ($responseId) {
  $feedback = Invoke-Api -Method "POST" -Path "/api/chat/feedback" -Body @{ responseId = $responseId; rating = "like" }
  if ($feedback.Ok -and $feedback.Body.success -eq $true) {
    Add-Result -Step "Chat feedback" -Passed $true -Evidence "/api/chat/feedback POST => accepted"
  } else {
    Add-Result -Step "Chat feedback" -Passed $false -Evidence "status=$($feedback.StatusCode)"
    $results | Format-Table -AutoSize
    exit 1
  }
} else {
  if ($RequireAiKey) {
    Add-Result -Step "Chat feedback" -Passed $false -Evidence "No responseId from /api/chat. GOOGLE_AI_API_KEY likely missing."
    $results | Format-Table -AutoSize
    exit 1
  }

  Add-Result -Step "Chat feedback" -Passed $true -Evidence "Skipped (no responseId, likely running without GOOGLE_AI_API_KEY)"
}

$analytics = Invoke-Api -Method "GET" -Path "/api/analytics"
if ($analytics.Ok -and $analytics.Body.success -eq $true) {
  Add-Result -Step "Analytics endpoint" -Passed $true -Evidence "/api/analytics GET => success"
} else {
  Add-Result -Step "Analytics endpoint" -Passed $false -Evidence "status=$($analytics.StatusCode)"
  $results | Format-Table -AutoSize
  exit 1
}

Write-Host "`n=== Smoke test summary ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize

if ($results.Status -contains "FAIL") {
  exit 1
}

Write-Host "`nSmoke test completed successfully." -ForegroundColor Green
exit 0
