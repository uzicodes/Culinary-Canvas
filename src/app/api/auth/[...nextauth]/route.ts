import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // Adjust path if needed
import { findUserByEmail, validPassword } from "@/app/api/auth/utils/userAuth";

// Do NOT export authOptions
// Only export the handler
const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          const user = await findUserByEmail(credentials.email);
          if (user && await validPassword(credentials.password, user.password)) {
            // Remove password and convert _id to id
            const { password, _id, ...userWithoutPassword } = user;
            return { ...userWithoutPassword, id: _id.toString() };
          }
          return null;
        } catch (err) {
          // Log error for debugging
          console.error('Authorize error:', err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 60, // 30 minutes in seconds
    updateAge: 5 * 60, // Update session every 5 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.createdAt = (user as any).createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).createdAt = token.createdAt;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };