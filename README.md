# Content Marketing Agency Portal

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-purple)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4)](https://tailwindcss.com/)

A comprehensive admin portal for content marketing agencies built with Vite, React-Admin, JavaScript, and Tailwind CSS. This application provides role-based access control and efficient workflow management for handling content requests, client management, and team collaboration.

## Features

### 🔐 Authentication & Role Management
- Secure login/logout functionality
- Four distinct user roles:
  - **Admin**: Full system access and user management
  - **Content Strategist**: Manages clients and projects
  - **Editor**: Reviews and approves content
  - **Writer**: Creates and submits content
- Role-based access control throughout the application

### 👥 Client & Project Management
- Complete CRUD operations for clients and projects
- Client profiles with industry, goals, and assigned strategist
- Project status tracking: Pending, In Progress, Completed, Published
- Project assignment and deadline management

### 📝 Content Management System
- Content creation, editing, and submission workflow
- Multi-format support: blogs, articles, social media posts, emails, whitepapers, case studies
- Content status management: Draft, Review, Approved, Published

### 📊 Dashboard & Analytics
- Real-time overview of clients, projects, and content
- Interactive charts using Recharts
- Performance metrics and completion rates
- Role-specific dashboard views

### ✅ Task Management & Notifications
- Task creation and assignment system
- Priority levels and due date tracking
- Status updates and progress monitoring
- Overdue task identification
- Team collaboration features

### 🎨 UI/UX Features
- Professional design using shadcn/ui components
- Dark mode support
- Intuitive navigation with role-based menu items
- Toast notifications for user feedback

## Technology Stack

- **Frontend**: Vite + React-Admin
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode
- **Data Storage**: Local Storage (for demo purposes)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/satvikprsd/ContentFlow.git
cd ContentFlow
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

The application comes with pre-configured demo accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@example.com | admin123 | Full system access |
| Content Strategist | strategist@example.com | strategist123 | Client & project management |
| Editor | editor@example.com | editor123 | Content review & approval |
| Writer | writer@example.com | writer123 | Content creation |

## Key Features Explained

### Role-Based Access Control
The application implements comprehensive role-based access control:
- Navigation menus adapt based on user roles
- Page-level access restrictions
- Feature-level permissions (edit, delete, approve)
- Data filtering based on user role and ownership

### Content Workflow
1. **Writers** create content drafts
2. **Editors** review and provide feedback
3. **Approved** content can be published


### Task Management
- Priority-based task sorting
- Due date tracking with overdue indicators
- Role-specific task views
- Status updates with notifications

### Data Persistence
Currently uses Local Storage for demo purposes. In production, this would be replaced with:
- Database integration (MongoDB, etc.)
- API endpoints for data operations
- User authentication service
- File storage for content assets

### Note: All mock data is AI-generated for demo purposes (I did not create them).

Developed with ❤️ by Satvik.
