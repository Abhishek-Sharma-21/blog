# Blog Application

A modern, full-featured blog application built with Next.js 15, TypeScript, and Drizzle ORM.

## Features

### 🔐 Authentication
- **User Registration**: Secure user registration with email and password
- **User Login**: JWT-based authentication with session management
- **Logout**: Secure logout with session cleanup
- **Protected Routes**: Middleware-based route protection

### 📝 Blog Posts
- **Create Posts**: Rich text editor for creating new blog posts
- **View Posts**: Beautiful post display with author information
- **Edit Posts**: Authors can edit their own posts
- **Delete Posts**: Authors can delete their own posts
- **Post Slugs**: SEO-friendly URLs for posts

### 🔍 Search Functionality
- **Full-Text Search**: Search across post titles, descriptions, and content
- **Real-time Results**: Instant search results with highlighting
- **Search Page**: Dedicated search page with advanced features

### 🎨 User Interface
- **Modern Design**: Clean, responsive design with Tailwind CSS
- **Dark Mode**: Theme switching with next-themes
- **Toast Notifications**: User feedback with Sonner
- **Loading States**: Smooth loading animations
- **Responsive Layout**: Mobile-first responsive design

### 🛠 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Database**: PostgreSQL with Drizzle ORM
- **Form Validation**: Zod schema validation with React Hook Form
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance**: Optimized with Next.js 15 and Turbopack

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
   JWT_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   npm run drizzle:generate
   # Run the generated SQL in your PostgreSQL database
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
blog/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── login/         # Authentication endpoints
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   ├── session/
│   │   │   ├── posts/         # Blog post endpoints
│   │   │   └── search/        # Search endpoint
│   │   ├── auth/              # Authentication pages
│   │   ├── post/              # Blog post pages
│   │   ├── search/            # Search page
│   │   └── profile/           # User profile (placeholder)
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── ui/                # UI components
│   │   ├── layouts/           # Layout components
│   │   └── theme/             # Theme components
│   └── lib/                   # Utility libraries
│       ├── db/                # Database configuration
│       └── session/           # Session management
├── drizzle/                   # Database migrations
└── public/                    # Static assets
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/session` - Get current session

### Blog Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[slug]` - Get single post
- `PUT /api/posts/[slug]` - Update post
- `DELETE /api/posts/[slug]` - Delete post

### Search
- `GET /api/search?q=query` - Search posts

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Posts Table
- `id` - Primary key
- `title` - Post title
- `description` - Post description
- `slug` - URL-friendly slug
- `content` - Post content
- `authorId` - Foreign key to users table
- `createdAt` - Post creation timestamp
- `updatedAt` - Last update timestamp

### Sessions Table
- `id` - Primary key
- `userId` - Foreign key to users table
- `token` - Session token
- `expiresAt` - Session expiration
- `ipAddress` - User's IP address
- `userAgent` - User's browser info

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


