# Análise de Integração - Mercado Pago no TalentDash

## 📊 Resumo da Análise

### Estrutura Atual de Pagamentos

O TalentDash já possui uma estrutura básica de pagamentos implementada:

**Frontend:**
- Hook `usePayments` com métodos: `addPaymentMethod`, `removePaymentMethod`, `setDefaultPaymentMethod`
- Tipos: `PaymentMethod` (credit_card, pix, boleto)
- Planos: Free, Pro (R$49/mês), Advanced (R$99/mês), Enterprise
- Armazenamento no Supabase (tabela `users`)

**Backend:**
- API REST com Express + Prisma + PostgreSQL
- Autenticação JWT
- Estrutura pronta para receber endpoints de pagamento

---

## 🎯 Opções de Integração Mercado Pago

### Opção 1: Mercado Pago Checkout Pro (Recomendado)

**O que é:** Checkout hospedado pelo Mercado Pago
**Vantagens:**
- ✅ Menor esforço de implementação
- ✅ PCI compliance automático (dados de cartão não passam pelo seu servidor)
- ✅ Suporte a cartão, PIX, boleto, PayPal, etc
- ✅ Mobile-friendly
- ✅ Recuperação de pagamentos abandonados

**Fluxo:**
1. Usuário escolhe plano
2. Frontend chama backend para criar preferência de pagamento
3. Backend cria preferência via API Mercado Pago
4. Retorna `init_point` (URL do checkout)
5. Usuário é redirecionado para checkout Mercado Pago
6. Após pagamento, webhook confirma e atualiza plano

**Implementação:**
```typescript
// Backend - Criar preferência
const preference = {
  items: [{
    title: 'Plano Pro - TalentDash',
    quantity: 1,
    currency_id: 'BRL',
    unit_price: 49.00
  }],
  payer: {
    email: user.email,
    name: user.name
  },
  back_urls: {
    success: 'https://taldash.com.br/payment/success',
    failure: 'https://taldash.com.br/payment/failure',
    pending: 'https://taldash.com.br/payment/pending'
  },
  auto_return: 'approved',
  notification_url: 'https://backend-five-sigma-73.vercel.app/webhooks/mercado-pago'
};
```

---

### Opção 2: Mercado Pago Checkout Transparente (API)

**O que é:** Pagamento integrado na sua UI
**Vantagens:**
- ✅ Experiência 100% white-label
- ✅ Controle total do fluxo
- ✅ Menor churn (usuário não sai do site)

**Desvantagens:**
- ❌ Maior complexidade
- ❌ Requer PCI compliance
- ❌ Implementação de tokenização de cartão

**NÃO RECOMENDADO** para MVP - complexidade alta

---

### Opção 3: Assinaturas (Subscriptions) - Melhor para SaaS

**O que é:** Cobrança recorrente automática
**Vantagens:**
- ✅ Ideal para modelo SaaS (planos mensais)
- ✅ Renovação automática
- ✅ Gestão de assinaturas integrada
- ✅ Webhooks para eventos (pagamento, falha, cancelamento)

**Implementação:**
```typescript
// Criar plano de assinatura
const plan = {
  reason: 'Plano Pro - TalentDash',
  auto_recurring: {
    frequency: 1,
    frequency_type: 'months',
    transaction_amount: 49.00,
    currency_id: 'BRL'
  }
};

// Criar assinatura para usuário
const subscription = {
  preapproval_plan_id: plan.id,
  payer_email: user.email,
  card_token_id: token.id  // Token do cartão
};
```

---

## 🏗️ Arquitetura Recomendada

### Stack Tecnológico

| Componente | Tecnologia | Onde |
|------------|-----------|------|
| SDK Mercado Pago | `mercadopago` (npm) | Backend |
| Checkout | Checkout Pro | Frontend (redirect) |
| Webhooks | Express route | Backend |
| Status Pagamento | Supabase/Prisma | Database |

### Novos Endpoints Necessários

```typescript
// POST /api/payments/create-preference
// Cria preferência de pagamento

// POST /api/payments/subscribe
// Cria assinatura recorrente

// POST /webhooks/mercado-pago
// Recebe notificações de pagamento

// GET /api/payments/status
// Verifica status da assinatura

// POST /api/payments/cancel
// Cancela assinatura
```

### Novas Tabelas (Prisma)

```prisma
model Subscription {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  plan        String   // free, pro, advanced, enterprise
  mpSubscriptionId String? // ID da assinatura no Mercado Pago
  status      String   // active, paused, cancelled, pending
  amount      Float
  currency    String   @default("BRL")
  frequency   Int      @default(1) // meses
  startDate   DateTime
  endDate     DateTime?
  lastPayment DateTime?
  nextPayment DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  payments    Payment[]
}

model Payment {
  id            String   @id @default(uuid())
  subscriptionId String
  subscription  Subscription @relation(fields: [subscriptionId], references: [id])
  mpPaymentId   String?  // ID do pagamento no Mercado Pago
  amount        Float
  status        String   // approved, pending, rejected
  paymentMethod String?  // credit_card, pix, boleto
  paidAt        DateTime?
  createdAt     DateTime @default(now())
}
```

---

## 📋 Plano de Implementação

### Fase 1: Setup (1-2 dias)
1. Criar conta Mercado Pago (modo produção)
2. Obter credenciais (Access Token, Public Key)
3. Configurar webhook no dashboard MP
4. Adicionar variáveis de ambiente

### Fase 2: Backend (3-4 dias)
1. Instalar SDK `mercadopago`
2. Criar endpoints de pagamento
3. Implementar webhook handler
4. Atualizar schema Prisma
5. Criar serviço de assinaturas

### Fase 3: Frontend (2-3 dias)
1. Atualizar página de planos com botões de pagamento
2. Criar página de sucesso/falha
3. Implementar loading states
4. Adicionar indicador de plano ativo no dashboard

### Fase 4: Testes (2 dias)
1. Testar com sandbox Mercado Pago
2. Testar webhooks
3. Testar fluxo completo
4. Testar renovação/cancelamento

**Total estimado: 8-11 dias**

---

## 💰 Custos Mercado Pago

| Transação | Taxa |
|-----------|------|
| Cartão de crédito | 4.49% + R$0.10 |
| PIX | 0.99% |
| Boleto | 3.19% + R$0.10 |
| Assinaturas | Mesmas taxas |

**Sem custo mensal - apenas por transação**

---

## 🔐 Segurança

1. **Nunca** armazene dados de cartão
2. Use tokens do Mercado Pago
3. Valide webhooks com assinatura
4. Use HTTPS em produção
5. Implemente idempotência nos endpoints

---

## 📚 Documentação Útil

- [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- [Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing)
- [Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/landing)
- [SDK Node.js](https://github.com/mercadopago/sdk-nodejs)

---

## ✅ Recomendação Final

**Usar Mercado Pago Checkout Pro + Assinaturas**

- Checkout Pro para pagamento inicial (menor fricção)
- Assinaturas para recorrência (renovação automática)
- Webhooks para sincronização de status

**Vantagens para o TalentDash:**
- PIX integrado (brasileiro)
- Suporte a cartões
- Boleto para empresas
- Checkout mobile-optimized
- Sem custo fixo

---

*Análise realizada em: 2026-06-02*
*Por: Liliana (AI Coordinator)*
