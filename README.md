# 🛒 Blinkit - FullStack Ecommerce Website

A full-featured eCommerce website inspired by Blinkit, built using the **MERN Stack**. This application allows users to browse products, manage cart and orders, make payments, and for admins to manage the entire platform.

## 🔗 Live Demo

**Frontend**: [https://blinkit-full-stack-ecommerce-websit.vercel.app/](https://blinkit-full-stack-ecommerce-websit.vercel.app/)  
**Backend**: [https://blinkit-fullstack-ecommerce-website.onrender.com](https://blinkit-fullstack-ecommerce-website.onrender.com)

---

## 🧰 Tech Stack

### 🔹 Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### 🔸 Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Multer (Image Upload)
- Dotenv

---

## 📦 Features

### 👤 User
- Signup/Login with JWT Authentication
- Browse categories, subcategories, and products
- Add/remove items to cart
- Manage address
- Place orders
- View order history

### 🛠 Admin
- Create/edit/delete categories, subcategories, products
- Upload product images
- View all users
- Manage orders

### 🌐 General
- Token-based authentication with auto-refresh
- CORS-enabled with secure cookie storage
- Environment-based configuration for API endpoints

---

## 🚀 Getting Started (Local Setup)

### 🔧 Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud - e.g., MongoDB Atlas)

### 🖥️ Clone the Repository
```bash
git clone https://github.com/AnujPratap-96/Blinkit---FullStack-Ecommerce-Website.git
cd Blinkit---FullStack-Ecommerce-Website
```

---

### 📁 Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend` folder:

```env
PORT=5000
MONGO_URL=<your-mongodb-connection-url>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
FRONTEND_URL=http://localhost:5173
```

Run backend:
```bash
npm start
```

---

### 🌐 Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file inside `Frontend` folder:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Run frontend:
```bash
npm run dev
```

---

## ⚙️ Folder Structure

```
Blinkit---FullStack-Ecommerce-Website/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── routes/
│   └── index.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── main.jsx
```

---

## 🛡️ Security & Best Practices

- Access and refresh tokens securely stored and managed
- Passwords hashed using Bcrypt
- .env file used for configuration
- API protected using middleware and token validation

---

## 📸 Screenshots

> Add UI screenshots here for a better visual impression.

---

## 📣 Credits

- Inspired by [Blinkit](https://blinkit.com)
- Developed by **Anuj Pratap Singh**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

```



