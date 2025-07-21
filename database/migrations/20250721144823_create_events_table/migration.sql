/*
  Warnings:

  - You are about to drop the column `festivalId` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the `festival_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `festivals` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "festival_requests" DROP CONSTRAINT "festival_requests_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "festivals" DROP CONSTRAINT "festivals_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "festivals" DROP CONSTRAINT "festivals_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_festivalId_fkey";

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "festivalId",
ADD COLUMN     "eventId" TEXT NOT NULL;

-- DropTable
DROP TABLE "festival_requests";

-- DropTable
DROP TABLE "festivals";

-- DropEnum
DROP TYPE "FestivalStatus";

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'United States',
    "venueType" "VenueType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "capacity" INTEGER NOT NULL,
    "expectedAttendance" TEXT NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "ageRestriction" TEXT,
    "isAccessible" BOOLEAN NOT NULL DEFAULT false,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "hasFoodVendors" BOOLEAN NOT NULL DEFAULT false,
    "servesAlcohol" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "websiteUrl" TEXT,
    "socialMediaLinks" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizerId" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_requests" (
    "id" TEXT NOT NULL,
    "organizerName" TEXT NOT NULL,
    "organizerEmail" TEXT NOT NULL,
    "organizerPhone" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "organizationWebsite" TEXT,
    "organizationDescription" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDescription" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'United States',
    "venueType" TEXT NOT NULL,
    "expectedAttendance" TEXT NOT NULL,
    "ticketPrice" DOUBLE PRECISION,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "ageRestriction" TEXT,
    "isAccessible" BOOLEAN NOT NULL DEFAULT false,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "hasFoodVendors" BOOLEAN NOT NULL DEFAULT false,
    "servesAlcohol" BOOLEAN NOT NULL DEFAULT false,
    "websiteUrl" TEXT,
    "socialMediaLinks" TEXT,
    "previousEvents" TEXT,
    "marketingPlan" TEXT,
    "specialRequirements" TEXT,
    "insuranceInfo" TEXT,
    "hasPermits" BOOLEAN NOT NULL DEFAULT false,
    "emergencyPlan" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewerId" TEXT,

    CONSTRAINT "event_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_requests" ADD CONSTRAINT "event_requests_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
