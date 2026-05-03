# API Notes

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`

## Users

- `GET /api/users`
- `GET /api/users/profile/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

## Menu

- `GET /api/menu`
- `GET /api/menu/recommended`
- `POST /api/menu`
- `PUT /api/menu/:id/toggle-availability`
- `DELETE /api/menu/:id`

## Orders

- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PUT /api/orders/:id/status`

## Promotions

- `GET /api/promotions`
- `POST /api/promotions`
- `PUT /api/promotions/:id`
- `GET /api/promotions/validate/:code`
- `DELETE /api/promotions/:id`

## Inventory

- `GET /api/inventory/pantry`
- `POST /api/inventory/pantry`
- `PUT /api/inventory/pantry/:id`
- `DELETE /api/inventory/pantry/:id`
- `PUT /api/inventory/:id/stock`

## Feedback

- `POST /api/feedback`
- `GET /api/feedback/:menuItemId`
- `DELETE /api/feedback/:id`
