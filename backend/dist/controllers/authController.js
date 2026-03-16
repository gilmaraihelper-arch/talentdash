"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePlan = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const register = async (req, res) => {
    try {
        const { email, password, name, companyName, plan = 'free' } = req.body;
        // Validation
        if (!email || !password || !name) {
            res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
            return;
        }
        // Check if user exists
        const existingUser = db_1.db.users.find((u) => u.email === email);
        if (existingUser) {
            res.status(409).json({ error: 'Email já cadastrado' });
            return;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const newUser = {
            id: `user-${Date.now()}`,
            email,
            password: hashedPassword,
            name,
            companyName,
            plan: plan,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        db_1.db.users.push(newUser);
        (0, db_1.saveDB)(db_1.db);
        // Generate token
        const token = (0, auth_1.generateToken)(newUser.id);
        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erro ao criar conta' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            res.status(400).json({ error: 'Email e senha são obrigatórios' });
            return;
        }
        // Find user
        const user = db_1.db.users.find((u) => u.email === email);
        if (!user) {
            res.status(401).json({ error: 'Email ou senha incorretos' });
            return;
        }
        // Verify password
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Email ou senha incorretos' });
            return;
        }
        // Generate token
        const token = (0, auth_1.generateToken)(user.id);
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};
exports.login = login;
const getMe = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    }
    catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
};
exports.getMe = getMe;
const updateProfile = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { name, companyName, email } = req.body;
        // Update user
        const userIndex = db_1.db.users.findIndex((u) => u.id === user.id);
        if (userIndex === -1) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }
        db_1.db.users[userIndex] = {
            ...db_1.db.users[userIndex],
            name: name || db_1.db.users[userIndex].name,
            companyName: companyName !== undefined ? companyName : db_1.db.users[userIndex].companyName,
            email: email || db_1.db.users[userIndex].email,
            updatedAt: new Date().toISOString(),
        };
        (0, db_1.saveDB)(db_1.db);
        const { password, ...userWithoutPassword } = db_1.db.users[userIndex];
        res.json(userWithoutPassword);
    }
    catch (error) {
        console.error('UpdateProfile error:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
};
exports.updateProfile = updateProfile;
const changePlan = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { plan } = req.body;
        const validPlans = ['free', 'pro', 'advanced', 'enterprise'];
        if (!validPlans.includes(plan)) {
            res.status(400).json({ error: 'Plano inválido' });
            return;
        }
        const userIndex = db_1.db.users.findIndex((u) => u.id === user.id);
        if (userIndex === -1) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }
        db_1.db.users[userIndex] = {
            ...db_1.db.users[userIndex],
            plan: plan,
            updatedAt: new Date().toISOString(),
        };
        (0, db_1.saveDB)(db_1.db);
        const { password, ...userWithoutPassword } = db_1.db.users[userIndex];
        res.json(userWithoutPassword);
    }
    catch (error) {
        console.error('ChangePlan error:', error);
        res.status(500).json({ error: 'Erro ao mudar plano' });
    }
};
exports.changePlan = changePlan;
//# sourceMappingURL=authController.js.map