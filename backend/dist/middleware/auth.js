"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const JWT_SECRET = process.env.JWT_SECRET || 'talentdash-super-secret-key-2024';
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
};
exports.verifyToken = verifyToken;
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token não fornecido' });
        return;
    }
    const token = authHeader.substring(7);
    const decoded = (0, exports.verifyToken)(token);
    if (!decoded) {
        res.status(401).json({ error: 'Token inválido' });
        return;
    }
    const user = db_1.db.users.find((u) => u.id === decoded.userId);
    if (!user) {
        res.status(401).json({ error: 'Usuário não encontrado' });
        return;
    }
    req.user = user;
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map