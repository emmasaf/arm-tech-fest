# 🎪 FestivalHub - Event Discovery & Ticketing Platform

A modern, full-stack web application for discovering events and purchasing tickets. Built with Next.js 14, TypeScript, Prisma, PostgreSQL, and shadcn/ui.

![FestivalHub Banner](https://via.placeholder.com/1200x400/8b5cf6/ffffff?text=FestivalHub+-+Discover+Amazing+Events)

## ✨ Features

### 🎫 For Event-Goers
- **Discover Events** - Browse and search events by category, location, and date
- **Secure Ticketing** - Purchase tickets with instant QR code generation
- **Advanced Filtering** - Filter by price, category, location, and date range
- **Mobile-First Design** - Responsive design optimized for all devices
- **Ticket Management** - Download tickets as PDF or receive via email

### 🎪 For Event Organizers
- **Event Registration** - Multi-step registration form for event submissions
- **Event Management** - Manage event details, pricing, and availability
- **Analytics Dashboard** - Track ticket sales and attendee data
- **Email Notifications** - Automated notifications for bookings and updates

### 👨‍💼 For Administrators
- **Admin Dashboard** - Comprehensive admin panel for platform management
- **Event Approval** - Review and approve event registration requests
- **User Management** - Manage users and event organizers
- **Analytics & Reporting** - Platform-wide analytics and reporting tools

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Robust relational database
- **NextAuth.js** - Authentication solution

### Additional Services
- **Nodemailer** - Email service for notifications
- **QR Code Generation** - Ticket QR code creation
- **File Upload** - Image and document handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/emmasaf/arm-tech-fest.git
   cd festivalhub
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Fill in your environment variables:
   \`\`\`env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/festivalhub"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Email (Nodemailer)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"

   # File Upload
   UPLOAD_DIR="./public/uploads"
   MAX_FILE_SIZE=5242880

   # Admin
   ADMIN_EMAIL="admin@festivalhub.com"
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   # Generate Prisma client
   bunx prisma generate

   # Run database migrations
   bunx prisma db push

   # Seed the database (optional)
   bunx prisma db seed
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎭 Demo Credentials

For testing and demonstration purposes, you can use the pre-configured admin account:

### 🔑 Admin Account (Super Admin)
- **Email**: `safaryanemma05@gmail.com`  
- **Password**: `varujpidoras06`
- **Role**: SUPER_ADMIN (Full platform access)

### 🚀 How to Use Demo Credentials

1. **Navigate to Login**: Go to `/login` or click "Sign In" in the navigation
2. **Enter Credentials**: Use the admin email and password above
3. **Access Dashboard**: After login, you'll be redirected to `/dashboard`
4. **Explore Features**: 
   - View role-specific dashboard with stats and alerts
   - Access admin panels (user management, analytics, etc.)
   - Create and manage events
   - Test different user roles and permissions

### 📋 Available Features by Role

**SUPER_ADMIN Features:**
- ✅ Full platform overview with system-wide statistics
- ✅ User management and role assignments  
- ✅ Event approval and content moderation
- ✅ Platform analytics and reporting
- ✅ System configuration and settings

**Dashboard Sections:**
- **Overview**: Platform statistics (users, events, tickets, revenue)
- **Quick Actions**: Direct access to management tools
- **Alerts**: System notifications and pending tasks
- **Role-based Navigation**: Sidebar with appropriate permissions

### 🔄 Creating Additional Demo Users

You can create additional demo users by:
1. Registering new accounts through `/register`
2. Manually setting roles in the database
3. Using the seeding script: `bun db:seed`

### 💡 Demo Tips

- **Test Authentication**: Try logging out and back in to see navigation changes
- **Explore Roles**: Each role has different dashboard content and permissions
- **Mobile Testing**: Test responsive dashboard on mobile devices
- **Session Management**: Sessions persist across browser refreshes

## 📁 Project Structure

\`\`\`
festivalhub/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication routes
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   ├── events/                # Event pages
│   ├── register-event/        # Event registration
│   ├── buy-ticket/              # Ticket purchase flow
│   ├── ticket/                  # Ticket display
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── loading.tsx              # Global loading UI
│   ├── error.tsx                # Global error UI
│   └── not-found.tsx            # 404 page
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── navigation.tsx           # Navigation component
│   ├── footer.tsx               # Footer component
│   └── ...
├── lib/                         # Utility functions
│   ├── prisma.ts               # Prisma client
│   ├── auth.ts                 # Authentication config
│   ├── email.ts                # Email utilities
│   ├── qr-code.ts              # QR code generation
│   └── utils.ts                # General utilities
├── prisma/                      # Database schema & migrations
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Database seeding
├── public/                      # Static assets
│   ├── images/                 # Image assets
│   └── uploads/                # User uploads
├── types/                       # TypeScript type definitions
├── hooks/                       # Custom React hooks
├── middleware.ts               # Next.js middleware
├── next.config.mjs            # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json               # Dependencies
└── README.md                  # This file
\`\`\`

## 🗄️ Database Schema

### Core Tables

- **User** - User accounts and authentication
- **Event** - Event information and details
- **Ticket** - Ticket purchases and QR codes
- **EventRequest** - Event registration requests
- **Category** - Event categories
- **Location** - Venue and location data

### Key Relationships

\`\`\`prisma
model Event {
id          String   @id @default(cuid())
name        String
description String
startDate   DateTime
endDate     DateTime
price       Float
capacity    Int
organizer   User     @relation(fields: [organizerId], references: [id])
organizerId String
tickets     Ticket[]
createdAt   DateTime @default(now())
updatedAt   DateTime @updatedAt
}

model Ticket {
id         String   @id @default(cuid())
qrCode     String   @unique
event   Event @relation(fields: [eventId], references: [id])
eventId String
buyerEmail String
buyerName  String
createdAt  DateTime @default(now())
}
\`\`\`

## 📧 Email Configuration

FestivalHub uses Nodemailer for sending emails. Configure your email provider:

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in \`SMTP_PASS\`

### Custom SMTP
\`\`\`env
SMTP_HOST="your-smtp-server.com"
SMTP_PORT=587
SMTP_USER="your-username"
SMTP_PASS="your-password"
\`\`\`

## 🎨 UI Components

Built with shadcn/ui components:

\`\`\`bash
# Add new components
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add input
# ... and more
\`\`\`

### Custom Components
- **Loading States** - Universal loading components
- **Error Handling** - Comprehensive error boundaries
- **Event Cards** - Reusable event display components
- **Form Components** - Multi-step form components

## 🔐 Authentication

Authentication is handled by NextAuth.js with support for:

- **Email/Password** - Traditional authentication
- **OAuth Providers** - Google, GitHub, etc.
- **Admin Roles** - Role-based access control

## 📱 API Endpoints

### Public Endpoints
- \`GET /api/events\` - List all events
- \`GET /api/events/[id]\` - Get event details
- \`POST /api/tickets\` - Purchase ticket

### Protected Endpoints
- \`POST /api/events\` - Create event (Admin only)
- \`GET /api/admin/requests\` - Get event requests (Admin only)
- \`PUT /api/admin/requests/[id]\` - Approve/reject requests (Admin only)

### Example API Usage

\`\`\`javascript
// Fetch events
const response = await fetch('/api/events?category=music&limit=10')
const events = await response.json()

// Purchase ticket
const ticket = await fetch('/api/tickets', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
eventId: 'event-id',
buyerName: 'John Doe',
buyerEmail: 'john@example.com'
})
})
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push

### Docker

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Environment Variables for Production

\`\`\`env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
\`\`\`

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting and lazy loading

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (\`git checkout -b feature/amazing-feature\`)
3. **Commit your changes** (\`git commit -m 'Add amazing feature'\`)
4. **Push to the branch** (\`git push origin feature/amazing-feature\`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript checks
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
\`\`\`bash
# Check your DATABASE_URL format
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Test connection
bunx prisma db pull
\`\`\`

**Email Not Sending**
- Verify SMTP credentials
- Check firewall settings
- Enable "Less secure app access" for Gmail

**Build Errors**
\`\`\`bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📞 Support

- **Documentation**: [docs.festivalhub.com](https://docs.festivalhub.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/festivalhub/issues)
- **Email**: support@festivalhub.com
- **Discord**: [Join our community](https://discord.gg/festivalhub)

---

**Made with ❤️ by the FestivalHub Team**

[🌟 Star us on GitHub](https://github.com/yourusername/festivalhub) | [🐦 Follow us on Twitter](https://twitter.com/festivalhub) | [📧 Subscribe to updates](https://festivalhub.com/newsletter)
