import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { encodePassword } from "@/lib/password-utils"

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  organization: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }
    
    // Encode password for additional security, then hash it
    const encodedPassword = encodePassword(validatedData.password)
    const hashedPassword = await bcrypt.hash(encodedPassword, 12)
    
    // Create user with default USER role
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        // phone: validatedData.phone,
        // organization: validatedData.organization,
        role: "USER", // Default role as requested
        // isActive: true,
        emailVerified: null, // Will be set when email is verified
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // organization: true,
        createdAt: true,
        // isActive: true,
      }
    })
    
    // // Log user creation for audit
    // await prisma.auditLog.create({
    //   data: {
    //     userId: user.id,
    //     action: "USER_REGISTERED",
    //     entity: "User",
    //     entityId: user.id,
    //     metadata: {
    //       email: user.email,
    //       registrationMethod: "credentials"
    //     },
    //     ipAddress: request.ip || "unknown",
    //     userAgent: request.headers.get("user-agent") || "unknown",
    //   }
    // })
    
    return NextResponse.json(
      { 
        message: "User registered successfully", 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error("Registration error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}