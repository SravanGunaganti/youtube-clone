<p align="center">
  <img src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg" width="300" alt="YouTube Logo" />
</p>
<h1 align="center">YouTube Clone - MERN Stack</h1>

A full-featured YouTube clone built with the MERN (MongoDB, Express.js, React, Node.js) stack, featuring user authentication, video management, and channel functionality.

## 🚀 Features

### User Authentication
- JWT-based authentication
- User registration and login
- Profile management with avatar
- Protected routes

### Video Management
- Video upload with metadata (title, description, thumbnail)
- YouTube-style video player
- Video editing and deletion (owner only)
- View count tracking
- Like/Dislike functionality

### Channel System
- Channel creation and customization
- Banner and avatar upload with preview
- Subscribe/Unsubscribe functionality
- Channel statistics (subscribers, videos)

### Comments System
- Add, edit, and delete comments
- Like/Dislike comments
- Authentication required for posting

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests
- **Dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **React Icons** - Icons
- **Axios** - HTTP client
- **React Toastify** - Notifications

## 📁 Project Structure

```
└── 📁youtube-mern
    └── 📁client
        └── 📁public
            ├── favicon.ico
            ├── vite.svg
        └── 📁src
            └── 📁assets
                └── 📁youtube-icons
                └── 📁youtube-logos
            └── 📁components
                └── 📁channel
                    ├── ChannelInfo.jsx
                    ├── CreateChannelModal.jsx
                    ├── NoChannelPrompt.jsx
                    ├── SignInPrompt.jsx
                    ├── TabsContent.jsx
                    ├── UpdateChannelModal.jsx
                    ├── UpdateVideoModal.jsx
                    ├── UploadVideoModal.jsx
                ├── ChannelNotFound.jsx
                ├── ChannelPage.jsx
                ├── CommentCard.jsx
                ├── ConfirmModal.jsx
                ├── EditProfileModal.jsx
                ├── FilterButtons.jsx
                ├── Header.jsx
                ├── Home.jsx
                ├── Loader.jsx
                ├── MiniSidebar.jsx
                ├── Overlay.jsx
                ├── PageNotFound.jsx
                ├── RootErrorBoundary.jsx
                ├── Sidebar.jsx
                ├── SignIn.jsx
                ├── SignUp.jsx
                ├── UserProfileDropdown.jsx
                ├── VideoCard.jsx
                ├── VideoGrid.jsx
                ├── VideoNotFound.jsx
                ├── VideoPlayer.jsx
            └── 📁constants
                ├── categories.js
                ├── sidebarLinks.js
            └── 📁context
                ├── AuthContext.jsx
            └── 📁helpers
                ├── useActivePath.js
            └── 📁services
                ├── api.js
            └── 📁utils
                ├── authUtils.js
                ├── utilityFunctions.js
                ├── validators.js
            ├── App.jsx
            ├── index.css
            ├── main.jsx
            ├── RouterWrapper.jsx
        ├── .env
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── vite.config.js
    └── 📁server
        └── 📁controllers
            ├── channel.controller.js
            ├── comment.controller.js
            ├── user.controller.js
            ├── video.controller.js
        └── 📁middlewares
            ├── authenticateToken.js
            ├── errorHandlers.js
            ├── validateObjectId.js
            ├── validateUser.js
        └── 📁models
            ├── Channel.model.js
            ├── Comment.model.js
            ├── User.model.js
            ├── Video.model.js
        └── 📁routes
            ├── channel.routes.js
            ├── comment.routes.js
            ├── user.routes.js
            ├── video.routes.js
        └── 📁utils
            ├── generateToken.js
            ├── sendErrorResponse.js
            ├── sendSuccessResponse.js
            ├── validators.js
        ├── .env
        ├── index.js
        ├── package-lock.json
        ├── package.json
        ├── seedData.js
    ├── .gitignore
    └── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SravanGunaganti/youtube-clone
   cd youtube-clone
   ```

2. **Set up environment variables**
   - Create `.env` file in the server directory:
     ```env
     PORT=5050
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - For the client, create `.env` in the client directory:
     ```env
     VITE_API_URL=http://localhost:5050/api
     ```

3. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

4. **Run the application**
   - Start the backend server:
     ```bash
     cd server
     npm run dev
     ```
     - Seed sample data to database:
     ```bash
     cd server
     npm run seed
     ```
   - In a new terminal, start the frontend:
     ```bash
     cd client
     npm run dev
     ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5050/api

## 🎨 UI/UX Features

### Modern Design System
- **YouTube-inspired interface** with professional styling
- **Responsive design** for all screen sizes
- **Consistent color palette** and typography

### Component Features
- **VideoPlayer**: Custom video controls, like/dislike, comments
- **ChannelPage**: Channel management, video grid, statistics, subscription, owner actions customize channel, add/update/delete video with preview for thumbnail and videoUrl,update channel 
- **Navbar**: Search, user profile dropdown, navigation, edit profile pop up with name and avatar support
- **Sidebar**: navigation menu
- **VideoCard**: Video thumbnails, metadata, hover effects
- ** Home**: Video grid, sfilter buttons and skeletion style loading for grid video card play on hover and reset on mouse leave like youtube implementation
## 🔐 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **Input Validation**
- **CORS Configuration** for secure cross-origin requests
- **Protected Routes** with authentication middleware
- **Owner-only Actions** for video/comment management

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Users
- `PUT /api/users/profile` - Update user profile

### Channels
- `GET /api/channels/:channelId` - Get channel by 
- `POST /api/channels` - Create new channel
- `PUT /api/channels/:ChannelId` - Update channel
- `GET /api/my-channel` - Get user's channel
- `GET /api/channels/:channelId/exist` Checks channel exist
- `DELETE /api/channels/:channelId` - Delete channel

- `POST /api/channels/:channelId/subscribe` - Subscribe to channel
- `GET /api/channels/:channelId/subscription-status` - Check subscription status


### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:video Id` - Get video details
- `POST /api/videos` - Upload new video
- `GET /api/videos/:videoId/exist` Checks video exist
- `PUT /api/videos/:videoId` - Update video  
- `DELETE /api/videos/:videoId` - Delete video
- `PUT /api/videos/:videoId/like` - Toggle like/dislike
- `GET /api/videos/:videoId/like-status` - Get user's like status
- `/api/channels/:channelId/videos` - Get videos by channel

### Comments
- `GET /api/comments/video/:videoId` - Get video comments
- `POST /api/comments` - Add new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `PUT /api/comments/:id/like` - Toggle comment like/dislike
- `GET /api/comments/:id/like-status` - Get user's like status


## 🛠 Development

### Available Scripts

#### Backend (in `/server` directory)
- `npm run dev` - Start the development server with nodemon
- `npm start` - Start the production server
- `npm run seed` - Seed the database with sample data

#### Frontend (in `/client` directory)
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build


## 📈 Performance Optimizations

- **Lazy Loading** for components and images
- **Code Splitting** for optimized bundle sizes
