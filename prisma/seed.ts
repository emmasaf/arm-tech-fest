import { PrismaClient } from '@/generated/prisma'
import bcrypt from 'bcryptjs'
import { getAdminCredentials, encodePassword } from '../src/lib/password-utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Get admin credentials from environment variables
  const adminCreds = getAdminCredentials()
  
  if (!adminCreds.email || !adminCreds.password) {
    throw new Error('Missing admin credentials in environment variables. Please set ADMIN_EMAIL and ADMIN_PASSWORD.')
  }

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminCreds.email }
  })

  if (existingAdmin) {
    console.log(`✅ Admin user already exists: ${adminCreds.email}`)
  } else {
    // Encode password for additional security
    const encodedPassword = encodePassword(adminCreds.password)
    
    // Hash the encoded password
    const hashedPassword = await bcrypt.hash(encodedPassword, 12)

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        name: adminCreds.name,
        email: adminCreds.email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        emailVerified: new Date(),
        isActive: true,
        organization: 'ArmEventHub',
        bio: 'Default system administrator with full access to all platform features.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log(`✅ Created admin user: ${adminUser.email} (ID: ${adminUser.id})`)
    console.log(`   Name: ${adminUser.name}`)
    console.log(`   Role: ${adminUser.role}`)
    console.log(`   Organization: ${adminUser.organization}`)
    console.log(`   Password: Encoded and hashed securely`)
  }

  // Create some default categories if they don't exist
  const categories = [
    {
      name: 'Music Event',
      slug: 'music',
      description: 'Live music performances and concerts',
      color: '#9333ea',
      icon: '🎵'
    },
    {
      name: 'Food & Drink',
      slug: 'food',
      description: 'Culinary experiences and food events',
      color: '#059669',
      icon: '🍽️'
    },
    {
      name: 'Cultural Event',
      slug: 'culture',
      description: 'Cultural celebrations and traditional events',
      color: '#dc2626',
      icon: '🎭'
    },
    {
      name: 'Art & Craft',
      slug: 'art',
      description: 'Art exhibitions and craft fairs',
      color: '#ea580c',
      icon: '🎨'
    },
    {
      name: 'Sports & Recreation',
      slug: 'sports',
      description: 'Sporting events and recreational activities',
      color: '#2563eb',
      icon: '⚽'
    }
  ]

  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: category.slug }
    })

    if (!existingCategory) {
      await prisma.category.create({
        data: category
      })
      console.log(`✅ Created category: ${category.name}`)
    } else {
      console.log(`✅ Category already exists: ${category.name}`)
    }
  }

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })