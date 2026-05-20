# Payment Webhook Endpoints (conference-service)

This file documents simple webhook endpoints that providers (MoMo, VNPay) can POST to when a payment completes.

Endpoints (public):

- POST /api/payments/momo-webhook
  - Expected JSON body (example):
    {
      "orderId": "<order id>",
      "resultCode": 0,
      "amount": 123000
    }
  - Behavior: If `resultCode === 0` the service will attempt to mark the order as `CONFIRMED` and `PAID`.

- POST /api/payments/vnpay-webhook
  - Expected form or JSON body (example):
    {
      "vnp_TxnRef": "<order id>",
      "vnp_ResponseCode": "00",
      "vnp_Amount": 123000
    }
  - Behavior: If `vnp_ResponseCode === '00'` the service will attempt to mark the order as `CONFIRMED` and `PAID`.

Notes & integration guidance:

- Security: In production, verify provider signatures (HMAC, RSA, etc.) before trusting callbacks.
- Idempotency: Webhook endpoints should be idempotent — this scaffold calls `orderService.updateOrderStatus` which should handle repeated calls safely.
- Response: Providers generally expect 200 OK quickly. The handler logs errors but still responds 200 to avoid retries in case of transient internal errors; adapt this if you prefer retries.
- Testing: Use a tool like `curl` or `httpie` to POST sample payloads to the endpoints, or configure the payment sandbox to call them.

Example curl (simulate MoMo):

```bash
curl -X POST http://<host>/api/payments/momo-webhook \
  -H 'Content-Type: application/json' \
  -d '{"orderId":"ORD-123","resultCode":0,"amount":100000}'
```

Example curl (simulate VNPay):

```bash
curl -X POST http://<host>/api/payments/vnpay-webhook \
  -H 'Content-Type: application/json' \
  -d '{"vnp_TxnRef":"ORD-123","vnp_ResponseCode":"00","vnp_Amount":100000}'
```
