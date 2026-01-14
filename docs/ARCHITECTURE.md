# Anythink Market Architecture

## System Overview

Anythink Market is a full-stack marketplace application built with a modern microservices architecture, containerized using Docker. The system consists of three main components:

1. **Frontend** - React/Redux SPA
2. **Backend** - Node.js/Express REST API
3. **Database** - MongoDB

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │   Frontend       │  │   Backend        │            │
│  │   React/Redux    │◄─┤   Node.js/Express│            │
│  │   Port: 3001     │  │   Port: 3000     │            │
│  └──────────────────┘  └──────────────────┘            │
│                              │                           │
│                              ▼                           │
│                       ┌──────────────────┐              │
│                       │   MongoDB        │              │
│                       │   Port: 27017    │              │
│                       └──────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack

- **React** - UI library for building component-based interfaces
- **Redux** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **SCSS** - Styling

### Project Structure

```
frontend/
├── public/              # Static assets
│   ├── index.html
│   └── style.css
├── src/
│   ├── components/      # React components
│   │   ├── App.js      # Root component
│   │   ├── Header.js   # Navigation header
│   │   ├── Home/       # Home page components
│   │   ├── Item/       # Item detail components
│   │   └── ...
│   ├── reducers/        # Redux reducers
│   │   ├── auth.js
│   │   ├── item.js
│   │   └── ...
│   ├── constants/       # Action types
│   ├── agent.js         # API client
│   ├── store.js         # Redux store configuration
│   └── index.js         # Entry point
└── Dockerfile
```

### State Management

The application uses Redux for centralized state management with the following structure:

**Store Slices:**
- `auth` - User authentication state
- `common` - Global app state
- `editor` - Item editor state
- `home` - Home page state
- `item` - Item detail state
- `itemList` - Item list state
- `profile` - User profile state
- `settings` - User settings state

### Routing

```
/ (Home)                  - Homepage with item list
/login                    - User login
/register                 - User registration
/settings                 - User settings
/editor                   - Create new item
/editor/:slug             - Edit existing item
/item/:slug               - Item detail page
/@:username               - User profile
/@:username/favorites     - User's favorited items
```

---

## Backend Architecture

### Technology Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **Passport** - Authentication middleware
- **JWT** - Token-based authentication
- **bcrypt/crypto** - Password hashing

### Project Structure

```
backend/
├── app.js               # Express app configuration
├── config/
│   ├── index.js        # Configuration management
│   └── passport.js     # Passport authentication setup
├── models/              # Mongoose models
│   ├── User.js
│   ├── Item.js
│   └── Comment.js
├── routes/
│   ├── auth.js         # Authentication middleware
│   └── api/            # API routes
│       ├── index.js    # API router configuration
│       ├── users.js    # User endpoints
│       ├── profiles.js # Profile endpoints
│       ├── items.js    # Item endpoints
│       ├── comments.js # Comment endpoints
│       ├── tags.js     # Tag endpoints
│       └── ping.js     # Health check
├── lib/
│   └── event.js        # Event emission library
└── scripts/
    └── seeds.js        # Database seeding
```

### Middleware Stack

1. **CORS** - Enable cross-origin requests
2. **Body Parser** - Parse JSON request bodies
3. **Morgan** - HTTP request logging
4. **Passport** - JWT authentication
5. **Error Handler** - Custom error handling

### Authentication Flow

```
1. User submits credentials
2. Server validates credentials
3. Server generates JWT token
4. Client stores token (localStorage)
5. Client includes token in Authorization header
6. Server validates token on protected routes
7. Server attaches user data to request (req.payload)
```

### Data Models

#### User Model
- Username (unique, alphanumeric)
- Email (unique, validated)
- Password (hashed with salt)
- Bio, image
- Role (user/admin)
- Favorites (array of item references)
- Following (array of user references)

**Methods:**
- `setPassword()` - Hash password
- `validPassword()` - Validate password
- `generateJWT()` - Create JWT token
- `favorite()`, `unfavorite()`, `isFavorite()`
- `follow()`, `unfollow()`, `isFollowing()`

#### Item Model
- Slug (unique identifier)
- Title, description, image
- Tag list
- Seller (user reference)
- Comments (array of comment references)
- Favorites count

**Methods:**
- `slugify()` - Generate unique slug
- `updateFavoriteCount()` - Update favorites count
- `toJSONFor(user)` - Serialize for response

#### Comment Model
- Body (comment text)
- Seller (user reference)
- Item (item reference)

**Methods:**
- `toJSONFor(user)` - Serialize for response

---

## Database Architecture

### MongoDB Schema Design

