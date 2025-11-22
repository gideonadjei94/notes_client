# NotesApp Frontend

A minimal and secure note-taking application built with React, TypeScript, and Tailwind CSS. This frontend application provides an elegant user interface for managing personal notes with advanced features like search, filtering, tagging, and soft deletion.

## 🌟 Features

### Authentication & Security

- **Secure Authentication** with JWT tokens
- **Dual Token System**
  - Access tokens stored in session storage (short-lived)
  - Refresh tokens encrypted and stored in local storage (long-lived)
  - Automatic token refresh on expiration
- **Protected Routes** with authentication guards
- **Session Management** with automatic logout on token expiration
- **Custom Encryption** for sensitive data storage

### Notes Management

- **Create, Edit, Update, Delete** notes with rich content
- **Soft Delete** functionality - deleted notes can be restored
- **Version Control** with optimistic locking to prevent conflicts
- **Tag System** for better organization
- **Real-time Search** across titles and content
- **Advanced Filtering** by tags (comma-separated)
- **Sorting Options** by created date, updated date, or title
- **Pagination** for efficient data loading

### User Experience

- **Elegant UI** with gradient backgrounds and smooth animations
- **Loading States** for all async operations
- **Toast Notifications** for user feedback
- **Responsive Design** - works on mobile, tablet, and desktop
- **Form Validation** with inline error messages
- **Floating Action Button** for quick note creation
- **Statistics Dashboard** showing total, active, and deleted notes

### Developer Experience

- **TypeScript** for type safety
- **Context API** for state management
- **Custom Hooks** for reusable logic
- **Modular Architecture** with clear separation of concerns
- **Error Handling** with user-friendly messages
- **Optimized API Calls** with axios interceptors

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework
- **clsx** - Conditional className utility
- **Lucide React** - Beautiful icon set
- **Context API** - Global state management

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx              # Login form component
│   │   └── Signup.tsx             # Signup form component
│   ├── common/
│   │   ├── CustomToast.tsx        # Toast notification component
│   │   ├── LoadingScreen.tsx      # Full-screen loading animation
│   │   └── LoadingSpinner.tsx     # Reusable spinner component
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx    # Dashboard navigation header
│   │   ├── NoteCard.tsx           # Individual note card component
│   │   ├── NoteModal.tsx          # Create/Edit note modal
│   │   ├── NotesFilters.tsx       # Search, filter, and sort controls
│   │   ├── NotesList.tsx          # Notes grid with pagination
│   │   └── NotesStats.tsx         # Statistics cards
│   └── routes/
│       ├── ProtectedRoute.tsx     # Route guard for authenticated users
│       └── PublicRoute.tsx        # Route guard for public pages
├── context/
│   ├── AuthContext.tsx            # Authentication state and methods
│   ├── NotesContext.tsx           # Notes state and CRUD operations
│   └── ToastContext.tsx           # Toast notification system
├── pages/
│   ├── index.tsx                  # Landing/loading page with routing logic
│   ├── auth/
│   │   └── index.tsx              # Authentication page (login/signup)
│   └── dashboard/
│       └── index.tsx              # Main dashboard page
├── types/
│   └── index.ts                   # TypeScript interfaces and types
├── utils/
│   ├── api.ts                     # API service with axios configuration
│   ├── crypto.ts                  # Token encryption utilities
│   └── storage.ts                 # Storage utilities (session/local)
├── App.tsx                        # Root component with routing
├── main.tsx                       # Application entry point
└── index.css                      # Global styles and Tailwind imports
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running (see backend README)

### Installation

1. **Clone the repository**

```bash
   git clone <repository-url>
   cd notes-app-frontend
```

2. **Install dependencies**

```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

```env
   VITE_API_BASE_URL=http://localhost:8082/api
   VITE_ENCRYPTION_KEY=your-secure-encryption-key-here
```

4. **Start the development server**

```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
```

5. **Open your browser**

   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The optimized production build will be in the `dist/` directory.

## 🔐 Security Implementation

### Token Management

1. **Access Token (Session Storage)**

   - Short-lived JWT token
   - Included in all API requests via Authorization header
   - Automatically cleared on logout or expiration
   - Never persisted beyond browser session

2. **Refresh Token (Local Storage)**
   - Long-lived JWT token
   - Encrypted before storage using custom encryption
   - Used to obtain new access tokens
   - Cleared on explicit logout

### Authentication Flow

```
1. User Login/Signup
   ↓
2. Receive tokens from API
   ↓
3. Store access token in session storage
   ↓
4. Encrypt & store refresh token in local storage
   ↓
5. Include access token in API requests
   ↓
6. On 401 error → Use refresh token to get new access token
   ↓
7. Retry original request with new token
   ↓
8. If refresh fails → Redirect to login
```

### API Interceptors

```typescript
// Request Interceptor
- Automatically adds Bearer token to all requests
- Ensures authentication for protected routes

// Response Interceptor
- Catches 401 errors
- Attempts token refresh
- Queues failed requests during refresh
- Retries failed requests with new token
- Redirects to login on refresh failure
```

## 📋 Key Features Explained

### 1. Soft Delete with Restore

Notes are not permanently deleted but marked with a `deletedAt` timestamp:

```typescript
// Frontend filtering
const notes = useMemo(() => {
  if (showDeleted) {
    return allNotes;
  }
  return allNotes.filter((note) => !note.deletedAt);
}, [allNotes, showDeleted]);
```

- Toggle "Show Deleted" to view soft-deleted notes
- Restore button appears for deleted notes
- Deleted notes have visual indicators (red border, badge)

### 2. Optimistic Locking

Prevents concurrent update conflicts using version numbers:

```typescript
// If-Match header with version
headers["If-Match"] = `"${version}"`;

