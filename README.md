
#  CampaignFund Platform - Backend

A Node.js/Express backend API for managing donations, user authentication, fund creation, and profile management using MongoDB, JWT, and Cloudinary.

---

##  Folder Structure

```
backend/
│
├── authService/              # Authentication services
├── config/                   # Cloudinary and DB config
├── controllers/              # All controller logic
├── emailService/             # Nodemailer-based email logic
├── encryption/               # Account number  encryption logic
├── middleware/               # Custom middleware (auth, roles, etc.)
├── models/                   # Mongoose schemas/models
├── routes/                   # Route definitions
│   ├── auth/
│   ├── donar/
│   ├── fund/
│   └── profile/
├── .env                      # Environment variables
├── index.js                  # App entry point
├── package.json
└── README.md
```

---

##  Features

- JWT Authentication
- Encrypted password storage
- Role-based access control
- Image upload with Cloudinary
- Donation & Fundraising APIs
- Email notifications with Nodemailer
- Profile management
- Modular & scalable architecture

---

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/charity-backend.git
cd charity-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

---

##  Run the Application

### Development (with nodemon):

```bash
npm run dev
```

### Production:

```bash
npm start
```

---

##  API Guide

All responses are in JSON format.

Base URL : `http://localhost:5000`

###  Auth Routes - `/api/auth`



| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| POST   | `/api/auth/signup`    | Register new user     |
| POST   | `/api/auth/login`       | Login and get token   |
| POST    | `/api/auth/logout`      | Logout and delete token |
| POST    | `/api/auth/forget-password`      | forget password reset link  |
| POST  | `/api/auth/reset-password`        | reset password from reset link|

---

###  Profile Routes - `/api/profile`

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/api/user/profile`              | Get user profile         |
| PUT    | `/api/user/update-profile`        | Update profile info      |

---

###  Donor Routes - `/api/donar`

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/donate`        | Make a donation          |
| GET    | `/donations`     | List all donations       |

---

###  Fund Routes - `/api/fund`

| Method | Endpoint         | Description                  |
|--------|------------------|------------------------------|
| POST   | `/create`        | Create fundraising request   |
| GET    | `/all`           | Get all fundraisers          |
| GET    | `/:id`           | Get fundraiser by ID         |

---

##  Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary
- Nodemailer
- JWT & bcrypt
- dotenv

---
##  Notes


- Cloudinary handles file uploads from the `cloudinaryUploadMiddleware`.

- Email templates can be configured under `emailService.js`.

---

##  Contributing

Feel free to fork and open a pull request. Contributions are welcome!

---

##  License
All rights reserved. @campaignFund developer organization
Email at [info@i.sksingh113@gmail.com](mailto:i.sksingh113@gmail.com) for more information.

This project is licensed under the MIT License.
