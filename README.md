<div align="center">
  <h1>🚀 TESLA Technical Club Website</h1>
  <p>The official web platform for the TESLA Technical Club. Built with Next.js, MongoDB, and Tailwind CSS.</p>
</div>

---

## 🌟 About the Project
This is a full-stack, highly interactive web application designed to serve as the central hub for the **TESLA Technical Club**. It manages everything from club information and event registrations to alumni networking and member dashboards.

### ✨ Key Features
- **Dynamic Public Pages**: Beautiful, glassmorphic UI for Home, About, Events, Team, Blogs, Gallery, and Alumni.
- **Member Dashboard**: Dedicated protected space for members to manage their profiles, track registered events, post blogs, upload resources, and showcase achievements.
- **Admin Panel**: Complete content moderation and user management system with role-based access.
- **Full-Stack Authentication**: Custom JWT-based authentication via Next.js API routes and Proxy middleware.
- **PWA Ready**: Installable as a Progressive Web App on mobile devices.
- **Smooth Animations**: Powered by Framer Motion and custom CSS 3D transforms.

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB, Mongoose
- **Security**: bcryptjs, jsonwebtoken (JWT)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anurag3407/tesla_website.git
   cd tesla_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing
We love community contributions! Whether you're fixing a bug, adding a new feature, or updating documentation, your help is appreciated.

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a Pull Request. Note: **All UI changes must include screenshots in the PR.**

## 📄 License
This project is open-source and available under the MIT License.
