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
        password: { label: "Password", type: "password" } // This acts as the PIN
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db("culinary-canvas");

          // 1. ADMIN PIN-ONLY LOGIC
          // If the form sends a PIN (password) but NO email, we look in the 'admin' collection
          if (!credentials?.email && credentials?.password) {
            const admin = await db.collection("admin").findOne({ role: "admin" });

            if (admin && await validPassword(credentials.password, admin.password)) {
              return {
                id: admin._id.toString(),
                name: "Master Admin",
                role: "admin"
              };
            }
            return null; // Wrong PIN
          }

          // 2. MEMBER LOGIN LOGIC (Standard Email + Password)
          if (!credentials?.email || !credentials?.password) return null;
          
          const user = await findUserByEmail(credentials.email);
          
          if (user && await validPassword(credentials.password, user.password)) {
            const { password, _id, ...userWithoutPassword } = user;
            return { 
              ...userWithoutPassword, 
              id: _id.toString(),
              role: user.role || "user" 
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
        token.role = (user as any).role;
        token.createdAt = (user as any).createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).createdAt = token.createdAt;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // User sign-in page
  },
});

export { handler as GET, handler as POST };