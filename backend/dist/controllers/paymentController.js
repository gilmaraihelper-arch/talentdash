"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentMethod = exports.setDefaultPaymentMethod = exports.createPaymentMethod = exports.getPaymentMethods = void 0;
const db_1 = require("../db");
const getPaymentMethods = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const paymentMethods = db_1.db.paymentMethods.filter((pm) => pm.userId === user.id);
        res.json(paymentMethods);
    }
    catch (error) {
        console.error('GetPaymentMethods error:', error);
        res.status(500).json({ error: 'Erro ao buscar métodos de pagamento' });
    }
};
exports.getPaymentMethods = getPaymentMethods;
const createPaymentMethod = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { type, last4, brand, expiryMonth, expiryYear, isDefault = false, } = req.body;
        if (!type) {
            res.status(400).json({ error: 'Tipo é obrigatório' });
            return;
        }
        // If setting as default, remove default from others
        if (isDefault) {
            db_1.db.paymentMethods = db_1.db.paymentMethods.map((pm) => pm.userId === user.id ? { ...pm, isDefault: false } : pm);
        }
        const newPaymentMethod = {
            id: `pm-${Date.now()}`,
            userId: user.id,
            type: type,
            last4,
            brand,
            expiryMonth,
            expiryYear,
            isDefault: isDefault || db_1.db.paymentMethods.filter((pm) => pm.userId === user.id).length === 0,
        };
        db_1.db.paymentMethods.push(newPaymentMethod);
        (0, db_1.saveDB)(db_1.db);
        res.status(201).json(newPaymentMethod);
    }
    catch (error) {
        console.error('CreatePaymentMethod error:', error);
        res.status(500).json({ error: 'Erro ao criar método de pagamento' });
    }
};
exports.createPaymentMethod = createPaymentMethod;
const setDefaultPaymentMethod = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const id = req.params.id;
        const paymentMethod = db_1.db.paymentMethods.find((pm) => pm.id === id && pm.userId === user.id);
        if (!paymentMethod) {
            res.status(404).json({ error: 'Método de pagamento não encontrado' });
            return;
        }
        // Remove default from all user's payment methods
        db_1.db.paymentMethods = db_1.db.paymentMethods.map((pm) => pm.userId === user.id ? { ...pm, isDefault: pm.id === id } : pm);
        (0, db_1.saveDB)(db_1.db);
        res.json({ message: 'Método de pagamento padrão atualizado' });
    }
    catch (error) {
        console.error('SetDefaultPaymentMethod error:', error);
        res.status(500).json({ error: 'Erro ao definir método padrão' });
    }
};
exports.setDefaultPaymentMethod = setDefaultPaymentMethod;
const deletePaymentMethod = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const id = req.params.id;
        const paymentMethodIndex = db_1.db.paymentMethods.findIndex((pm) => pm.id === id && pm.userId === user.id);
        if (paymentMethodIndex === -1) {
            res.status(404).json({ error: 'Método de pagamento não encontrado' });
            return;
        }
        const wasDefault = db_1.db.paymentMethods[paymentMethodIndex].isDefault;
        db_1.db.paymentMethods.splice(paymentMethodIndex, 1);
        // If deleted was default, set another as default
        if (wasDefault) {
            const userMethods = db_1.db.paymentMethods.filter((pm) => pm.userId === user.id);
            if (userMethods.length > 0) {
                const firstMethodIndex = db_1.db.paymentMethods.findIndex((pm) => pm.id === userMethods[0].id);
                db_1.db.paymentMethods[firstMethodIndex].isDefault = true;
            }
        }
        (0, db_1.saveDB)(db_1.db);
        res.json({ message: 'Método de pagamento excluído com sucesso' });
    }
    catch (error) {
        console.error('DeletePaymentMethod error:', error);
        res.status(500).json({ error: 'Erro ao excluir método de pagamento' });
    }
};
exports.deletePaymentMethod = deletePaymentMethod;
//# sourceMappingURL=paymentController.js.map