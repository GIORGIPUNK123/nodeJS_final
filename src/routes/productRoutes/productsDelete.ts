import express, { Request } from 'express';
import ProductCondition from '../../database/seqModels/productConditionsModel';
import ProductSize from '../../database/seqModels/productSizesModel';
import Product from '../../database/seqModels/productsModel';
import ProductType from '../../database/seqModels/productTypesModel';
import User from '../../database/seqModels/userModel';
const router = express.Router();

interface CustomRequest extends Request {
  userId?: number;
}

router.get('/', async (req: CustomRequest, res) => {
  // Product.update(
  //   {
  //     is_deleted: true,
  //   },
  //   {
  //     where: {
  //       title: req.body.title,
  //       user_id: req.userId,
  //     },
  //   }
  // );
  res.send(
    await Product.findAll({
      attributes: ['title', 'price', 'size_id'],
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
        },
        {
          model: ProductType,
          attributes: ['type'],
        },
        {
          model: ProductCondition,
          attributes: ['condition'],
        },
        {
          model: ProductSize,
          attributes: ['id', 'size'],
        },
      ],
    })
  );
});
export default router;
