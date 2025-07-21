import { Role } from "@/generated/prisma"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: Role
    organization?: string | null
  }

  interface Session {
    user: {
      id: string
      role: Role
      organization?: string | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    organization?: string | null
  }
}