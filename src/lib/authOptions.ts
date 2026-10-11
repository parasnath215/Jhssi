import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { logSystemEvent } from '@/lib/logger';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          await logSystemEvent({
            level: 'WARN',
            category: 'AUTH',
            message: `Failed sign-in attempt: No user found for email ${credentials.email}`,
          });
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          await logSystemEvent({
            level: 'SECURITY',
            category: 'AUTH',
            message: `Failed sign-in attempt: Invalid password for ${credentials.email}`,
            userId: user.id,
            userName: user.name,
          });
          throw new Error('Invalid password');
        }

        await logSystemEvent({
          level: user.role === 'SUPER_ADMIN' ? 'SECURITY' : 'INFO',
          category: 'AUTH',
          message: `Successful sign-in: ${user.name} (${user.email}) as ${user.role}`,
          userId: user.id,
          userName: user.name,
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // Fallback to home page
      }
      return baseUrl || '/';
    },
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};