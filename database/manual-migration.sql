-- Manual migration to rename Festival to Event while preserving data
-- This script handles the data migration carefully

-- Step 1: Add eventId column to tickets table and populate it
ALTER TABLE "tickets" ADD COLUMN "eventId" TEXT;

-- Step 2: Copy festivalId values to eventId
UPDATE "tickets" SET "eventId" = "festivalId";

-- Step 3: Make eventId NOT NULL
ALTER TABLE "tickets" ALTER COLUMN "eventId" SET NOT NULL;

-- Step 4: Create events table by copying festivals table structure and data
CREATE TABLE "events" AS SELECT * FROM "festivals";

-- Step 5: Create event_requests table by copying festival_requests table structure and data  
CREATE TABLE "event_requests" AS SELECT * FROM "festival_requests";

-- Step 6: Add primary key and constraints to events table
ALTER TABLE "events" ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");
ALTER TABLE "events" ADD CONSTRAINT "events_slug_key" UNIQUE ("slug");

-- Step 7: Add primary key and constraints to event_requests table
ALTER TABLE "event_requests" ADD CONSTRAINT "event_requests_pkey" PRIMARY KEY ("id");

-- Step 8: Add foreign key constraints
ALTER TABLE "events" ADD CONSTRAINT "events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "event_requests" ADD CONSTRAINT "event_requests_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tickets" ADD CONSTRAINT "tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 9: Drop old constraints from tickets table
ALTER TABLE "tickets" DROP CONSTRAINT IF EXISTS "tickets_festivalId_fkey";

-- Step 10: Drop festivalId column from tickets
ALTER TABLE "tickets" DROP COLUMN "festivalId";

-- Step 11: Drop old tables (commented out for safety - uncomment after verification)
-- DROP TABLE "festival_requests";
-- DROP TABLE "festivals";

-- Verification queries (run these to verify data integrity)
-- SELECT COUNT(*) FROM events;
-- SELECT COUNT(*) FROM event_requests;
-- SELECT COUNT(*) FROM tickets WHERE "eventId" IS NOT NULL;