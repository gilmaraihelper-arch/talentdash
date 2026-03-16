"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidateController_1 = require("../controllers/candidateController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(auth_1.authMiddleware);
router.get('/', candidateController_1.getCandidates);
router.post('/', candidateController_1.createCandidate);
router.post('/bulk', candidateController_1.bulkCreateCandidates);
router.get('/:id', candidateController_1.getCandidate);
router.put('/:id', candidateController_1.updateCandidate);
router.delete('/:id', candidateController_1.deleteCandidate);
exports.default = router;
//# sourceMappingURL=candidateRoutes.js.map