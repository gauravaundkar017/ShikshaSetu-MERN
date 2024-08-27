import { Router } from 'express';
import {userStats} from '../controllers/miscellaneous.controller.js';
import { isLoggedIn,
  authorizedRoles  } from '../middlewares/authMiddleware.js';

const router = Router();


router.route('/admin/stats/users').get(isLoggedIn, authorizedRoles('ADMIN'), userStats);

export default router;