// Server validates version before update
// Returns 409 Conflict if versions don't match
```

### 3. Real-time Search & Filtering

- Search across note titles and content
- Filter by multiple tags (comma-separated)
- Sort by created date, updated date, or title
- All filters work together seamlessly
- Reset filters with one click

### 4. Smart Token Refresh

```typescript
// Automatic token refresh flow
if (error.response?.status === 401 && !originalRequest._retry) {
  // Queue requests during refresh
  // Refresh token once for multiple 401s
  // Retry all queued requests
  // Logout if refresh fails
}
```

### 5. Toast Notification System

Context-based toast system with multiple types:

- **Success** - Green with checkmark icon
- **Error** - Red with alert icon
- **Info** - Blue with info icon
- **Warning** - Amber with warning icon

Auto-dismisses after 5 seconds with manual close option.

### 6. Loading States

- **Index Page** - Animated loading screen while checking auth
- **Dashboard** - Loading spinner while fetching notes
- **Protected Routes** - Loading screen during authentication check
- **Forms** - Button loading states during submission

## 🎨 UI/UX Highlights

### Design Principles

1. **Consistency** - Uniform spacing, colors, and interactions
2. **Feedback** - Every action provides visual feedback
3. **Accessibility** - Proper focus states and keyboard navigation
4. **Responsiveness** - Mobile-first design approach
5. **Performance** - Optimized renders with useMemo and useCallback

### Color Scheme

```css
Primary: Blue gradient (from-blue-600 to-purple-600)
Success: Green (green-600)
Error: Red (red-600)
Warning: Amber (amber-600)
Info: Blue (blue-600)
Background: Gradient (from-gray-50 via-blue-50 to-purple-50)
```

### Animations

- Smooth page transitions
- Hover effects on interactive elements
- Loading spinner with rotation animation
- Toast slide-in animation
- Modal fade-in with backdrop
- Card hover lift effect

## 🔧 State Management

### Context Structure

1. **AuthContext**

   - User state
   - Authentication methods (login, signup, logout)
   - Token management
   - Auto-loading user on app start

2. **NotesContext**

   - Notes array (filtered by deleted state)
   - CRUD operations
   - Filters and pagination state
   - Show deleted toggle

3. **ToastContext**
   - Toast state
   - showToast method
   - Auto-dismiss timer

## 🧪 Best Practices

### Code Quality

- ✅ TypeScript for type safety
- ✅ Proper error handling with try-catch
- ✅ Loading states for async operations
- ✅ Form validation with inline errors
- ✅ Reusable components and hooks
- ✅ Consistent naming conventions
- ✅ Comments for complex logic

### Performance

- ✅ React.memo for expensive components
- ✅ useMemo for computed values
- ✅ useCallback for event handlers
- ✅ Lazy loading for routes (future enhancement)
- ✅ Debouncing for search inputs (future enhancement)

### Security

- ✅ No sensitive data in localStorage (encrypted)
- ✅ XSS protection with React's built-in escaping
- ✅ CSRF protection via JWT tokens
- ✅ Secure token storage strategy
- ✅ Automatic logout on token expiration

## 📊 API Integration

### Endpoints Used

```
POST   /api/auth/login          - User login
POST   /api/auth/signup         - User registration
POST   /api/auth/refresh        - Refresh access token
POST   /api/auth/logout         - User logout
GET    /api/auth/me             - Get current user

GET    /api/notes               - Get all notes (with filters)
POST   /api/notes               - Create new note
GET    /api/notes/:id           - Get note by ID
PUT    /api/notes/:id           - Update note
DELETE /api/notes/:id           - Soft delete note
POST   /api/notes/:id/restore   - Restore deleted note
```

### Request/Response Examples

**Create Note**

```json
POST /api/notes
{
  "title": "My Note",
  "content": "Note content here",
  "tags": ["work", "important"]
}

Response: 201 Created
{
  "id": 1,
  "title": "My Note",
  "content": "Note content here",
  "tags": ["work", "important"],
  "version": 0,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "deletedAt": null
}
```

## 🐛 Error Handling

### API Errors

- Network errors → Toast notification
- 401 Unauthorized → Auto token refresh or redirect to login
- 403 Forbidden → Error toast with message
- 404 Not Found → Error toast
- 409 Conflict → Version conflict warning
- 500 Server Error → Generic error message

### Form Validation Errors

- Required fields → Inline error messages
- Format validation → Real-time feedback
- Server-side errors → Toast notification + inline errors

## 🚧 Future Enhancements

- [ ] Rich text editor for note content
- [ ] Markdown support
- [ ] Note sharing functionality
- [ ] Collaborative editing
- [ ] File attachments
- [ ] Dark mode toggle
- [ ] Export notes (PDF, Markdown)
- [ ] Advanced search with filters
- [ ] Keyboard shortcuts
- [ ] Offline mode with sync
- [ ] Note templates
- [ ] Reminders and notifications
- [ ] Note categories/folders
- [ ] Activity history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide for the beautiful icons
- Vite for the blazing fast dev experience

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
