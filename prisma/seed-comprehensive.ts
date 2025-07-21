import { PrismaClient } from '@/generated/prisma'
import bcrypt from 'bcryptjs'
import { getAdminCredentials, encodePassword } from '../src/lib/password-utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')

  // Clear existing data (in correct order due to foreign keys)
  console.log('🗑️ Clearing existing data...')
  try {
    await prisma.ticket.deleteMany()
    await prisma.event.deleteMany()  
    await prisma.eventRequest.deleteMany()
    await prisma.supportTicket.deleteMany()
    await prisma.auditLog.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
  } catch (error) {
    console.log('🔄 Tables don\'t exist yet, continuing with seeding...')
  }

  // 1. Create Categories
  console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Music Event',
        slug: 'music',
        description: 'Live music performances and concerts',
        color: '#9333ea',
        icon: '🎵'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Food & Drink',
        slug: 'food',
        description: 'Culinary experiences and food events',
        color: '#059669',
        icon: '🍽️'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Cultural Event',
        slug: 'culture',
        description: 'Cultural celebrations and traditional events',
        color: '#dc2626',
        icon: '🎭'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Art & Craft',
        slug: 'art',
        description: 'Art exhibitions and craft fairs',
        color: '#ea580c',
        icon: '🎨'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Sports & Recreation',
        slug: 'sports',
        description: 'Sporting events and recreational activities',
        color: '#2563eb',
        icon: '⚽'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'tech',
        description: 'Tech conferences and innovation showcases',
        color: '#10b981',
        icon: '💻'
      }
    })
  ])

  // 2. Create Admin User
  console.log('👤 Creating admin user...')
  const adminCreds = getAdminCredentials()
  const encodedPassword = encodePassword(adminCreds.password!)
  const hashedPassword = await bcrypt.hash(encodedPassword, 12)

  const adminUser = await prisma.user.create({
    data: {
      name: adminCreds.name,
      email: adminCreds.email!,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
      isActive: true,
      organization: 'ArmEventHub',
      bio: 'Default system administrator with full access to all platform features.',
      phone: '+1 (555) 123-4567',
      location: 'Los Angeles, CA',
      website: 'https://armfesthub.com',
      socialLinks: JSON.stringify({
        linkedin: 'https://linkedin.com/in/emulkin',
      }),
      permissions: JSON.stringify(['ALL']),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // 3. Create Demo Users with different roles
  console.log('👥 Creating demo users...')
  const demoUsers = []

  // Moderator
  const moderatorPassword = await bcrypt.hash(encodePassword('moderator123'), 12)
  const moderator = await prisma.user.create({
    data: {
      name: 'Alex Chen',
      email: 'moderator@armfesthub.com',
      password: moderatorPassword,
      role: 'MODERATOR',
      emailVerified: new Date(),
      isActive: true,
      organization: 'Content Review Team',
      bio: 'Content moderator ensuring quality event listings.',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      permissions: JSON.stringify(['MODERATE_CONTENT', 'REVIEW_FESTIVALS']),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      updatedAt: new Date()
    }
  })
  demoUsers.push(moderator)

  // Support Agent
  const supportPassword = await bcrypt.hash(encodePassword('support123'), 12)
  const support = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'support@armfesthub.com',
      password: supportPassword,
      role: 'SUPPORT',
      emailVerified: new Date(),
      isActive: true,
      organization: 'Customer Support',
      bio: 'Customer support specialist helping users with their queries.',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      permissions: JSON.stringify(['HANDLE_SUPPORT', 'VIEW_TICKETS']),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      updatedAt: new Date()
    }
  })
  demoUsers.push(support)

  // Event Organizers
  const organizerPassword = await bcrypt.hash(encodePassword('organizer123'), 12)
  const organizers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Michael Rodriguez',
        email: 'michael@musicevents.com',
        password: organizerPassword,
        role: 'ORGANIZER',
        emailVerified: new Date(),
        isActive: true,
        organization: 'Harmony Music Events',
        bio: 'Professional music event organizer with 10+ years experience.',
        phone: '+1 (555) 456-7890',
        location: 'Nashville, TN',
        website: 'https://harmonymusicevents.com',
        socialLinks: JSON.stringify({
          instagram: 'https://instagram.com/harmonymusic',
          facebook: 'https://facebook.com/harmonymusicevents'
        }),
        permissions: JSON.stringify(['CREATE_FESTIVALS', 'MANAGE_TICKETS']),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        updatedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        name: 'Lisa Park',
        email: 'lisa@culturalarts.org',
        password: organizerPassword,
        role: 'ORGANIZER',
        emailVerified: new Date(),
        isActive: true,
        organization: 'Cultural Arts Foundation',
        bio: 'Cultural event organizer specializing in art exhibitions and cultural events.',
        phone: '+1 (555) 567-8901',
        location: 'New York, NY',
        website: 'https://culturalarts.org',
        socialLinks: JSON.stringify({
          linkedin: 'https://linkedin.com/in/lisapark',
          twitter: 'https://twitter.com/lisapark'
        }),
        permissions: JSON.stringify(['CREATE_FESTIVALS', 'MANAGE_TICKETS']),
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), // 75 days ago
        updatedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        name: 'David Thompson',
        email: 'david@foodfestco.com',
        password: organizerPassword,
        role: 'ORGANIZER',
        emailVerified: new Date(),
        isActive: true,
        organization: 'Food Event Co.',
        bio: 'Culinary event specialist bringing the best food experiences to communities.',
        phone: '+1 (555) 678-9012',
        location: 'Portland, OR',
        website: 'https://foodfestco.com',
        permissions: JSON.stringify(['CREATE_FESTIVALS', 'MANAGE_TICKETS']),
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
        updatedAt: new Date()
      }
    })
  ])
  demoUsers.push(...organizers)

  // Regular Users
  const userPassword = await bcrypt.hash(encodePassword('user123'), 12)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Jennifer Williams',
        email: 'jennifer@example.com',
        password: userPassword,
        role: 'USER',
        emailVerified: new Date(),
        isActive: true,
        bio: 'Music lover and event enthusiast from California.',
        phone: '+1 (555) 789-0123',
        location: 'Los Angeles, CA',
        socialLinks: JSON.stringify({
          instagram: 'https://instagram.com/jenniferwilliams'
        }),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updatedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        name: 'Robert Davis',
        email: 'robert@example.com',
        password: userPassword,
        role: 'USER',
        emailVerified: new Date(),
        isActive: true,
        bio: 'Art enthusiast and cultural event attendee.',
        phone: '+1 (555) 890-1234',
        location: 'Chicago, IL',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        updatedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        name: 'Emily Brown',
        email: 'emily@example.com',
        password: userPassword,
        role: 'USER',
        emailVerified: new Date(),
        isActive: true,
        bio: 'Food lover exploring culinary events across the country.',
        phone: '+1 (555) 901-2345',
        location: 'Denver, CO',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date()
      }
    })
  ])
  demoUsers.push(...users)

  // 4. Create Events
  console.log('🎪 Creating events...')
  const events = []

  // Music Events
  const musicFestivals = await Promise.all([
    prisma.event.create({
      data: {
        name: 'Summer Harmony Music Event',
        slug: 'summer-harmony-music-event',
        description: 'A three-day celebration of indie rock, folk, and electronic music featuring both established artists and emerging talent.',
        categoryId: categories[0].id, // Music
        organizerId: organizers[0].id,
        startDate: new Date('2024-07-15T10:00:00Z'),
        endDate: new Date('2024-07-17T23:00:00Z'),
        startTime: '10:00',
        endTime: '23:00',
        venueName: 'Riverside Park Amphitheater',
        venueAddress: '123 Music Way',
        city: 'Nashville',
        state: 'Tennessee',
        zipCode: '37201',
        venueType: 'OUTDOOR',
        price: 89.99,
        capacity: 15000,
        expectedAttendance: '12000-15000',
        isFree: false,
        ageRestriction: '18+',
        isAccessible: true,
        hasParking: true,
        hasFoodVendors: true,
        servesAlcohol: true,
        images: [
          'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3'
        ],
        websiteUrl: 'https://summerharmonyfest.com',
        socialMediaLinks: 'https://instagram.com/summerharmony',
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    }),
    prisma.event.create({
      data: {
        name: 'Electronic Dreams Event',
        slug: 'electronic-dreams-event',
        description: 'Immerse yourself in the world of electronic music with world-class DJs and cutting-edge visual experiences.',
        categoryId: categories[0].id, // Music
        organizerId: organizers[0].id,
        startDate: new Date('2024-08-22T16:00:00Z'),
        endDate: new Date('2024-08-24T02:00:00Z'),
        startTime: '16:00',
        endTime: '02:00',
        venueName: 'Downtown Convention Center',
        venueAddress: '456 Beat Street',
        city: 'Las Vegas',
        state: 'Nevada',
        zipCode: '89101',
        venueType: 'INDOOR',
        price: 125.00,
        capacity: 8000,
        expectedAttendance: '6000-8000',
        isFree: false,
        ageRestriction: '21+',
        isAccessible: true,
        hasParking: true,
        hasFoodVendors: true,
        servesAlcohol: true,
        images: [
          'https://images.unsplash.com/photo-1571266028243-d220bbceaa22',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'
        ],
        websiteUrl: 'https://electronicdreams.com',
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    })
  ])
  events.push(...musicFestivals)

  // Cultural Events
  const culturalFestivals = await Promise.all([
    prisma.event.create({
      data: {
        name: 'International Cultural Heritage Event',
        slug: 'international-cultural-heritage-event',
        description: 'Celebrate diverse cultures through traditional performances, authentic cuisine, and interactive cultural exhibits.',
        categoryId: categories[2].id, // Culture
        organizerId: organizers[1].id,
        startDate: new Date('2024-09-05T09:00:00Z'),
        endDate: new Date('2024-09-07T21:00:00Z'),
        startTime: '09:00',
        endTime: '21:00',
        venueName: 'Central Cultural Plaza',
        venueAddress: '789 Heritage Ave',
        city: 'New York',
        state: 'New York',
        zipCode: '10001',
        venueType: 'MIXED',
        price: 25.00,
        capacity: 5000,
        expectedAttendance: '3000-5000',
        isFree: false,
        isAccessible: true,
        hasParking: false,
        hasFoodVendors: true,
        servesAlcohol: false,
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176'
        ],
        websiteUrl: 'https://culturalheritagefest.org',
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    })
  ])
  events.push(...culturalFestivals)

  // Food Events
  const foodFestivals = await Promise.all([
    prisma.event.create({
      data: {
        name: 'Pacific Northwest Food & Wine Event',
        slug: 'pacific-northwest-food-wine-event',
        description: 'Discover the flavors of the Pacific Northwest with local chefs, craft breweries, and artisanal food vendors.',
        categoryId: categories[1].id, // Food
        organizerId: organizers[2].id,
        startDate: new Date('2024-10-12T11:00:00Z'),
        endDate: new Date('2024-10-13T20:00:00Z'),
        startTime: '11:00',
        endTime: '20:00',
        venueName: 'Waterfront Park',
        venueAddress: '321 Culinary Drive',
        city: 'Portland',
        state: 'Oregon',
        zipCode: '97201',
        venueType: 'OUTDOOR',
        price: 45.00,
        capacity: 3000,
        expectedAttendance: '2500-3000',
        isFree: false,
        ageRestriction: '21+ (alcohol areas)',
        isAccessible: true,
        hasParking: true,
        hasFoodVendors: true,
        servesAlcohol: true,
        images: [
          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
          'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce'
        ],
        websiteUrl: 'https://pnwfoodwine.com',
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    })
  ])
  events.push(...foodFestivals)

  // Art Events
  const artFestivals = await Promise.all([
    prisma.event.create({
      data: {
        name: 'Contemporary Art Showcase',
        slug: 'contemporary-art-showcase',
        description: 'An immersive art experience featuring contemporary works from emerging and established artists.',
        categoryId: categories[3].id, // Art
        organizerId: organizers[1].id,
        startDate: new Date('2024-11-01T10:00:00Z'),
        endDate: new Date('2024-11-03T18:00:00Z'),
        startTime: '10:00',
        endTime: '18:00',
        venueName: 'Modern Art Gallery',
        venueAddress: '654 Artist Lane',
        city: 'Miami',
        state: 'Florida',
        zipCode: '33101',
        venueType: 'INDOOR',
        price: 35.00,
        capacity: 2000,
        expectedAttendance: '1500-2000',
        isFree: false,
        isAccessible: true,
        hasParking: true,
        hasFoodVendors: false,
        servesAlcohol: true,
        images: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
          'https://images.unsplash.com/photo-1578321272176-b7bbc0679853'
        ],
        websiteUrl: 'https://contemporaryartshow.com',
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    })
  ])
  events.push(...artFestivals)

  // 5. Create Event Requests (for moderation queue)
  console.log('📝 Creating event requests...')
  await Promise.all([
    prisma.eventRequest.create({
      data: {
        organizerName: 'James Wilson',
        organizerEmail: 'james@techsummit.com',
        organizerPhone: '+1 (555) 111-2222',
        organizationName: 'Tech Innovation Summit',
        organizationWebsite: 'https://techsummit.com',
        organizationDescription: 'Technology conference organizer specializing in innovation showcases.',
        eventName: 'Future Tech Summit 2024',
        eventDescription: 'A groundbreaking technology conference featuring AI, blockchain, and emerging tech.',
        category: 'Technology',
        startDate: new Date('2024-12-15T09:00:00Z'),
        endDate: new Date('2024-12-17T17:00:00Z'),
        startTime: '09:00',
        endTime: '17:00',
        venueName: 'Silicon Valley Convention Center',
        venueAddress: '123 Tech Drive',
        city: 'San Jose',
        state: 'California',
        zipCode: '95101',
        venueType: 'INDOOR',
        expectedAttendance: '5000-7000',
        ticketPrice: 299.00,
        isFree: false,
        ageRestriction: 'Professional attendees only',
        isAccessible: true,
        hasParking: true,
        hasFoodVendors: true,
        servesAlcohol: false,
        websiteUrl: 'https://futuretechsummit.com',
        marketingPlan: 'Digital marketing campaign targeting tech professionals and industry leaders.',
        hasPermits: true,
        status: 'PENDING',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date()
      }
    }),
    prisma.eventRequest.create({
      data: {
        organizerName: 'Maria Gonzalez',
        organizerEmail: 'maria@localarts.org',
        organizerPhone: '+1 (555) 333-4444',
        organizationName: 'Local Arts Community',
        organizationDescription: 'Community organization promoting local artists and cultural events.',
        eventName: 'Street Art Event',
        eventDescription: 'Celebrating urban street art with live murals, graffiti workshops, and local artists.',
        category: 'Art & Craft',
        startDate: new Date('2024-08-30T10:00:00Z'),
        endDate: new Date('2024-08-30T22:00:00Z'),
        startTime: '10:00',
        endTime: '22:00',
        venueName: 'Downtown Arts District',
        venueAddress: '456 Urban Street',
        city: 'Los Angeles',
        state: 'California',
        zipCode: '90014',
        venueType: 'OUTDOOR',
        expectedAttendance: '2000-3000',
        ticketPrice: 0,
        isFree: true,
        isAccessible: true,
        hasParking: false,
        hasFoodVendors: true,
        servesAlcohol: false,
        marketingPlan: 'Social media promotion and community outreach.',
        hasPermits: false,
        status: 'UNDER_REVIEW',
        reviewerId: moderator.id,
        reviewNotes: 'Need to verify permits for outdoor art installations.',
        submittedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    })
  ])

  // 6. Create Tickets for events
  console.log('🎫 Creating tickets...')
  const tickets = []
  
  // Create tickets for each event
  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    const ticketsToCreate = Math.floor(Math.random() * 50) + 10 // 10-60 tickets per event
    
    for (let j = 0; j < ticketsToCreate; j++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const ticketId = `TKT-${event.id.substring(0, 8).toUpperCase()}-${String(j + 1).padStart(4, '0')}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      const qrCode = `QR-${ticketId}`
      
      const ticket = await prisma.ticket.create({
        data: {
          ticketId,
          qrCode,
          buyerName: randomUser.name!,
          buyerEmail: randomUser.email,
          buyerPhone: randomUser.phone || '+1 (555) 000-0000',
          price: event.price,
          currency: event.currency,
          status: 'ACTIVE',
          qrCodeData: JSON.stringify({
            ticketId,
            eventId: event.id,
            buyerEmail: randomUser.email,
            validUntil: event.endDate
          }),
          isUsed: Math.random() < 0.1, // 10% chance ticket is already used
          usedAt: Math.random() < 0.1 ? new Date() : null,
          eventId: event.id,
          buyerId: randomUser.id,
          purchasedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
          updatedAt: new Date()
        }
      })
      tickets.push(ticket)
    }
  }

  // 7. Create Support Tickets
  console.log('🎧 Creating support tickets...')
  const supportTickets = await Promise.all([
    prisma.supportTicket.create({
      data: {
        subject: 'Unable to download my ticket',
        description: 'I purchased a ticket for the Summer Harmony event but the download link is not working. Can you help?',
        priority: 'HIGH',
        status: 'OPEN',
        category: 'Technical Issue',
        userId: users[0].id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date()
      }
    }),
    prisma.supportTicket.create({
      data: {
        subject: 'Refund request',
        description: 'I need to request a refund for my Electronic Dreams Event ticket due to a scheduling conflict.',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        category: 'Refund Request',
        userId: users[1].id,
        assignedTo: support.id,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    }),
    prisma.supportTicket.create({
      data: {
        subject: 'Event venue question',
        description: 'Is the Cultural Heritage Event venue accessible for wheelchairs? I couldn\'t find this information on the page.',
        priority: 'LOW',
        status: 'RESOLVED',
        category: 'General Inquiry',
        userId: users[2].id,
        assignedTo: support.id,
        resolution: 'Yes, the Central Cultural Plaza is fully wheelchair accessible. All entrances and facilities accommodate wheelchairs.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        closedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.supportTicket.create({
      data: {
        subject: 'Payment processing error',
        description: 'My credit card was charged but I didn\'t receive a confirmation email for my ticket purchase.',
        priority: 'URGENT',
        status: 'OPEN',
        category: 'Payment Issue',
        userId: users[0].id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date()
      }
    })
  ])

  // 8. Create Audit Logs for admin activities
  console.log('📊 Creating audit logs...')
  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: adminUser.id,
        metadata: JSON.stringify({ loginMethod: 'credentials', ipAddress: '192.168.1.100' }),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date()
      }
    }),
    prisma.auditLog.create({
      data: {
        userId: moderator.id,
        action: 'FESTIVAL_REQUEST_REVIEWED',
        entity: 'EventRequest',
        entityId: 'request-id-123',
        changes: JSON.stringify({ status: { from: 'PENDING', to: 'UNDER_REVIEW' } }),
        metadata: JSON.stringify({ reviewNotes: 'Initial review completed' }),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    })
  ])

  console.log('🎉 Database seeding completed successfully!')
  console.log(`
✅ Created:
   - ${categories.length} categories
   - 1 admin user (${adminUser.email})
   - ${demoUsers.length} demo users
   - ${events.length} events
   - 2 event requests
   - ${tickets.length} tickets
   - ${supportTickets.length} support tickets
   - 2 audit log entries

🔑 Login credentials:
   - Admin: ${adminUser.email} / ${adminCreds.password}
   - Moderator: moderator@armfesthub.com / moderator123
   - Support: support@armfesthub.com / support123
   - Organizer: michael@musicevents.com / organizer123
   - User: jennifer@example.com / user123
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })