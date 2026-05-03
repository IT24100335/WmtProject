# Database Design

Collections:

- `users`
- `menuitems`
- `orders`
- `inventoryitems`
- `promotions`
- `feedbacks`

Relationships:

- Orders reference users and embed ordered item snapshots.
- Feedback references menu items and optional users.
- Promotions are independent documents validated during checkout.
- Inventory is managed separately from menu stock for pantry tracking.

