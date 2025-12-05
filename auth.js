import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Chamar seu backend NestJS para validar
          const baseUrl =
            process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
          const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          // Retornar user object com role
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Primeira vez que o usuário faz login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }

      // Se não tiver role, tenta buscar do backend
      if (!token.role && token.email) {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
          const res = await fetch(
            `${baseUrl}/users/by-email/${encodeURIComponent(token.email)}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (res.ok) {
            const text = await res.text();
            if (text) {
              const userData = JSON.parse(text);
              token.role = userData?.role || "CLIENT";
            } else {
              // Resposta vazia - usuário não existe, vamos criar
              const createRes = await fetch(`${baseUrl}/users`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: token.email,
                  name: token.name || token.email,
                  password: Math.random().toString(36), // Senha aleatória (não será usada para login Google)
                  role: "CLIENT",
                }),
              });

              if (createRes.ok) {
                token.role = "CLIENT";
              } else {
                token.role = "CLIENT";
              }
            }
          } else if (res.status === 404) {
            // Usuário não existe no backend, define como CLIENT
            token.role = "CLIENT";
          } else {
            token.role = "CLIENT";
          }
        } catch (error) {
          token.role = "CLIENT"; // Fallback
        }
      }

      // Login com Google
      if (account?.provider === "google") {
        token.provider = "google";
      }

      return token;
    },
    async session({ session, token }) {
      // Adicionar informações extras na sessão
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
      }

      // Sempre buscar o role atualizado do backend para garantir que está sincronizado
      if (session?.user?.email) {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
          const res = await fetch(
            `${baseUrl}/users/by-email/${encodeURIComponent(
              session.user.email
            )}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          if (res.ok) {
            const userData = await res.json();
            session.user.role = userData?.role || session.user.role || "CLIENT";
          }
        } catch (error) {
          // Se falhar, mantém o role do token
        }
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      // Permitir login
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Se estiver fazendo login e for ADMIN ou EMPLOYEE, redirecionar para dashboard
      // Nota: neste ponto ainda não temos acesso direto ao role na session
      // então vamos redirecionar para /admin que vai fazer a verificação

      // Se a URL já for uma rota admin, manter
      if (url.startsWith(baseUrl + "/admin")) {
        return url;
      }

      // Se for callback de login, redirecionar para admin
      if (url === baseUrl || url === baseUrl + "/" || url.includes("/login")) {
        return baseUrl + "/admin";
      }

      // Para outras URLs, usar a URL solicitada ou baseUrl
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return baseUrl + url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
