# Crave Bites Team Module Map

This file gives you the main folders each team member should use when working on the project.

## Login Accounts

Shared seeded password:

- `CraveTeam@2026`

Accounts:

- `admin` - `ADMIN`
- `menu_mgr` - `MENU_MANAGER`
- `order_mgr` - `ORDER_MANAGER`
- `inventory_mgr` - `INVENTORY_MANAGER`
- `promo_mgr` - `PROMOTION_MANAGER`
- `feedback_mgr` - `FEEDBACK_MANAGER`

## 1. Akmeemana G.K.M - IT24102508
### Promotion and Offer Management

Main folders and files:

- `frontend/src/features/promotions/`
- `backend/src/controllers/promotionController.js`
- `backend/src/models/Promotion.js`
- `backend/src/routes/promotionRoutes.js`

Main function:

- Create, update, delete promotions
- Validate promo code at checkout
- Automatic discount application

## 2. Pingesh T - IT24102439
### Order Management

Main folders and files:

- `frontend/src/features/orders/`
- `backend/src/controllers/orderController.js`
- `backend/src/models/Order.js`
- `backend/src/routes/orderRoutes.js`
- `shared/constants/orderStatus.js`

Main function:

- Place orders
- View orders
- Update order status
- Real-time style order tracking for customer and admin

## 3. Kavinsan.S - IT24100269
### User Management, Admin Dashboard, Inventory Management

Main folders and files:

- `frontend/src/features/users/`
- `frontend/src/features/inventory/`
- `frontend/src/pages/AdminPage.jsx`
- `backend/src/controllers/userController.js`
- `backend/src/controllers/inventoryController.js`
- `backend/src/models/User.js`
- `backend/src/models/InventoryItem.js`
- `backend/src/routes/userRoutes.js`
- `backend/src/routes/inventoryRoutes.js`

Main function:

- Manage users and roles
- Admin dashboard summary cards
- Pantry and stock management
- Automatic stock deduction
- Low-stock warning logic

## 4. Nagulendran S - IT24100335
### Menu Management

Main folders and files:

- `frontend/src/features/menu/`
- `backend/src/controllers/menuController.js`
- `backend/src/models/MenuItem.js`
- `backend/src/routes/menuRoutes.js`

Main function:

- Add, edit, delete menu items
- Upload item image
- Manage stock and item visibility
- Availability auto-hide for customers

## 5. Dalima T.S - IT24100266
### Feedback and Rating Management

Main folders and files:

- `frontend/src/features/feedback/`
- `backend/src/controllers/feedbackController.js`
- `backend/src/models/Feedback.js`
- `backend/src/routes/feedbackRoutes.js`

Main function:

- Submit feedback and rating
- Delete or moderate feedback
- Calculate and display average rating

## Shared App Areas

These folders are shared by everyone:

- `frontend/src/api/`
- `frontend/src/context/`
- `frontend/src/hooks/`
- `frontend/src/styles/`
- `mobile/src/api/`
- `mobile/src/context/`
- `mobile/src/navigation/`
- `mobile/src/screens/`
- `mobile/src/utils/`
- `backend/src/config/`
- `backend/src/middleware/`
- `backend/src/utils/`
- `shared/`

## Best GitHub Folder Strategy

If you push this project as one repository, keep the folder ownership like this:

- Member 1 works mainly in promotion files
- Member 2 works mainly in order files
- Member 3 works mainly in user, admin, and inventory files
- Member 4 works mainly in menu files
- Member 5 works mainly in feedback files

Try to avoid editing the same file at the same time. The main shared file that may cause conflicts is:

- `frontend/src/App.jsx`

## Recommended Next Refactor

To reduce merge conflicts, split [App.jsx](C:\Users\sanus\Documents\New project\frontend\src\App.jsx) into:

- `frontend/src/pages/StorePage.jsx`
- `frontend/src/pages/ProfilePage.jsx`
- `frontend/src/pages/AdminPage.jsx`
- `frontend/src/features/orders/components/`
- `frontend/src/features/menu/components/`
- `frontend/src/features/promotions/components/`
- `frontend/src/features/inventory/components/`
- `frontend/src/features/feedback/components/`
- `frontend/src/features/users/components/`

For the React Native submission, use the dedicated mobile shell:

- `mobile/App.js`
- `mobile/src/navigation/`
- `mobile/src/screens/customer/`
- `mobile/src/screens/admin/`
