# NextAuth.js Implementation Guide

## ✅ O que foi implementado

NextAuth.js v5 com suporte para:
- ✅ Login com credenciais (email/senha via backend NestJS)
- ✅ Login com Google OAuth
- ✅ Sessão JWT
- ✅ UI de login atualizada

## 📦 Arquivos Criados/Modificados

### Novos Arquivos:
- `auth.js` - Configuração central do NextAuth
- `app/api/auth/[...nextauth]/route.js` - API route para NextAuth
- `components/AuthProvider.js` - Session provider para client components
- `.env.local.example` - Template de variáveis de ambiente

### Modificados:
- `app/layout.js` - Wrapped com AuthProvider
- `app/login/page.js` - Usando `signIn()` do NextAuth
- `app/login/login.module.scss` - Adicionado estilos para botão Google

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente

Crie `.env.local` na raiz do frontend (`ligatipo/`):

```bash
# Gere com: openssl rand -base64 32
AUTH_SECRET=sua-chave-secreta-aqui-minimo-32-caracteres

# Google OAuth (opcional, mas recomendado)
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret

# Backend API (já configurado)
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

### 2. Configurar Google OAuth (Opcional)

Para habilitar login com Google:

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth client ID**
5. Configure:
   - Application type: **Web application**
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://seu-dominio.com/api/auth/callback/google` (produção)
6. Copie Client ID e Client Secret para `.env.local`

### 3. Gerar AUTH_SECRET

```bash
# No terminal
openssl rand -base64 32
```

Copie o resultado para `AUTH_SECRET` no `.env.local`

## 🚀 Como Usar

### Login Programático

```javascript
import { signIn, signOut, useSession } from "next-auth/react";

// Em qualquer Client Component
function MyComponent() {
  const { data: session, status } = useSession();

  // Login com credenciais
  const handleLogin = async () => {
    await signIn("credentials", {
      email: "admin@ligatipo.com",
      password: "admin123",
      callbackUrl: "/dashboard"
    });
  };

  // Login com Google
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  // Logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") return <div>Carregando...</div>;
  if (status === "authenticated") return <div>Olá, {session.user.name}!</div>;
  return <div>Não autenticado</div>;
}
```

### Proteger Rotas (Server Component)

```javascript
// app/dashboard/page.js
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <div>Dashboard protegido: {session.user.email}</div>;
}
```

### Proteger API Routes

```javascript
// app/api/protected/route.js
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ data: "Dados protegidos" });
}
```

## 📝 Credenciais de Teste

**Login com Email/Senha:**
- Email: `admin@ligatipo.com`
- Senha: `admin123`

**Login com Google:**
- Configure as credenciais OAuth conforme instruções acima

## 🔄 Fluxo de Autenticação

### Com Credenciais:
1. Usuário preenche email/senha
2. NextAuth chama `authorize()` em `auth.js`
3. Faz POST para `${NEXT_PUBLIC_API_BASE}/auth/login`
4. Backend NestJS valida com bcrypt
5. Retorna dados do usuário
6. NextAuth cria sessão JWT
7. Usuário é redirecionado

### Com Google:
1. Usuário clica "Continuar com Google"
2. NextAuth redireciona para OAuth do Google
3. Usuário autoriza
4. Google redireciona de volta com código
5. NextAuth troca código por dados do usuário
6. Cria sessão JWT
7. Usuário é redirecionado

## 🎨 UI Implementada

- ✅ Formulário de login com email/senha
- ✅ Botão "Continuar com Google" com ícone oficial
- ✅ Divisor "ou" entre métodos
- ✅ Feedback de loading
- ✅ Mensagens de erro
- ✅ Link para registro

## ⚡ Próximos Passos

1. **Configurar Google OAuth** (se quiser usar)
2. **Criar página de registro** (`/register`)
3. **Adicionar Magic Link** (email passwordless)
4. **Implementar proteção de rotas** com middleware
5. **Criar página de perfil** do usuário
6. **Adicionar refresh token** (se necessário)

## 🐛 Troubleshooting

**Erro: "AUTH_SECRET not set"**
- Solução: Adicione `AUTH_SECRET` no `.env.local`

**Google OAuth não funciona:**
- Verifique se os redirect URIs estão corretos
- Confirme que `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão definidos
- Certifique-se que o projeto do Google Cloud tem OAuth habilitado

**Login com credenciais falha:**
- Verifique se o backend está rodando em `:4000`
- Confirme que `NEXT_PUBLIC_API_BASE` está correto
- Teste o endpoint `/auth/login` diretamente

## 📚 Documentação

- [NextAuth.js v5 Docs](https://authjs.dev)
- [Google OAuth Setup](https://next-auth.js.org/providers/google)
- [Session Strategies](https://authjs.dev/concepts/session-strategies)
