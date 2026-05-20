$errAction = 'Stop'
try {
    $login = Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/auth/login' -Body (@{ email='admin@pcshop.vn'; password='Admin@123' } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
    $token = $null
    if ($login -and $login.data -and $login.data.accessToken) { $token = $login.data.accessToken } elseif ($login.accessToken) { $token = $login.accessToken }
    if (-not $token) { Write-Output 'NO_TOKEN'; exit }
    Write-Output 'TOKEN_OK'

    $listPayload = @{ action='list'; token=$token }
    $listResp = Invoke-RestMethod -Method Post -Uri 'http://localhost:3002/api/orders' -Body ($listPayload | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
    
    $orders = $null
    if ($listResp.orders) { $orders = $listResp.orders } elseif ($listResp.data) { $orders = $listResp.data } else { $orders = $listResp }
    if (-not $orders -or ($orders.Count -eq 0 -and $null -eq $orders.id)) { Write-Output 'NO_ORDERS_FOUND'; exit }
    $first = $null
    if ($orders.Count -gt 0) { $first = $orders[0] } else { $first = $orders }
    $id = $first.id
    Write-Output "FOUND_ORDER $id"

    $statuses = @('CONFIRMED','PROCESSING','SHIPPING','DELIVERED','CANCELLED')
    foreach ($s in $statuses) {
        Write-Output "Updating -> $s"
        try {
            $updatePayload = @{ action='update_status'; orderId=$id; status=$s; token=$token }
            $upd = Invoke-RestMethod -Method Post -Uri 'http://localhost:3002/api/orders' -Body ($updatePayload | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
            Write-Output "OK $s"
        } catch {
            Write-Output "FAIL $s : $($_.Exception.Message)"
        }
    }
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
}
