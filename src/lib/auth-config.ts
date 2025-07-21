import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
// import { prisma } from "@/lib/prisma"
import prisma from "@/lib/prisma"

import { Adapter } from "next-auth/adapters"
import { encodePassword } from "@/lib/password-utils"

export const authOptions: NextAuthOptions = {
  //@ts-ignore
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
    signOut: "/signOut",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        // Encode the input password and compare with hashed version
        const encodedInputPassword = encodePassword(credentials.password)
        const isPasswordValid = await bcrypt.compare(
          encodedInputPassword,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated")
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          organization: user.organization,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.organization = (user as any).organization
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as any
        session.user.organization = token.organization as string
      }
      return session
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log successful sign in
      console.log(`User ${user.email} signed in`)
    }
  }
}