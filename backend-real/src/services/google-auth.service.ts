// src/services/google-auth.service.ts
import { prisma } from '../prisma.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { z } from 'zod';

// Schema para validar os dados do Google
const googleUserSchema = z.object({
  googleAccessToken: z.string().min(1, 'Token de acesso é obrigatório'),
});

// Interface para o usuário do Google
interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Valida o token de acesso do Google e retorna informações do usuário
 */
async function verifyGoogleToken(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token do Google inválido ou expirado');
  }

  const userInfo = await response.json();
  
  return {
    id: userInfo.sub,
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
  };
}

/**
 * Login ou registro com Google OAuth
 * Fluxo:
 * 1. Recebe o access token do frontend
 * 2. Valida o token com o Google
 * 3. Busca ou cria usuário no banco
 * 4. Gera JWT do TalentDash
 */
export async function googleLogin(googleAccessToken: string) {
  // Validar input
  const parsed = googleUserSchema.safeParse({ googleAccessToken });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  // Verificar token com o Google
  const googleUser = await verifyGoogleToken(googleAccessToken);

  // Buscar usuário existente pelo email do Google
  let user = await prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  // Se não existe, criar novo usuário
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
        password: '', // Usuários OAuth não têm senha
        role: 'USER',
        plan: 'PRO', // Usuários Google começam com PRO
      },
    });
  } else {
    // Atualizar avatar se mudou
    if (googleUser.picture && user.avatar !== googleUser.picture) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatar: googleUser.picture },
      });
    }
  }

  // Gerar JWT do TalentDash
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      plan: user.plan,
    },
  };
}

export default {
  googleLogin,
};
