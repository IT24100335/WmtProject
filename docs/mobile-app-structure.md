# Crave Bites Mobile App Structure

This project is now organized to match the assignment requirements for a Full Stack Mobile Application.

## Stack

- Frontend: React Native with Expo
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Authentication: JWT
- File upload: menu photos through multipart form data

## App Flows

- Customer flow
  - Portal landing
  - Customer login
  - Customer sign up
  - Menu browsing
  - Cart and checkout
  - Order history
  - Profile management

- Admin flow
  - Admin login
  - Overview dashboard
  - Menu management
  - Order status management
  - Promotions management
  - Inventory management
  - Feedback management
  - User management

## Mobile Folder

```text
mobile/
  App.js
  app.json
  src/
    api/
    components/
    config.js
    context/
    navigation/
    screens/
    utils/
```

## Team Module Split

1. Authentication
   - Registration
   - Login
   - JWT
   - Protected routes

2. Order Management
   - Checkout
   - Order status tracking
   - Customer order history

3. User Management and Admin Dashboard
   - Admin overview
   - Team accounts
   - User CRUD

4. Menu Management
   - Menu CRUD
   - Image upload
   - Availability toggle

5. Promotion Management
   - Promo CRUD
   - Promo validation
   - Discount application

6. Feedback and Rating
   - Star rating submit
   - Feedback list
   - Delete feedback

## Deployment Note

The mobile app should point to the hosted backend URL using `EXPO_PUBLIC_API_URL`.
For final demo, do not use localhost. Use the Render/Railway/AWS backend URL.
