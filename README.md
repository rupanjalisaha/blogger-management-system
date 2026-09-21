# UVB Portal — Universal Blog Portal

UVB (Universal Blog) Portal is a full-stack blogging platform that enables users to create, manage, discover, and interact with blog content focused on space, science, technology, programming, and related topics.

This repository contains the **React frontend** of the application. The backend is maintained in a separate Spring Boot repository.

## 🔗 Related Repository

**Backend:**
https://github.com/rupanjalisaha/blog-application-backend

## ✨ Features

### Authentication

* User registration
* User login and logout
* JWT-based authentication
* Protected routes
* Session expiration handling
* Email verification
* Password reset flow

### 👤 User & Blogger Profiles

* View user profiles
* Edit profile information
* Manage blogger information
* Upload profile images
* Remove profile images
* Display blogger-specific information

### ✍️ Blog Management

Authenticated users can:

* Create blog posts
* Edit their own blog posts
* View their published posts
* Delete posts where permitted
* Select blog genre/category
* Create long-form articles using a rich-text editor
* Track article word count

### 📝 Rich Text Blog Editor

Blog creation uses **Tiptap** to provide a structured rich-text writing experience.

The editor supports functionality such as:

* Headings
* Text formatting
* Text alignment
* Highlighting
* Underline formatting
* Structured article editing

Blog content is validated before submission and sanitized when rendered.

### 🔎 Blog Discovery

Users can:

* Browse published blogs
* Search for blogs
* Sort blog results
* View individual blog posts
* View blogs written by specific bloggers
* See article summaries
* See estimated reading time
* Highlight search terms in results

### ❤️ Blog Interaction

Readers can interact with posts through:

* Likes
* Comments
* Comment management according to permissions
* Blog view tracking
* Sharing functionality
* Social sharing options

## 🛠️ Technology Stack

* **React 19**
* **React Router**
* **Create React App**
* **Bootstrap 5**
* **React-Bootstrap**
* **Tiptap**
* **Axios**
* **Headless UI**
* **DOMPurify**
* **jwt-decode**
* **React Calendar**

## 🏗️ Frontend Architecture

```text
                    UVB Portal
                       │
                       ▼
                React Application
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Routing        UI Pages      Auth State
        │              │              │
        └──────────────┼──────────────┘
                       │
                    Axios
                       │
                       ▼
              Spring Boot REST API
```

## 📂 Project Structure

```text
src/
├── Blogs/
│   ├── WritingBlogs.js
│   ├── WritingBlogsNew.js
│   ├── ViewBlog.js
│   ├── ViewBlogById.js
│   ├── ViewBlogByUserName.js
│   └── EditBlog.js
│
├── Users/
│   ├── AddUser.js
│   ├── LoginUser.js
│   ├── EditUser.js
│   └── ViewUser.js
│
├── Utils/
│   ├── CommentForm.js
│   └── profileImageUpload.js
│
├── layout/
│   ├── Navbar.js
│   ├── PostNavbar.js
│   └── ResetPasswordPage.js
│
├── pages/
│   ├── Home.js
│   └── VerifyEmailPage.js
│
├── services/
│   └── imageService.js
│
├── App.js
├── AuthContext.js
└── ProtectedRoute.js
```

## 🔐 Authentication Flow

The frontend uses JWT-based authentication provided by the backend.

```text
Register
   ↓
Email Verification
   ↓
Login
   ↓
JWT Token
   ↓
Protected Routes
   ↓
Authenticated Features
```

Protected application areas include blog creation, editing, profile management, and other authenticated functionality.

## ✍️ Blog Creation Flow

```text
Login
  ↓
Create Blog
  ↓
Enter Title & Genre
  ↓
Write with Rich Text Editor
  ↓
Validate Content
  ↓
Publish
  ↓
View Published Blog
```

## 🔎 Search Flow

```text
Search Keyword
      ↓
Frontend Request
      ↓
Spring Boot API
      ↓
Filtered / Sorted Results
      ↓
Display Matching Blogs
```

## ⚙️ Getting Started

### Prerequisites

Install:

* Node.js
* npm
* Running instance of the UVB backend

### Clone the repository

```bash
git clone https://github.com/rupanjalisaha/blogger-management-system.git
cd blogger-management-system
```

### Install dependencies

```bash
npm install
```

### Configure the backend URL

Create a `.env` file in the frontend root:

```env
REACT_APP_BACKEND_URL=http://localhost:8080
```

### Run the application

```bash
npm start
```

The frontend will normally be available at:

```text
http://localhost:3000
```

## 🔒 Security Considerations

The frontend includes:

* Protected routes
* JWT-based authentication
* Authentication state management
* Token expiration handling
* HTML sanitization using DOMPurify
* Permission-aware UI behavior

Security enforcement remains the responsibility of the backend as well.

## 📌 Project Status

The frontend currently provides the core user experience for the UVB blogging platform, including authentication flows, blog management, profile management, blog discovery, and reader interactions.

AI functionality is **not currently implemented** in this project.

## 🔮 Future Enhancements

Potential future improvements include:

* Advanced search and filtering
* Bookmarks
* Blogger following
* Notifications
* Personalized recommendations
* Blog analytics
* Improved moderation tools
* Premium subscriptions
* Expanded accessibility support
* Additional automated frontend testing

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

For major changes, please open an issue before submitting a large modification.

## 📄 License

Add the license you intend to use for this project.

## 👩‍💻 Author

**Rupanjali Saha**

GitHub:
https://github.com/rupanjalisaha
