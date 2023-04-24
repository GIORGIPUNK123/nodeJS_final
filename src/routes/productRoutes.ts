import express, { Request } from 'express';
import {
  buyController,
  createController,
  editController,
  deleteController,
  displayController,
} from '../controllers/productController';
import { checkLogin } from '../middlewares/checkLogin';
import { validation } from '../middlewares/validationMiddleware';
import {
  productBuySchema,
  productDeleteSchema,
  productEditSchema,
} from '../validations/productSchema';
const router = express.Router();

// buy route
router.post('/buy', checkLogin(), validation(productBuySchema), buyController);

// create route
router.post('/create', checkLogin(), createController);

// edit route
router.put(
  '/edit/:id',
  checkLogin(),
  validation(productEditSchema),
  editController
);

// delete route
router.delete(
  '/delete/:id',
  checkLogin(),
  validation(productDeleteSchema),
  deleteController
);

// display route
router.get('/', displayController);

export default router;
