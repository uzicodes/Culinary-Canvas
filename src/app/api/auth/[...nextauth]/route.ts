import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // Adjust path if needed

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
        // TODO: Replace with your user lookup and password check logic
        // Example:
        // const user = await findUserByEmail(credentials.email);
        // if (user && validPassword(credentials.password, user.password)) {
        //   return user;
        // }
        // return null;
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