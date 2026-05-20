import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUsers } from "@/app/data/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const user = getUsers().find(
                    (u) =>
                        u.username === credentials?.username &&
                        u.password === credentials?.password
                );

                if (!user) return null;

                return {
                    id: user.username,
                    name: user.name,
                    username: user.username,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.username = (user as { username?: string }).username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.username && session.user) {
                (session.user as { username?: string }).username = token.username as string;
            }
            return session;
        },
    },
});
