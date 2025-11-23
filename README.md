# CR Tool - Change Request Management System

A professional change management tool built for Salla to track and manage change requests with a modern web interface.

## Features

- **Custom Authentication** - Secure username/password authentication with JWT tokens and bcrypt password hashing
- **Change Request Management** - Create, view, update, and search change requests
- **Dashboard** - Overview of all CRs with statistics and status tracking
- **Role-Based Access** - Admin and user roles with different permissions
- **Notifications** - Real-time notifications for pending CRs assigned to users
- **Status Tracking** - Six status levels: draft, pending, approved, rejected, implemented, rolled back
- **Priority Levels** - Four priority levels: low, medium, high, critical
- **User Management** - Admins can create users and assign roles
- **Salla Branding** - Custom theme matching Salla's brand colors

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, shadcn/ui components
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: JWT with bcrypt password hashing
- **Testing**: Vitest

---

## Getting Started - Step by Step

### Prerequisites

Before you begin, make sure you have these installed on your machine:

1. **Node.js** (version 22.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **pnpm** package manager
   - Install globally: `npm install -g pnpm`
   - Verify installation: `pnpm --version`

3. **MySQL** or **TiDB** database
   - MySQL download: https://dev.mysql.com/downloads/
   - Or use a cloud database service
   - Make sure the database server is running

---

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/moebinalsh/CR-tool.git
cd CR-tool
```

---

### Step 2: Install Dependencies

Install all required packages for both frontend and backend:

```bash
pnpm install
```

This will install:
- React and related frontend libraries
- Express and tRPC for the backend
- Database drivers and ORM
- All other dependencies

**Wait for installation to complete** (may take 1-2 minutes)

---

### Step 3: Set Up Database Connection

Create a `.env` file in the root directory:

```bash
touch .env
```

Open the `.env` file in your text editor and add:

```env
DATABASE_URL=mysql://username:password@localhost:3306/cr_tool
PORT=3000
```

**Replace the following:**
- `username` → your MySQL username (commonly `root`)
- `password` → your MySQL password
- `localhost:3306` → your database host and port
- `cr_tool` → the database name you want to use

**Example configuration:**
```env
DATABASE_URL=mysql://root:mypassword@localhost:3306/cr_tool
PORT=3000
```

**For remote databases:**
```env
DATABASE_URL=mysql://user:pass@db.example.com:3306/cr_tool
PORT=3000
```

---

### Step 4: Create the Database

Log into your MySQL server:

```bash
mysql -u root -p
```

Enter your MySQL password when prompted.

Then create the database:

```sql
CREATE DATABASE cr_tool;
EXIT;
```

**Alternative:** If you're using a database GUI tool (like MySQL Workbench, phpMyAdmin, or TablePlus), create a new database named `cr_tool` through the interface.

---

### Step 5: Initialize Database Tables

Run the database migration to create all necessary tables:

```bash
pnpm db:push
```

This command will:
- Connect to your database
- Create the `users` table
- Create the `change_requests` table
- Set up all columns, indexes, and relationships

**Expected output:**
```
✓ Pushing schema changes to database
✓ Done!
```

---

### Step 6: Create Default Admin Account

Run the admin initialization script:

```bash
pnpm exec tsx server/init-admin.mjs
```

This creates the default administrator account with a **randomly generated secure password**.

**Expected output:**
```
======================================================================
  ✓ DEFAULT ADMIN ACCOUNT CREATED SUCCESSFULLY!
======================================================================

  Username: admin
  Password: xK9#mP2$vL8@qR5n

======================================================================
  ⚠️  IMPORTANT: Save this password now!
  This password will NOT be shown again.
  Change it immediately after first login in Settings.
======================================================================
```

⚠️ **Critical:** Copy and save the generated password immediately! It will not be displayed again.

---

### Step 7: Start the Development Server

Start both the frontend and backend servers:

```bash
pnpm dev
```

**What this does:**
- Starts the Express backend server on port 3000
- Starts the Vite development server for React frontend
- Enables hot module replacement (HMR) for instant updates

**Expected output:**
```
Server running on http://localhost:3000/
```

**Note:** If port 3000 is busy, the server will automatically try 3001, 3002, etc.

---

### Step 8: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

You should see the **Change Management Tool** login page with the Salla logo.

---

### Step 9: Log In

Enter your admin credentials:
- **Username:** `admin`
- **Password:** (the randomly generated password from Step 6)

Click **Sign In**

You'll be redirected to the Dashboard showing:
- Total CRs
- Status breakdown (Pending, Approved, etc.)
- Recent change requests
- Navigation sidebar

---

### Step 10: Change Admin Password (Recommended)

**For security, change your admin password:**

1. Click **Settings** in the left sidebar
2. Scroll to the **Change Password** section
3. Fill in the form:
   - Current Password: (the generated password from Step 6)
   - New Password: (your new secure password)
   - Confirm Password: (repeat your new password)
4. Click **Change Password**
5. You'll see a success message

---

## Using the Application

### Creating a Change Request

1. Click **New CR** in the sidebar
2. Fill in the form:
   - **Title**: Brief description of the change
   - **Reason**: Why this change is needed
   - **Affected Resources**: Systems/services impacted
   - **Assignee**: Select a user to review
   - **PR Link** (optional): Link to pull request
   - **Rollback Plan**: How to revert if needed
   - **Status**: Choose "draft" or "pending"
   - **Priority**: low, medium, high, or critical
   - **Scheduled Date** (optional): When to implement
3. Click **Create Change Request**

### Viewing Change Requests

- Click **Change Requests** in the sidebar
- Use the search bar to filter by title or ID
- Click any CR to view full details
- Click status badges on Dashboard to filter by status

### Managing Users (Admin Only)

1. Go to **Settings**
2. Scroll to **User Management**
3. Click **Create New User**
4. Fill in:
   - Username
   - Email
   - Password
   - Role (admin or user)
5. Click **Create User**

### Notifications

- Bell icon in sidebar shows pending CRs assigned to you
- Red badge indicates number of pending reviews
- Click bell to see list of pending CRs
- Click any notification to go to that CR

---

## Running Tests

Run the test suite to verify everything works:

```bash
pnpm test
```

This runs all backend tests including:
- Authentication tests
- Change request CRUD operations
- Notification system tests
- User management tests

---

## Troubleshooting

### Port 3000 Already in Use

**Solution 1:** The server will automatically use the next available port (3001, 3002, etc.)

**Solution 2:** Change the port in `.env`:
```env
PORT=4000
```

### Database Connection Failed

**Check these:**
1. Is MySQL running? `mysql -u root -p`
2. Is the DATABASE_URL correct in `.env`?
3. Does the database exist? `SHOW DATABASES;`
4. Are the credentials correct?

**Test connection:**
```bash
mysql -u root -p cr_tool
```

### pnpm Command Not Found

Install pnpm globally:
```bash
npm install -g pnpm
```

### Module Not Found Errors

Reinstall dependencies:
```bash
rm -rf node_modules
pnpm install
```

### Admin Account Already Exists

If you run the init script multiple times, you might see an error. This is normal - the admin account already exists. You can:
- Use the existing admin account
- Or manually delete and recreate it in the database

### Cannot Login After Changing Password

Clear your browser's localStorage:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Clear all items
4. Refresh the page and try again

---

## Project Structure

```
CR-tool/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components (Dashboard, Login, etc.)
│   │   ├── components/    # Reusable UI components (shadcn/ui)
│   │   ├── lib/           # tRPC client setup
│   │   └── _core/         # Core utilities and hooks
│   ├── public/            # Static assets (logo, etc.)
│   └── index.html         # HTML entry point
│
├── server/                # Backend Express + tRPC server
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database query helpers
│   ├── auth-router.ts     # Authentication procedures
│   ├── auth-utils.ts      # Password hashing utilities
│   ├── init-admin.mjs     # Admin account creation script
│   └── _core/             # Core server utilities
│
├── drizzle/               # Database schema and migrations
│   ├── schema.ts          # Table definitions
│   └── migrations/        # SQL migration files
│
├── shared/                # Shared types and constants
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # This file
```

---

## Available Scripts

```bash
# Development
pnpm dev              # Start development server (frontend + backend)

# Database
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio (database GUI)

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode

# Production Build
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

---

## Default Admin Account

**Admin Account:**
- Username: `admin`
- Password: Randomly generated during initialization (16 characters)

⚠️ **Important:** The password is displayed only once when you run `pnpm exec tsx server/init-admin.mjs`. Save it securely!

---

## Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens for session management
- ✅ HTTP-only cookies (when supported)
- ✅ LocalStorage fallback for proxy environments
- ✅ Role-based access control (RBAC)
- ✅ Protected procedures for sensitive operations
- ✅ Input validation with Zod schemas

---

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Configure a production database
3. Build the application: `pnpm build`
4. Start the server: `pnpm start`
5. Use a process manager like PM2 or systemd
6. Set up a reverse proxy (nginx/Apache)
7. Enable HTTPS with SSL certificates

---

## Support

For issues, questions, or feature requests:
- Create an issue on GitHub
- Contact the development team at Salla

---

## License

Proprietary - Salla

---

## Changelog

### Version 1.0.0 (Initial Release)
- Custom authentication system with JWT
- Change request CRUD operations
- Dashboard with statistics
- Notification system
- Role-based access control
- User management for admins
- Salla branding and theme
- Comprehensive test suite
