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

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- MySQL or TiDB database
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/moebinalsh/CR-tool.git
cd CR-tool
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=mysql://user:password@localhost:3306/cr_tool
PORT=3000
```

4. Initialize the database:
```bash
pnpm db:push
```

5. Create the default admin account:
```bash
pnpm exec tsx server/init-admin.mjs
```

### Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Default Credentials

- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change the default admin password immediately after first login through the Settings page.

### Testing

Run the test suite:
```bash
pnpm test
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # tRPC client setup
│   │   └── _core/         # Core utilities and hooks
├── server/                # Backend Express + tRPC server
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database query helpers
│   ├── auth-router.ts     # Authentication procedures
│   └── _core/             # Core server utilities
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Database table definitions
└── shared/                # Shared types and constants
```

## Key Features

### Change Request Creation
- Title, reason, affected resources
- Assignee selection
- PR link integration
- Rollback plan documentation
- Priority and status selection
- Scheduled date (optional)

### Dashboard
- Statistics overview
- Recent change requests
- Clickable status cards for filtering
- Search functionality

### Notifications
- Bell icon with badge count
- Dropdown showing pending CRs
- Auto-disappears when status changes
- Direct links to CR details

### User Management (Admin Only)
- Create new users with username/password
- Assign roles (admin/user)
- View all system users
- Password management

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for session management
- HTTP-only cookies (when supported)
- LocalStorage fallback for proxy environments
- Role-based access control
- Protected procedures for sensitive operations

## License

Proprietary - Salla

## Support

For issues or questions, please contact the development team.
