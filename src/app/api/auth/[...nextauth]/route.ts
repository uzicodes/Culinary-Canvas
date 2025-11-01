import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // Adjust path if needed
import { findUserByEmail, validPassword } from "@/app/api/auth/utils/userAuth";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await findUserByEmail(credentials.email);
        if (user && await validPassword(credentials.password, user.password)) {
          // Remove password and convert _id to id
          const { password, _id, ...userWithoutPassword } = user;
          return { ...userWithoutPassword, id: _id.toString() };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt"  as const },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };