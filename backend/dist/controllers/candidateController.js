"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateCandidates = exports.deleteCandidate = exports.updateCandidate = exports.createCandidate = exports.getCandidate = exports.getCandidates = void 0;
const db_1 = require("../db");
const getCandidates = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const jobId = req.params.jobId;
        // Verify job belongs to user
        const job = db_1.db.jobs.find((j) => j.id === jobId && j.userId === user.id);
        if (!job) {
            res.status(404).json({ error: 'Mapeamento não encontrado' });
            return;
        }
        const candidates = db_1.db.candidates.filter((c) => c.jobId === jobId);
        res.json(candidates);
    }
    catch (error) {
        console.error('GetCandidates error:', error);
        res.status(500).json({ error: 'Erro ao buscar candidatos' });
    }
};
exports.getCandidates = getCandidates;
const getCandidate = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const jobId = req.params.jobId;
        const id = req.params.id;
        // Verify job belongs to user
        const job = db_1.db.jobs.find((j) => j.id === jobId && j.userId === user.id);
        if (!job) {
            res.status(404).json({ error: 'Mapeamento não encontrado' });
            return;
        }
        const candidate = db_1.db.candidates.find((c) => c.id === id && c.jobId === jobId);
        if (!candidate) {
            res.status(404).json({ error: 'Candidato não encontrado' });
            return;
        }
        res.json(candidate);
    }
    catch (error) {
        console.error('GetCandidate error:', error);
        res.status(500).json({ error: 'Erro ao buscar candidato' });
    }
};
exports.getCandidate = getCandidate;
const createCandidate = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const jobId = req.params.jobId;
        // Verify job belongs to user
        const job = db_1.db.jobs.find((j) => j.id === jobId && j.userId === user.id);
        if (!job) {
            res.status(404).json({ error: 'Mapeamento não encontrado' });
            return;
        }
        const { nome, idade, cidade, curriculo, pretensaoSalarial, salarioAtual, status = 'triagem', observacoes, customFields = {}, } = req.body;
        if (!nome || !idade || !cidade || pretensaoSalarial === undefined) {
            res.status(400).json({ error: 'Nome, idade, cidade e pretensão salarial são obrigatórios' });
            return;
        }
        const newCandidate = {
            id: `cand-${Date.now()}`,
            jobId,
            nome,
            idade: parseInt(idade),
            cidade,
            curriculo,
            pretensaoSalarial: parseInt(pretensaoSalarial),
            salarioAtual: salarioAtual ? parseInt(salarioAtual) : undefined,
            status: status,
            observacoes,
            customFields,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        db_1.db.candidates.push(newCandidate);
        (0, db_1.saveDB)(db_1.db);
        res.status(201).json(newCandidate);
    }
    catch (error) {
        console.error('CreateCandidate error:', error);
        res.status(500).json({ error: 'Erro ao criar candidato' });
    }
};
exports.createCandidate = createCandidate;
const updateCandidate = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const jobId = req.params.jobId;
        const id = req.params.id;
        // Verify job belongs to user
        const job = db_1.db.jobs.find((j) => j.id === jobId && j.userId === user.id);
        if (!job) {
            res.status(404).json({ error: 'Mapeamento não encontrado' });
            return;
        }
        const candidateIndex = db_1.db.candidates.findIndex((c) => c.id === id && c.jobId === jobId);
        if (candidateIndex === -1) {
            res.status(404).json({ error: 'Candidato não encontrado' });
            return;
        }
        const { nome, idade, cidade, curriculo, pretensaoSalarial, salarioAtual, status, observacoes, customFields, } = req.body;
        db_1.db.candidates[candidateIndex] = {
            ...db_1.db.candidates[candidateIndex],
            nome: nome !== undefined ? nome : db_1.db.candidates[candidateIndex].nome,
            idade: idade !== undefined ? parseInt(idade) : db_1.db.candidates[candidateIndex].idade,
            cidade: cidade !== undefined ? cidade : db_1.db.candidates[candidateIndex].cidade,
            curriculo: curriculo !== undefined ? curriculo : db_1.db.candidates[candidateIndex].curriculo,
            pretensaoSalarial: pretensaoSalarial !== undefined ? parseInt(pretensaoSalarial) : db_1.db.candidates[candidateIndex].pretensaoSalarial,
            salarioAtual: salarioAtual !== undefined ? (salarioAtual ? parseInt(salarioAtual) : undefined) : db_1.db.candidates[candidateIndex].salarioAtual,
            status: status !== undefined ? status : db_1.db.candidates[candidateIndex].status,
            observacoes: observacoes !== undefined ? observacoes : db_1.db.candidates[candidateIndex].observacoes,
            customFields: customFields !== undefined ? customFields : db_1.db.candidates[candidateIndex].customFields,
            updatedAt: new Date().toISOString(),
        };
        (0, db_1.saveDB)(db_1.db);
        res.json(db_1.db.candidates[candidateIndex]);
    }
    catch (error) {
        console.error('UpdateCandidate error:', error);
        res.status(500).json({ error: 'Erro ao atualizar candidato' });
    }
};
exports.updateCandidate = updateCandidate;
const deleteCandidate = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const jobId = req.params.jobId;
        const id = req.params.id;
        // Verify job belongs to user
        const job = db_1.db.jobs.find((j) => j.id === jobId && j.userId === user.id);
        if (!job) {
            res.status(404).json({ error: 'Mapeamento não encontrado' });
            return;
        }
        const candidateIndex = db_1.db.candidates.findIndex((c) => c.id === id && c.jobId === jobId);
        if (candidateIndex === -1) {
            res.status(404).json({ error: 'Candidato não encontrado' });
            return;
        }
        db_1.db.candidates.splice(candidateIndex, 1);
        (0, db_1.saveDB)(db_1.db);
        res.json({ message: 'Candidato excluído com sucesso' });
    }
    catch (error) {
        console.error('DeleteCandidate error:', error);
        res.status(500).json({ error: 'Erro ao excluir candidato' });
    }
};
exports.deleteCandidate = deleteCandidate;
const bulkCreateCandidates = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const jobId = req.params.jobId;
        const { candidates } = req.body;
        if (!Array.isArray(candidates) || candidates.length === 0) {
            res.status(400).json({ error: 'Lista de candidatos inválida' });
            return;
        }
        // Verify job belongs to user
        const job = db_1.db.jobs.find((j) => j.id === jobId && j.userId === user.id);
        if (!job) {
            res.status(404).json({ error: 'Mapeamento não encontrado' });
            return;
        }
        const createdCandidates = [];
        for (const candidateData of candidates) {
            const { nome, idade, cidade, curriculo, pretensaoSalarial, salarioAtual, status = 'triagem', observacoes, customFields = {}, } = candidateData;
            if (!nome || !idade || !cidade || pretensaoSalarial === undefined) {
                continue; // Skip invalid candidates
            }
            const newCandidate = {
                id: `cand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                jobId,
                nome,
                idade: parseInt(idade),
                cidade,
                curriculo,
                pretensaoSalarial: parseInt(pretensaoSalarial),
                salarioAtual: salarioAtual ? parseInt(salarioAtual) : undefined,
                status: status,
                observacoes,
                customFields,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            db_1.db.candidates.push(newCandidate);
            createdCandidates.push(newCandidate);
        }
        (0, db_1.saveDB)(db_1.db);
        res.status(201).json({
            message: `${createdCandidates.length} candidatos adicionados com sucesso`,
            candidates: createdCandidates,
        });
    }
    catch (error) {
        console.error('BulkCreateCandidates error:', error);
        res.status(500).json({ error: 'Erro ao criar candidatos em massa' });
    }
};
exports.bulkCreateCandidates = bulkCreateCandidates;
//# sourceMappingURL=candidateController.js.map