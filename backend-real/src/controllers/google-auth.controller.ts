// src/controllers/google-auth.controller.ts
import { Request, Response } from 'express';
import { googleLogin } from '../services/google-auth.service.js';
import {
  successResponse,
  errorResponse,
} from '../utils/response.js';

// Login com Google OAuth
export async function googleAuth(req: Request, res: Response): Promise<void> {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      errorResponse(res, 'Token de acesso é obrigatório', 400);
      return;
    }

    const result = await googleLogin(accessToken);
    successResponse(res, result);
  } catch (error) {
    console.error('Erro no login Google:', error);
    if (error instanceof Error) {
      errorResponse(res, error.message, 401);
      return;
    }
    errorResponse(res, 'Erro ao fazer login com Google', 500);
  }
}

export default {
  googleAuth,
};
