"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', paymentController_1.getPaymentMethods);
router.post('/', paymentController_1.createPaymentMethod);
router.put('/:id/default', paymentController_1.setDefaultPaymentMethod);
router.delete('/:id', paymentController_1.deletePaymentMethod);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map