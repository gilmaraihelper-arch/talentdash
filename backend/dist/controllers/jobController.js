"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.createJob = exports.getJob = exports.getJobs = void 0;
const db_1 = require("../db");
const getJobs = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const jobs = db_1.db.jobs.filter((j) => j.userId === user.id);
        res.json(jobs);
    }
    catch (error) {
        console.error('GetJobs error:', error);
        res.status(500).json({ error: 'Erro ao buscar mapeamentos' });
    }
};
exports.getJobs = getJobs;
const getJob = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const id = req.params.id;
        const job = db_1.db.jobs.find((j) => j.id === id && j.userId === user.id);
        if (!job) {
            res.status(404).json({ error: 'Mapeamento não encontrado' });
            return;
        }
        res.json(job);
    }
    catch (error) {
        console.error('GetJob error:', error);
        res.status(500).json({ error: 'Erro ao buscar mapeamento' });
    }
};
exports.getJob = getJob;
const createJob = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { name, description, plan = 'free', template, dashboardModel = 'padrao', colorTheme = 'blue', customFields = [], } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Nome é obrigatório' });
            return;
        }
        const newJob = {
            id: `job-${Date.now()}`,
            userId: user.id,
            name,
            description,
            plan: plan,
            template,
            dashboardModel,
            colorTheme,
            customFields,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        db_1.db.jobs.push(newJob);
        (0, db_1.saveDB)(db_1.db);
        res.status(201).json(newJob);
    }
    catch (error) {
        console.error('CreateJob error:', error);
        res.status(500).json({ error: 'Erro ao criar mapeamento' });
    }
};
exports.createJob = createJob;
const updateJob = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const id = req.params.id;
        const jobIndex = db_1.db.jobs.findIndex((j) => j.id === id && j.userId === user.id);
        if (jobIndex === -1) {
            res.status(404).json({ error: 'Mapeamento não encontrado' });
            return;
        }
        const { name, description, dashboardModel, colorTheme, customFields, } = req.body;
        db_1.db.jobs[jobIndex] = {
            ...db_1.db.jobs[jobIndex],
            name: name !== undefined ? name : db_1.db.jobs[jobIndex].name,
            description: description !== undefined ? description : db_1.db.jobs[jobIndex].description,
            dashboardModel: dashboardModel !== undefined ? dashboardModel : db_1.db.jobs[jobIndex].dashboardModel,
            colorTheme: colorTheme !== undefined ? colorTheme : db_1.db.jobs[jobIndex].colorTheme,
            customFields: customFields !== undefined ? customFields : db_1.db.jobs[jobIndex].customFields,
            updatedAt: new Date().toISOString(),
        };
        (0, db_1.saveDB)(db_1.db);
        res.json(db_1.db.jobs[jobIndex]);
    }
    catch (error) {
        console.error('UpdateJob error:', error);
        res.status(500).json({ error: 'Erro ao atualizar mapeamento' });
    }
};
exports.updateJob = updateJob;
const deleteJob = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const id = req.params.id;
        const jobIndex = db_1.db.jobs.findIndex((j) => j.id === id && j.userId === user.id);
        if (jobIndex === -1) {
            res.status(404).json({ error: 'Mapeamento não encontrado' });
            return;
        }
        // Delete associated candidates
        db_1.db.candidates = db_1.db.candidates.filter((c) => c.jobId !== id);
        // Delete job
        db_1.db.jobs.splice(jobIndex, 1);
        (0, db_1.saveDB)(db_1.db);
        res.json({ message: 'Mapeamento excluído com sucesso' });
    }
    catch (error) {
        console.error('DeleteJob error:', error);
        res.status(500).json({ error: 'Erro ao excluir mapeamento' });
    }
};
exports.deleteJob = deleteJob;
//# sourceMappingURL=jobController.js.map