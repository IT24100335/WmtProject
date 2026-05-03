# Crave Bites Test Accounts

These accounts are created automatically with:

```powershell
cd backend
npm run seed:accounts
```

## Default Password

- `CraveTeam@2026`

If needed, you can override it using `TEAM_ACCOUNT_PASSWORD` in `backend/.env`.

## Admin and Manager Accounts

- `admin` - `ADMIN`
- `menu_mgr` - `MENU_MANAGER`
- `order_mgr` - `ORDER_MANAGER`
- `inventory_mgr` - `INVENTORY_MANAGER`
- `promo_mgr` - `PROMOTION_MANAGER`
- `feedback_mgr` - `FEEDBACK_MANAGER`

## Access Rules

- `ADMIN` can see all admin modules
- `MENU_MANAGER` sees only the menu module
- `ORDER_MANAGER` sees only the orders module
- `INVENTORY_MANAGER` sees only the inventory module
- `PROMOTION_MANAGER` sees only the promotions module
- `FEEDBACK_MANAGER` sees only the feedback module
