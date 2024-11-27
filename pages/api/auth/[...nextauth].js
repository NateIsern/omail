import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { supabaseClient } from '../../../lib/supabaseClient';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      authorize: async (credentials) => {
        const { email, password } = credentials;
        const { user, error } = await supabaseClient.auth.signIn({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        return user;
      },
    }),
  ],
  adapter: SupabaseAdapter(supabaseClient),
  session: {
    jwt: true,
  },
  callbacks: {
    async session(session, user) {
      session.user = user;
      return session;
    },
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
