# Anythink Market Development Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Git Workflow](#git-workflow)
7. [Common Tasks](#common-tasks)
8. [Debugging](#debugging)
9. [Contributing](#contributing)

---

## Getting Started

### First-Time Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Wilcolab/Anythink-Market-fnscfx3q.git
   cd Anythink-Market-fnscfx3q
   ```

2. **Start the development environment**
   ```bash
   docker compose up
   ```

3. **Verify installation**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000/api/ping
   - Expected response: `{"message":"pong"}`

4. **Seed the database** (optional)
   ```bash
   docker exec anythink-backend-node npm run seed
   ```

### Development Tools

- **IDE:** VS Code recommended
- **Extensions:**
  - ESLint
  - Prettier
  - Docker
  - GitLens
  - MongoDB for VS Code

---

## Development Environment

### Using Docker Compose (Recommended)

Docker Compose provides a complete development environment with hot-reload enabled.

**Start services:**
```bash
docker compose up
```

**Stop services:**
```bash
docker compose down
```

**View logs:**
```bash
docker compose logs -f
```

### Using Codespaces

1. Click "Code" → "Open with Codespaces" on GitHub
2. Wait for environment to initialize
3. Run `docker compose up`
4. Access forwarded ports

### Local Development (Without Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

**MongoDB:**
```bash
mongod --dbpath /path/to/data
```

---

## Project Structure

### Overview

```
Anythink-Market-fnscfx3q/
├── backend/              # Node.js/Express API
├── frontend/             # React/Redux SPA
├── charts/               # Kubernetes deployment
├── tests/                # End-to-end tests
├── docs/                 # Documentation
├── docker-compose.yml    # Docker orchestration
└── readme.md            # Project overview
```

### Backend Structure

```
backend/
├── app.js               # Express app entry point
├── package.json         # Dependencies
├── config/              # Configuration files
│   ├── index.js        # App configuration
│   └── passport.js     # Authentication config
├── models/              # Mongoose data models
│   ├── User.js
│   ├── Item.js
│   └── Comment.js
├── routes/              # API route handlers
│   ├── auth.js         # Auth middleware
│   └── api/
│       ├── index.js
│       ├── users.js
│       ├── profiles.js
│       ├── items.js
│       ├── comments.js
│       ├── tags.js
│       └── ping.js
├── lib/                 # Utility libraries
│   └── event.js
└── scripts/             # Utility scripts
    └── seeds.js
```

### Frontend Structure

```
frontend/
├── public/              # Static assets
│   ├── index.html
│   └── style.css
├── src/
│   ├── index.js        # App entry point
│   ├── App.js          # Root component
│   ├── agent.js        # API client
│   ├── store.js        # Redux store
│   ├── reducer.js      # Root reducer
│   ├── components/     # React components
│   │   ├── Home/
│   │   ├── Item/
│   │   └── ...
│   ├── reducers/       # Redux reducers
│   └── constants/      # Action types
└── package.json
```

---

## Coding Standards

### JavaScript Style Guide

**Use ESLint configuration:**
```json
{
  "extends": ["eslint:recommended"],
  "env": {
    "node": true,
    "es6": true
  }
}
```

**Key Conventions:**
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use async/await over callbacks
- Meaningful variable names
- No unused variables

### Code Formatting

**Use Prettier:**
```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "none"
}
```

**Run formatter:**
```bash
npm run format
```

### Naming Conventions

**Files:**
- Components: `PascalCase.js` (e.g., `ItemList.js`)
- Utilities: `camelCase.js` (e.g., `agent.js`)
- Constants: `UPPER_CASE.js` (e.g., `actionTypes.js`)

**Variables:**
- camelCase for variables and functions
- PascalCase for classes and components
- UPPER_SNAKE_CASE for constants

**Database:**
- Collections: PascalCase singular (e.g., `User`)
- Fields: camelCase (e.g., `firstName`)

### Comments

```javascript
/**
 * Get all items with optional filters
 * @param {Object} filters - Query filters
 * @param {string} filters.tag - Filter by tag
 * @param {string} filters.seller - Filter by seller username
 * @returns {Promise<Array>} Array of items
 */
async function getItems(filters) {
  // Implementation
}
```

---

## Testing

### Running Tests

**E2E Tests (Backend):**
```bash
cd tests/e2e
npm install
npm run test:concurrent  # Parallel tests
npm run test:sequential  # Sequential tests
```

**Frontend Tests:**
```bash
cd tests/frontend
npm install
npm test
```

**Postman Tests:**
Import `backend/tests/api-tests.postman.json` into Postman.

### Writing Tests

**Backend E2E Test Example:**
```javascript
describe("Items API", () => {
  it("should create a new item", async () => {
    const response = await client.createItem({
      title: "Test Item",
      description: "Test Description",
      tagList: ["test"]
    });
    
    expect(response.status).toBe(200);
    expect(response.data.item).toHaveProperty("slug");
  });
});
```

**Frontend Test Example:**
```javascript
test("renders item list", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".item-preview")).toBeVisible();
});
```

### Test Coverage

```bash
# Run with coverage
npm run test:coverage

# View coverage report
open coverage/index.html
```

---

## Git Workflow

### Branch Strategy

**Main Branches:**
- `main` - Production-ready code
- `develop` - Integration branch

**Feature Branches:**
- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Creating a Feature

1. **Create branch from main:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/new-feature
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to remote:**
   ```bash
   git push origin feature/new-feature
   ```

4. **Create Pull Request:**
   - Go to GitHub
   - Create PR against `main`
   - Add @vanessa-cooper as reviewer
   - Fill in PR template

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```
feat(items): add pagination to item list

