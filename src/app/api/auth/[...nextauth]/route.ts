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
          const client = await clientPromise;
          const db = client.db("culinary-canvas");



          if (credentials?.email && credentials?.password) {
            const user = await findUserByEmail(credentials.email);
            
            if (user && await validPassword(credentials.password, user.password)) {
              const { password, _id, ...userWithoutPassword } = user;
              return { 
                ...userWithoutPassword, 
                id: _id.toString(),
                role: user.role || "user" 
              };
            }
          }
          
          return null; // No credentials matched
        } catch (err) {
          console.error('Authorize error:', err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes session
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // Pass role to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role; // Pass role to the session
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redirect for user sign-in
  },
});

export { handler as GET, handler as POST };