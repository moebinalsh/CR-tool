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

**For AWS RDS (see detailed guide below):**
```env
DATABASE_URL=mysql://admin:yourpassword@cr-tool-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com:3306/cr_tool
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

## Using AWS RDS as Database

This guide shows you how to set up Amazon RDS (Relational Database Service) as your production database for the CR Tool.

### Why Use AWS RDS?

- **Managed Service**: Automatic backups, patching, and maintenance
- **High Availability**: Multi-AZ deployments for failover support
- **Scalability**: Easy to scale compute and storage resources
- **Security**: VPC isolation, encryption at rest and in transit
- **Monitoring**: Built-in CloudWatch metrics and performance insights

---

### Step-by-Step AWS RDS Setup

#### Step 1: Create an AWS Account

1. Go to https://aws.amazon.com/
2. Click **Create an AWS Account**
3. Follow the registration process
4. Add payment method (free tier available)

---

#### Step 2: Access RDS Console

1. Log into AWS Console: https://console.aws.amazon.com/
2. In the search bar, type **RDS**
3. Click **RDS** under Services
4. Click **Create database**

---

#### Step 3: Configure Database Settings

**Choose a database creation method:**
- Select **Standard create** (for full control)

**Engine options:**
- Engine type: **MySQL**
- Engine version: **MySQL 8.0.35** (or latest)

**Templates:**
- For production: Choose **Production**
- For testing: Choose **Free tier** (if eligible)

**Settings:**
- DB instance identifier: `cr-tool-db` (or your preferred name)
- Master username: `admin` (or your preferred username)
- Master password: Create a strong password
- Confirm password: Re-enter the password

⚠️ **Important:** Save these credentials securely! You'll need them for the DATABASE_URL.

---

#### Step 4: Configure Instance Size

**DB instance class:**
- For free tier: **db.t3.micro** or **db.t2.micro**
- For production: **db.t3.small** or higher based on your needs

**Storage:**
- Storage type: **General Purpose SSD (gp3)**
- Allocated storage: **20 GB** (minimum, adjust as needed)
- Enable storage autoscaling: ✅ (recommended)
- Maximum storage threshold: **100 GB** (or your limit)

---

#### Step 5: Configure Connectivity

**Compute resource:**
- Don't connect to an EC2 compute resource (unless you have one)

**Network type:**
- IPv4

**Virtual private cloud (VPC):**
- Select your default VPC or create a new one

**DB subnet group:**
- Use default

**Public access:**
- **Yes** (if connecting from your local machine)
- **No** (if only connecting from AWS resources like EC2)

⚠️ **Security Note:** For production, use **No** and connect via VPN or AWS resources only.

**VPC security group:**
- Create new
- Name: `cr-tool-db-sg`

**Availability Zone:**
- No preference (or select specific AZ)

---

#### Step 6: Configure Database Authentication

**Database authentication:**
- Password authentication (default)

---

#### Step 7: Additional Configuration

**Database options:**
- Initial database name: `cr_tool`
- DB parameter group: default
- Option group: default

**Backup:**
- Enable automatic backups: ✅
- Backup retention period: **7 days** (recommended)
- Backup window: No preference

**Encryption:**
- Enable encryption: ✅ (recommended for production)
- AWS KMS key: (default) aws/rds

**Monitoring:**
- Enable Enhanced Monitoring: ✅ (optional, costs extra)

**Maintenance:**
- Enable auto minor version upgrade: ✅

---

#### Step 8: Create Database

1. Review all settings
2. Click **Create database**
3. Wait 5-10 minutes for the database to be created
4. Status will change from "Creating" to "Available"

---

#### Step 9: Configure Security Group

**Allow inbound connections to your database:**

1. Go to **EC2 Console** → **Security Groups**
2. Find the security group you created (e.g., `cr-tool-db-sg`)
3. Click on the security group
4. Go to **Inbound rules** tab
5. Click **Edit inbound rules**
6. Click **Add rule**
7. Configure:
   - Type: **MySQL/Aurora**
   - Protocol: **TCP**
   - Port: **3306**
   - Source:
     - **My IP** (for local development - automatically detects your IP)
     - Or **Custom** and enter your IP address (e.g., `203.0.113.0/32`)
     - Or **Anywhere-IPv4** (`0.0.0.0/0`) - ⚠️ **NOT recommended for production!**
8. Click **Save rules**

**For production:**
- Only allow specific IPs or VPC CIDR blocks
- Use AWS VPN or Direct Connect for secure access
- Consider using AWS PrivateLink

---

#### Step 10: Get Database Endpoint

1. Go back to **RDS Console**
2. Click on your database instance (`cr-tool-db`)
3. In the **Connectivity & security** tab, find:
   - **Endpoint**: `cr-tool-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com`
   - **Port**: `3306`
4. Copy the endpoint address

---

#### Step 11: Update Your .env File

Update your `.env` file with the RDS connection details:

```env
DATABASE_URL=mysql://admin:YourStrongPassword@cr-tool-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com:3306/cr_tool
PORT=3000
```

**Replace:**
- `admin` → your master username from Step 3
- `YourStrongPassword` → your master password from Step 3
- `cr-tool-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com` → your endpoint from Step 10
- `cr_tool` → your initial database name from Step 7

**Example:**
```env
DATABASE_URL=mysql://admin:MySecurePass123!@cr-tool-db.abc123xyz.us-east-1.rds.amazonaws.com:3306/cr_tool
PORT=3000
```

---

#### Step 12: Test Connection

Test the connection from your local machine:

**Using MySQL CLI:**
```bash
mysql -h cr-tool-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com -P 3306 -u admin -p
```

Enter your password when prompted.

If successful, you'll see:
```
Welcome to the MySQL monitor.
mysql>
```

Type `SHOW DATABASES;` to verify the `cr_tool` database exists.

**Using the application:**
```bash
pnpm db:push
```

This should connect to RDS and create the tables.

---

#### Step 13: Initialize Admin Account

Run the initialization script to create the admin user:

```bash
pnpm exec tsx server/init-admin.mjs
```

Save the generated password securely.

---

#### Step 14: Start Your Application

```bash
pnpm dev
```

Your application is now connected to AWS RDS!

---

### AWS RDS Best Practices

**Security:**
- ✅ Use strong master passwords (16+ characters, mixed case, numbers, symbols)
- ✅ Restrict security group rules to specific IPs only
- ✅ Enable encryption at rest
- ✅ Enable SSL/TLS for connections in transit
- ✅ Regularly rotate credentials
- ✅ Use AWS Secrets Manager for password storage
- ❌ Never use `0.0.0.0/0` (anywhere) in production security groups
- ❌ Never commit DATABASE_URL with credentials to Git

**Performance:**
- Monitor database performance with CloudWatch
- Enable Performance Insights for query analysis
- Set up automated backups
- Use read replicas for read-heavy workloads
- Consider Multi-AZ deployment for high availability

**Cost Optimization:**
- Start with smaller instance types (db.t3.micro)
- Use Reserved Instances for production (up to 60% savings)
- Enable storage autoscaling to avoid over-provisioning
- Delete snapshots you no longer need
- Monitor costs with AWS Cost Explorer

**Backup & Recovery:**
- Enable automated backups (7-35 days retention)
- Take manual snapshots before major changes
- Test your backup restoration process
- Consider cross-region snapshot copies for disaster recovery

---

### AWS RDS Troubleshooting

**Cannot connect to RDS:**
1. Check security group inbound rules allow your IP on port 3306
2. Verify "Public accessibility" is set to "Yes" (if connecting from outside AWS)
3. Check VPC and subnet configuration
4. Verify database status is "Available"
5. Test with MySQL CLI before testing with the app

**Connection timeout:**
- Your IP may have changed (update security group)
- Firewall blocking outbound connections on port 3306
- RDS instance may be in different region than expected

**Authentication failed:**
- Double-check username and password
- Ensure no special characters are causing URL encoding issues
- Try URL-encoding the password if it contains special characters

**Database not found:**
- Verify you created the initial database name in Step 7
- Or create it manually: `CREATE DATABASE cr_tool;`

---

### AWS RDS Costs

**Free Tier (12 months):**
- 750 hours per month of db.t2.micro or db.t3.micro
- 20 GB of General Purpose (SSD) storage
- 20 GB of backup storage

**After Free Tier:**
- db.t3.micro: ~$15-20/month (us-east-1)
- db.t3.small: ~$30-40/month
- Storage: ~$0.115 per GB/month
- Backup storage: Free up to 100% of database storage

**Check current pricing:** https://aws.amazon.com/rds/mysql/pricing/

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
