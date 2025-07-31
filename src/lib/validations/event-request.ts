import { z } from 'zod'

export const eventRequestSchema = z.object({
  // Organizer Information
  organizerName: z.string().min(1, 'Organizer name is required'),
  organizerEmail: z.string().email('Valid email is required'),
  organizerPhone: z.string().min(1, 'Phone number is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationWebsite: z.string().url().optional().or(z.literal('')),
  organizationDescription: z.string().min(10, 'Organization description must be at least 10 characters'),

  // Event Information
  eventName: z.string().min(1, 'Event name is required'),
  eventDescription: z.string().min(20, 'Event description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  
  // Date & Time
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),

  // Location
  venueName: z.string().min(1, 'Venue name is required'),
  venueAddress: z.string().min(1, 'Venue address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().optional(),
  country: z.string().default('United States'),
  venueType: z.string().min(1, 'Venue type is required'),

  // Event Details
  expectedAttendance: z.string().min(1, 'Expected attendance is required'),
  ticketPrice: z.string().optional(),
  freeEvent: z.boolean().default(false),
  ageRestriction: z.string().optional(),
  accessibility: z.boolean().default(false),
  parking: z.boolean().default(false),
  foodVendors: z.boolean().default(false),
  alcoholServed: z.boolean().default(false),

  // Marketing & Media
  websiteUrl: z.string().url().optional().or(z.literal('')),
  socialMediaLinks: z.string().optional(),
  previousEvents: z.string().optional(),
  marketingPlan: z.string().optional(),

  // Requirements & Logistics
  specialRequirements: z.string().optional(),
  insuranceInfo: z.string().optional(),
  permitsObtained: z.boolean().default(false),
  emergencyPlan: z.string().optional(),

  // Agreement
  termsAccepted: z.boolean().refine(val => val === true, 'Terms must be accepted'),
  dataProcessingAccepted: z.boolean().refine(val => val === true, 'Data processing consent required'),
})

export const eventRequestUpdateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  reviewNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
})

export const eventRequestQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).default('1'),
  limit: z.string().transform(val => parseInt(val) || 10).default('10'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional().nullable(),
  search: z.string().optional().nullable(),
})

export type EventRequestInput = z.infer<typeof eventRequestSchema>
export type EventRequestUpdate = z.infer<typeof eventRequestUpdateSchema>
export type EventRequestQuery = z.infer<typeof eventRequestQuerySchema>