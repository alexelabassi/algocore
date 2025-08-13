# Admin Panel Guide

This guide explains how to use the admin panel for managing problems and test cases in the AlgoCore platform.

## Accessing the Admin Panel

1. Log in with an admin account (email: `admin@gmail.com`, password: `adminpass` by default)
2. Click on the "Admin" link in the navigation bar
3. You'll be redirected to the admin dashboard

## Features

### 1. Admin Dashboard (`/admin`)

The main admin interface where you can:
- View all existing problems
- See problem details (title, difficulty, grade, description)
- Access quick actions for each problem

### 2. Create New Problem (`/admin/problems/create`)

Create a new programming problem with:
- **Problem Details:**
  - Title (required)
  - Description (required)
  - Difficulty level (Easy/Medium/Hard)
  - School grade (Grade 9/10/11)
  - Template code (optional starter code)

- **Test Cases:**
  - Input data
  - Expected output
  - Hidden flag (for test cases not visible to students)
  - Add/remove multiple test cases

### 3. Edit Problem (`/admin/problems/:id/edit`)

Edit existing problems:
- Modify problem details
- Update test cases
- Currently supports test case editing (problem details editing requires backend enhancement)

### 4. Manage Test Cases (`/admin/problems/:id/testcases`)

Dedicated interface for managing test cases:
- View all test cases for a specific problem
- Add new test cases
- Edit existing test cases
- Remove test cases
- Toggle hidden status

### 5. Delete Problems

From the admin dashboard:
- Click the "Delete" button next to any problem
- Confirm the deletion
- Problem and all associated test cases will be permanently removed

## API Endpoints

The admin functionality uses these backend endpoints:

- `POST /problems/create` - Create new problem
- `DELETE /problems/{id}` - Delete problem
- `GET /problems/{id}/testcases` - Get test cases for a problem
- `PUT /problems/{id}/testcases` - Update test cases for a problem

## Security

- All admin endpoints require admin role authentication
- Frontend routes are protected with `requireAdmin` prop
- Backend endpoints use `@PreAuthorize("hasRole('ROLE_ADMIN')")`

## Default Admin Account

- **Email:** admin@gmail.com
- **Password:** adminpass (configurable in `application.properties`)

## Notes

- Test cases marked as "hidden" are not visible to students during problem solving
- All changes are saved immediately when you click "Save"
- The edit problem functionality currently only supports test case editing
- Template code functionality is available but may need backend enhancement for full support

## Troubleshooting

If you encounter issues:
1. Ensure you're logged in with an admin account
2. Check the browser console for error messages
3. Verify the backend is running and accessible
4. Check that all required fields are filled before saving
