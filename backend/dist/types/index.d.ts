import { Request } from 'express';
export type PlanType = 'free' | 'pro' | 'advanced' | 'enterprise';
export type PaymentMethodType = 'credit_card' | 'pix' | 'boleto';
export type Status = 'triagem' | 'entrevista' | 'teste' | 'offer' | 'contratado' | 'reprovado';
export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    companyName?: string;
    avatar?: string;
    plan: PlanType;
    planExpiryDate?: string;
    createdAt: string;
    updatedAt: string;
}
export interface PaymentMethod {
    id: string;
    userId: string;
    type: PaymentMethodType;
    last4?: string;
    brand?: string;
    expiryMonth?: string;
    expiryYear?: string;
    isDefault: boolean;
}
export interface CustomField {
    id: string;
    name: string;
    type: 'text' | 'number' | 'rating' | 'select' | 'boolean' | 'link';
    icon?: string;
    visibility: {
        card: boolean;
        table: boolean;
        detail: boolean;
    };
    maxRating?: number;
    options?: string[];
}
export interface Job {
    id: string;
    userId: string;
    name: string;
    description?: string;
    plan: PlanType;
    template?: string;
    dashboardModel: string;
    colorTheme: string;
    customFields: CustomField[];
    createdAt: string;
    updatedAt: string;
}
export interface Candidate {
    id: string;
    jobId: string;
    nome: string;
    idade: number;
    cidade: string;
    curriculo?: string;
    pretensaoSalarial: number;
    salarioAtual?: number;
    status: Status;
    observacoes?: string;
    customFields: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export interface AuthRequest extends Request {
    user?: User;
}
//# sourceMappingURL=index.d.ts.map