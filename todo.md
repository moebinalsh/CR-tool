# Change Management Tool - TODO

## Core Features

- [x] Database schema for change requests with all required fields
- [x] Create new change request functionality
- [x] Dashboard with statistics and overview
- [x] Recent change requests view
- [x] Search and filter functionality for CRs
- [x] User assignment dropdown
- [x] Status tracking for CRs
- [x] Professional UI with modern design
- [x] Responsive layout

## Technical Tasks

- [x] Set up database schema with change_requests table
- [x] Create backend tRPC procedures for CRUD operations
- [x] Implement search/filter backend logic
- [x] Build dashboard layout with sidebar navigation
- [x] Create CR form with validation
- [x] Build CR list view with status indicators
- [x] Add search interface
- [x] Write unit tests for backend procedures
- [x] Test full application flow

## New Feature Requests

- [x] Add CR detail view page with click functionality
- [x] Restrict status options during creation to "draft" and "pending" only
- [x] Implement role-based approval (only admins or assignees can approve/reject)
- [x] Update branding to match Salla colors and style
- [x] Replace logo with Salla logo
- [x] Update color scheme to Salla's teal/mint and dark teal colors

## Issues to Fix

- [x] Fix logo visibility and clarity in navigation
- [x] Improve Salla brand colors to be more prominent
- [x] Fix logo and title appearance in navigation tab
- [x] Make dashboard stat containers clickable

## New Features

- [x] Add Settings page
- [x] Admin user management (add/remove users)
- [x] User profile updates (password, photo)

## Complete Authentication System Rebuild

- [x] Install bcrypt and authentication dependencies
- [x] Update database schema with username and password_hash fields
- [x] Remove Manus OAuth dependencies from core files
- [x] Implement password hashing utilities (bcrypt)
- [x] Create default admin account (username: admin, password: admin123)
- [x] Build custom login endpoint with username/password validation
- [x] Implement JWT session management
- [x] Create login page UI
- [x] Update authentication context and hooks
- [x] Add password change functionality in settings
- [x] Implement admin user creation with username/password/role
- [x] Add user role editing in admin settings
- [x] Add Google Workspace SSO configuration UI
- [x] Test complete authentication flow

## Notification System

- [x] Verify login page is fully functional
- [x] Add notification bell icon to dashboard header
- [x] Implement backend procedure to get pending CRs for user
- [x] Show notification count badge on bell icon
- [x] Display dropdown with pending CRs when bell is clicked
- [x] Link notifications to CR detail pages

## Bug Fixes

- [x] Fix login not working with default admin credentials
- [x] Verify login works for all created users
- [x] Update notification logic to only show pending status CRs
- [x] Remove approved/rejected CRs from notification dropdown
- [x] Test complete login and notification flow
