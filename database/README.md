# ArmEventHub Database Setup

This folder contains all SQL scripts and migrations needed to set up the ArmEventHub database.

## 📁 File Structure

```
database/
├── README.md                           # This file - setup instructions
├── 01_reset_database.sql              # Complete database reset script
├── 02_setup_database.sql              # Full database schema setup
├── manual-migration.sql               # Manual festival-to-event migration
├── migrate-festival-to-event.sql      # Alternative migration approach
└── migrations/                        # Prisma migration files
    ├── 20250625142431_fix_drift/
    │   └── migration.sql
    └── 20250721112911_add_nextauth_and_user_fields/
        └── migration.sql
    └── 20250721144823_create_events_table/
        └── migration.sql
```

## 🚀 Quick Setup (Recommended)

If you want to set up the database quickly using the existing project structure:

```bash

# 2. Seed with demo data
bun run db:seed
```

## 🔧 Manual Database Setup

If you prefer to run SQL scripts manually or need to set up on a different PostgreSQL instance:

### Prerequisites
- PostgreSQL database running
- Database connection details (host, port, user, password, database name)
- psql command line tool or database admin interface

### Step 1: Database Connection
```bash
# Connect to your PostgreSQL database
psql -h localhost -p 5432 -U your_username -d your_database_name

# Or using environment variable
psql $DATABASE_URL
```

### Step 2: Complete Reset (Optional)
If you want to start completely fresh:
```sql
\i database/01_reset_database.sql
```

### Step 3: Setup Database Schema
```sql
\i database/02_setup_database.sql
```

### Step 4: Verify Setup
Check that all tables were created:
```sql
\dt
```

You should see these tables:
- users
- accounts, sessions, verification_tokens (NextAuth)
- categories
- events
- event_requests
- tickets
- email_logs
- support_tickets
- audit_logs
- organizations

## 📊 Data Seeding

After setting up the schema, you can populate it with demo data:

### Using Prisma (Recommended)
```bash
# From project root
cd /Users/amdpedgar/arm-tech-fest
bun run db:seed
```

### Manual Data Population
The seed script creates:
- 6 event categories
- 8 demo users (Admin, Moderator, Support, 3 Organizers, 3 Users)
- 5 sample events
- 155 demo tickets
- 2 event requests for moderation
- 4 support tickets

## 🔄 Migration History

### Historical Migrations
The project evolved from a festival management system to an event management system. Here's the migration path:

1. **Initial Setup** (`20250625142431_fix_drift`)
   - Basic database structure with festivals

2. **NextAuth Integration** (`20250721112911_add_nextauth_and_user_fields`)
   - Added NextAuth.js tables
   - Extended user model with additional fields

3. **Festival to Event Rename** (`20250721144823_create_events_table`)
   - Renamed Festival model to Event
   - Updated all related tables and enums
   - Migrated data from festivals to events

### Manual Migration Scripts
- `manual-migration.sql` - Handles data migration from festivals to events table
- `migrate-festival-to-event.sql` - Alternative approach for the same migration

## 🔐 Environment Variables

Ensure your `.env` file contains the correct database connection:

```bash
DATABASE_URL="postgresql://username:password@localhost:3456/fest_db"
NEXTAUTH_SECRET="your-secret-key"
ADMIN_EMAIL="safaryanemma05@gmail.com"
ADMIN_PASSWORD="varujpidoras06"
ADMIN_NAME="Emma Safaryan"
ENCODING_KEY="your-encoding-key"
```

## 🧪 Testing Database Setup

After setup, test the connection:

```bash
# Test Prisma connection
bunx prisma db pull

# Check if data exists
bunx prisma studio
```

Or via SQL:
```sql
-- Check if demo data loaded correctly
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as event_count FROM events;
SELECT COUNT(*) as ticket_count FROM tickets;
```

Expected results after seeding:
- Users: 8
- Events: 5
- Tickets: ~155
- Categories: 6

## ⚠️ Important Notes

### For Production
- Change all default passwords
- Use secure environment variables
- Set up proper database backups
- Configure SSL connections
- Restrict database access

### For Development
- The demo credentials are in `DEMO_CREDENTIALS.md`
- Database is reset each time you run the seed script
- Use `bun run db:reset` to start fresh

## 🆘 Troubleshooting

### Common Issues

**"Table already exists" error:**
```bash
# Reset everything first
bun run db:reset
```

**"Migration failed" error:**
```bash
# Check database connection
bunx prisma db pull

# Reset migration state
bunx prisma migrate reset --force
```

**"Cannot connect to database":**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database and user exist

### Recovery Commands
```bash
# Reset and recreate everything
bun run db:reset

# Generate fresh Prisma client
bunx prisma generate

# Apply specific migration
bunx prisma migrate resolve --applied migration_name
```

## 📞 Support

If you encounter issues:
1. Check the server logs for specific error messages
2. Verify all environment variables are set
3. Ensure PostgreSQL service is running
4. Check database permissions

The database setup should work smoothly with the provided scripts. The system supports both automated Prisma migrations and manual SQL execution for maximum flexibility.