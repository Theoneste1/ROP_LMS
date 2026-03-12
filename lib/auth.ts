import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // If prisma is not available (dummy data mode), return null
          if (!prisma) {
            return null
          }

          // Wrap Prisma calls in try-catch to handle PrismaClient errors gracefully
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            String(credentials.password),
            String(user.password)
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id as string,
            email: user.email as string,
            name: user.name as string | null,
            role: user.role as string,
            image: user.image as string | null,
          }
        } catch (error) {
          // If Prisma fails, return null (auth is optional)
          console.error('Auth error (suppressed):', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  // Suppress errors when auth fails (auth is optional)
  debug: false,
})