fix(auth): resolve token expiration issue

docs(api): update endpoint documentation
```

---

## Common Tasks

### Adding a New API Endpoint

1. **Define route in appropriate file:**
   ```javascript
   // backend/routes/api/items.js
   router.get("/featured", auth.optional, async (req, res, next) => {
     try {
       const items = await Item.find({ featured: true });
       res.json({ items });
     } catch (err) {
       next(err);
     }
   });
   ```

2. **Add to API client:**
   ```javascript
   // frontend/src/agent.js
   const Items = {
     all: (page) => requests.get(`/items?limit=10&offset=${page * 10}`),
     featured: () => requests.get("/items/featured"),
   };
   ```

3. **Test the endpoint:**
   ```bash
   curl http://localhost:3000/api/items/featured
   ```

### Adding a New React Component

1. **Create component file:**
   ```javascript
   // frontend/src/components/Featured.js
   import React from "react";
   
   const Featured = ({ items }) => {
     return (
       <div className="featured-items">
         {items.map(item => (
           <ItemPreview key={item.slug} item={item} />
         ))}
       </div>
     );
   };
   
   export default Featured;
   ```

2. **Create reducer if needed:**
   ```javascript
   // frontend/src/reducers/featured.js
   const defaultState = {
     items: [],
     loading: false
   };
   
   export default (state = defaultState, action) => {
     switch (action.type) {
       case "FEATURED_LOADED":
         return { ...state, items: action.payload, loading: false };
       default:
         return state;
     }
   };
   ```

3. **Connect to Redux:**
   ```javascript
   import { connect } from "react-redux";
   
   const mapStateToProps = state => ({
     items: state.featured.items
   });
   
   export default connect(mapStateToProps)(Featured);
   ```

### Adding Database Migration

```javascript
// backend/scripts/migration.js
const mongoose = require("mongoose");
const Item = mongoose.model("Item");

async function migrate() {
  const items = await Item.find({ featured: { $exists: false } });
  
  for (let item of items) {
    item.featured = false;
    await item.save();
  }
  
  console.log(`Migrated ${items.length} items`);
}

mongoose.connect(process.env.MONGODB_URI).then(migrate);
```

Run migration:
```bash
docker exec anythink-backend-node node scripts/migration.js
```

### Environment Variables

Add to appropriate `.env` file:

```bash
# backend/.env
NEW_FEATURE_ENABLED=true
EXTERNAL_API_KEY=your-key-here

# frontend/.env
REACT_APP_NEW_FEATURE=true
```

Access in code:
```javascript
// Backend
const enabled = process.env.NEW_FEATURE_ENABLED === "true";

// Frontend
const enabled = process.env.REACT_APP_NEW_FEATURE === "true";
```

---

## Debugging

### Backend Debugging

**Console Logging:**
```javascript
console.log("Debug:", variable);
```

**VS Code Debugger:**

Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "attach",
  "name": "Docker: Attach to Node",
  "port": 9229,
  "address": "localhost",
  "localRoot": "${workspaceFolder}/backend",
  "remoteRoot": "/usr/src/backend",
  "protocol": "inspector"
}
```

**MongoDB Queries:**
```bash
docker exec -it mongodb-node mongosh
use anythink-market
db.items.find().pretty()
```

### Frontend Debugging

**React DevTools:**
- Install browser extension
- Inspect component tree and state

**Redux DevTools:**
- Install browser extension
- Monitor actions and state changes

**Console Debugging:**
```javascript
console.log("Props:", this.props);
console.log("State:", this.state);
```

**Network Tab:**
- Monitor API requests
- Check request/response data

### Common Issues

**Port Already in Use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Module Not Found:**
```bash
docker compose down
docker compose up --build
```

**Database Connection:**
```bash
docker compose logs mongodb-node
docker exec mongodb-node mongosh --eval "db.adminCommand('ping')"
```

---

## Contributing

### Before Submitting PR

- [ ] Code follows style guide
- [ ] Tests pass locally
- [ ] No ESLint warnings
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

### PR Review Process

1. Automated checks run (CI/CD)
2. Code review by maintainer
3. Address feedback
4. Approval and merge

### Code Review Checklist

**Functionality:**
- [ ] Feature works as intended
- [ ] Edge cases handled
- [ ] Error handling implemented

**Code Quality:**
- [ ] Clean, readable code
- [ ] No code duplication
- [ ] Proper abstractions
- [ ] Performance considerations

**Testing:**
- [ ] Tests included
- [ ] Tests pass
- [ ] Coverage maintained

**Documentation:**
- [ ] Code comments where needed
- [ ] API docs updated
- [ ] README updated if needed

---

## Resources

### Documentation
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [MongoDB](https://docs.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

### Tools
- [Postman](https://www.postman.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Learning
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Patterns](https://reactpatterns.com/)
- [REST API Design](https://restfulapi.net/)

---

## Getting Help

- Check existing documentation
- Search closed issues on GitHub
- Ask in team chat
- Create GitHub issue with:
  - Clear description
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment details
  - Relevant logs

---

## Quick Reference

**Start Development:**
```bash
docker compose up
```

**Run Tests:**
```bash
cd tests/e2e && npm test
```

**View Logs:**
```bash
docker compose logs -f anythink-backend-node
```

**Access Database:**
```bash
docker exec -it mongodb-node mongosh
```

**Format Code:**
```bash
npm run format
```

**Create Feature Branch:**
```bash
git checkout -b feature/my-feature
```
