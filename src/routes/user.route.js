import express from 'express';
import { loginController, registerController } from '../controllers/user.controller.js';

const router = express.Router(); // Define router as a constant

// Routes
router.route('/register').post(registerController);
router.route('/login').post(loginController);

export default router;