```
Users Collection
├── _id
├── username (indexed)
├── email (indexed)
├── hash
├── salt
├── bio
├── image
├── role
├── favorites []
├── following []
├── createdAt
└── updatedAt

Items Collection
├── _id
├── slug (unique, indexed)
├── title
├── description
├── image
├── tagList []
├── seller (ref: Users)
├── comments [] (ref: Comments)
├── favoritesCount
├── createdAt
└── updatedAt

Comments Collection
├── _id
├── body
├── seller (ref: Users)
├── item (ref: Items)
├── createdAt
└── updatedAt
```

### Indexes

- `User.username` - Unique index
- `User.email` - Unique index
- `Item.slug` - Unique index

### Relationships

- **User ↔ Items** - One-to-many (seller)
- **User ↔ Items** - Many-to-many (favorites)
- **User ↔ Users** - Many-to-many (following)
- **Item ↔ Comments** - One-to-many
- **User ↔ Comments** - One-to-many (author)

---

## Container Architecture

### Docker Compose Services

#### anythink-backend-node
- **Base Image:** Node.js
- **Port:** 3000
- **Dependencies:** MongoDB
- **Environment:**
  - `NODE_ENV=development`
  - `PORT=3000`
  - `MONGODB_URI=mongodb://mongodb-node:27017/anythink-market`
- **Volumes:** Source code mounted for hot reload
- **Health Check:** Wait for MongoDB before starting

#### anythink-frontend-react
- **Base Image:** Node.js
- **Port:** 3001
- **Dependencies:** Backend
- **Environment:**
  - `NODE_ENV=development`
  - `PORT=3001`
  - `REACT_APP_BACKEND_URL`
  - `WDS_SOCKET_PORT`
- **Volumes:** Source code mounted for hot reload
- **Health Check:** Wait for backend before starting

#### mongodb-node
- **Base Image:** mongo (official)
- **Port:** 27017
- **Volumes:** Persistent data storage at `~/mongo/data`
- **Logging:** Disabled for performance

### Container Communication

Containers communicate within the Docker network:
- Frontend → Backend: `http://anythink-backend-node:3000`
- Backend → MongoDB: `mongodb://mongodb-node:27017`

---

## Security Architecture

### Authentication
- JWT tokens with 60-day expiration
- Password hashing using PBKDF2 with SHA-512
- 10,000 iterations, 512-bit key length
- Random salt per user

### Authorization
- Route-level authentication (auth.required, auth.optional)
- Resource ownership validation
- Role-based access control (user/admin)

### Data Validation
- Mongoose schema validation
- Email format validation
- Username format validation (alphanumeric only)
- Required field validation
- Unique constraint validation

---

## API Design Patterns

### RESTful Conventions
- Resource-based URLs
- HTTP verbs (GET, POST, PUT, DELETE)
- Status codes (200, 401, 403, 404, 422, 500)
- JSON request/response bodies

### Route Parameters
```javascript
router.param('item', preloadMiddleware)
router.param('comment', preloadMiddleware)
router.param('username', preloadMiddleware)
```

### Error Handling
- Centralized error handling middleware
- Mongoose validation error formatting
- Consistent error response structure

### Response Formatting
- Envelope pattern: `{ user: {...} }`, `{ items: [...] }`
- Conditional data inclusion based on authentication
- Populated references for related data

---

## Event System

The application includes an event emission system for external integrations:

```javascript
sendEvent('user_created', { username })
sendEvent('item_created', { item })
```

Events can be processed by:
- Analytics systems
- Notification services
- Webhook endpoints
- Message queues

---

## Scalability Considerations

### Current Architecture
- Monolithic backend
- Single database instance
- Container-based deployment

### Potential Improvements
1. **Horizontal Scaling**
   - Load balancer for multiple backend instances
   - MongoDB replica set for read scaling
   - Session store for distributed authentication

2. **Caching Layer**
   - Redis for session management
   - Item list caching
   - Tag list caching

3. **CDN Integration**
   - Static asset delivery
   - Image optimization

4. **Microservices Split**
   - Authentication service
   - Item service
   - Comment service
   - Notification service

5. **Database Optimization**
   - Sharding for large datasets
   - Read replicas
   - Index optimization

---

## Monitoring & Logging

### Current Implementation
- Morgan HTTP request logging
- Console error logging

### Recommended Additions
- Application performance monitoring (APM)
- Error tracking (Sentry, Rollbar)
- Log aggregation (ELK Stack, Splunk)
- Metrics collection (Prometheus, Grafana)
- Health check endpoints

---

## Development Workflow

1. **Local Development**
   - Docker Compose for full stack
   - Hot reload enabled
   - Source code volumes mounted

2. **Testing**
   - E2E tests (Jest)
   - Frontend tests (Playwright)
   - API tests (Postman collection)

3. **Deployment**
   - Kubernetes manifests in `/charts`
   - AWS Dockerfiles available
   - Environment-based configuration

---

## Technology Versions

- Node.js: Latest LTS
- React: 18.x
- MongoDB: Latest
- Express: 4.x
- Mongoose: 6.x
