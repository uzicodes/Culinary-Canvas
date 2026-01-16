import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { findUserByEmail, validPassword } from "@/app/api/auth/utils/userAuth";

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
            const { password, _id, ...userWithoutPassword } = user;
            // Ensure the role is included in the returned user object
            return { 
              ...userWithoutPassword, 
              id: _id.toString(),
              role: user.role || "user" // Fallback to "user" if no role exists
            };
          }
          return null;
        } catch (err) {
          console.error('Authorize error:', err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // Add role to token
        token.createdAt = (user as any).createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role; // Add role to session
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