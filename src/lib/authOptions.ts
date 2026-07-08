import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { findUserByEmail, validPassword } from "@/app/api/auth/utils/userAuth";

const MASTER_ADMIN_KEY = process.env.NEXT_PUBLIC_MASTER_ADMIN_KEY || process.env.MASTER_ADMIN_KEY;

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const emailValue = credentials?.email?.trim() || '';
          const isAdminLoginAttempt = !emailValue || emailValue === 'master_admin';
          
          if (isAdminLoginAttempt && credentials?.password) {
            if (!MASTER_ADMIN_KEY) {
              return null;
            }

            if (credentials.password === MASTER_ADMIN_KEY) {
              return {
                id: "master-admin",
                name: "Master Admin",
                email: "master_admin",
                role: "admin",
              };
            } else if (!emailValue) {
              return null;
            }
            return null;
          }

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
          
          return null; 
        } catch (err) {
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
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
