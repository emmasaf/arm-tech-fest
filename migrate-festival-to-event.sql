-- Migration to rename Festival to Event
-- This handles the data migration carefully to avoid data loss

-- Step 1: Create the new events table based on festivals
CREATE TABLE IF NOT EXISTS "events" AS SELECT * FROM "festivals";

-- Step 2: Create the new event_requests table based on festival_requests
CREATE TABLE IF NOT EXISTS "event_requests" AS SELECT * FROM "festival_requests";

-- Step 3: Add eventId column to tickets and populate it with festivalId values
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "eventId" VARCHAR;
UPDATE "tickets" SET "eventId" = "festivalId" WHERE "eventId" IS NULL;
ALTER TABLE "tickets" ALTER COLUMN "eventId" SET NOT NULL;

-- Step 4: Update users table references
-- These should be handled by foreign key constraints

-- Step 5: Update categories table references  
-- These should be handled by foreign key constraints

-- Step 6: Drop the old festivalId column from tickets
ALTER TABLE "tickets" DROP COLUMN IF EXISTS "festivalId";

-- Step 7: Drop the old tables (after confirming data integrity)
-- DROP TABLE IF EXISTS "festival_requests";
-- DROP TABLE IF EXISTS "festivals";

-- Note: The above drops are commented out for safety
-- Uncomment them after verifying data integrity