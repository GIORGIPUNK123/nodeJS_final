import express from 'express';
import ProductCondition from '../../database/seqModels/productConditionsModel';
import ProductSize from '../../database/seqModels/productSizesModel';
import Product from '../../database/seqModels/productsModel';
import ProductType from '../../database/seqModels/productTypesModel';
import User from '../../database/seqModels/userModel';
const router = express.Router();

router.get('/', async (req, res) => {
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
