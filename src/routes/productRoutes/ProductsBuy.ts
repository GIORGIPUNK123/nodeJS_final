import express, { Request } from 'express';
import ProductCondition from '../../database/seqModels/productConditionsModel';
import ProductSize from '../../database/seqModels/productSizesModel';
import Product from '../../database/seqModels/productsModel';
import ProductType from '../../database/seqModels/productTypesModel';
import { Transaction } from '../../database/seqModels/transactionsModel';
import User from '../../database/seqModels/userModel';
const router = express.Router();

interface CustomRequest extends Request {
  userId?: number;
}

router.post('/', async (req: CustomRequest, res) => {
  let currentTransaction;
  try {
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });
    const product = await Product.findOne({
      where: {
        id: req.body.productId,
      },
    });
    // console.log(user!.dataValues.balance);
    if (user!.dataValues.balance <= product!.dataValues.price) {
      throw new Error('Not enough balance');
    }
    if (req.userId === product!.dataValues.user_id) {
      throw new Error(`Can't buy a product from yourself`);
    }
    // currentTransaction = await Transaction.create({
    //   buyer_id: req.userId,
    //   seller_id: product!.dataValues.user_id,
    //   product_id: product!.dataValues.id,
    // });
    // await Product.update(
    //   {
    //     is_sold: true,
    //   },
    //   {
    //     where: {
    //       id: product!.dataValues.id,
    //     },
    //   }
    // );
  } catch (error) {
    console.log(`ERROR: `, error);
  }
  res.json({
    products: await Product.findAll({
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
    }),
    currentTransaction: currentTransaction,
  });
});
export default router;
