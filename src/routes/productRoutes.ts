import express, { Request } from 'express';
import {
  createModel,
  findAllModels,
  findModelByValues,
  updateModel,
} from '../controllers';
import ProductCondition from '../database/seqModels/productConditionsModel';
import ProductSize from '../database/seqModels/productSizesModel';
import Product from '../database/seqModels/productsModel';
import ProductType from '../database/seqModels/productTypesModel';
import { Transaction } from '../database/seqModels/transactionsModel';
import User from '../database/seqModels/userModel';
import { checkLogin } from '../middlewares/checkLogin';
import { validation } from '../middlewares/validationMiddleware';
import {
  productBuySchema,
  productDeleteSchema,
  productEditSchema,
} from '../validations/productSchema';
const router = express.Router();

interface CustomRequest extends Request {
  userId?: number;
}
// buy route

router.post(
  '/buy',
  checkLogin(),
  validation(productBuySchema),
  async (req: CustomRequest, res) => {
    let currentTransaction;
    try {
      const user = await findModelByValues(User, { id: req.userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const product = await findModelByValues(Product, {
        id: req.body.productId,
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (user.dataValues.balance < product.dataValues.price) {
        return res.status(400).json({ message: 'Not enough balance' });
      }
      if (req.userId === product.dataValues.user_id) {
        return res
          .status(400)
          .json({ message: `Can't buy a product from yourself` });
      }

      currentTransaction = await createModel(Transaction, {
        buyer_id: req.userId,
        seller_id: product.dataValues.user_id,
        product_id: product.dataValues.id,
      });
      await updateModel(
        Product,
        { is_sold: true },
        { id: product.dataValues.id }
      );
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
    } catch (err: any) {
      res.status(500).json({ message: `Internal server error ${err.message}` });
      console.log(`ERROR FROM PRODUCTSBUY: `, err);
    }
  }
);

// create route

router.post('/create', async (req: CustomRequest, res) => {
  try {
    const { title, price, type, condition, size } = req.body;
    const userId = req.userId;
    const [typeRecord, conditionRecord, sizeRecord] = await Promise.all([
      ProductType.findOne({ where: { type } }),
      ProductCondition.findOne({ where: { condition } }),
      ProductSize.findOne({ where: { size } }),
    ]);
    const existingProduct = await findModelByValues(Product, {
      is_deleted: false,
      user_id: userId,
      title,
    });
    if (existingProduct) {
      throw new Error(
        `Title already exists in the database for this user please use a different title`
      );
    }
    await createModel(Product, {
      user_id: userId,
      title,
      price,
      type_id: typeRecord!.dataValues.id,
      condition_id: conditionRecord!.dataValues.id,
      size_id: sizeRecord!.dataValues.id,
    });
    const products = await Product.findAll({
      attributes: ['id', 'title', 'price', 'size_id'],
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
    });
    res.status(200).json(products);
  } catch (err) {
    console.error('Error from products create route: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// edit route

router.put(
  '/edit/:id',
  checkLogin(),
  validation(productEditSchema),
  async (req: CustomRequest, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await findModelByValues(Product, { id: productId });
      if (!product) throw new Error('Product not found');
      if (
        product.dataValues.user_id !== req.userId &&
        !(await User.findOne({ where: { id: req.userId, is_admin: true } }))
      )
        throw new Error(
          "You can't edit other user's products unless you are admin"
        );

      const { title, price, condition, size, type } = req.body;
      if (title !== undefined) product.title = title;
      if (price !== undefined) product.price = price;
      if (condition !== undefined) {
        const updateCondition = await findModelByValues(ProductCondition, {
          condition,
        });
        if (updateCondition) product.condition_id = updateCondition.id;
      }
      if (size !== undefined) {
        const updateSize = await findModelByValues(ProductSize, { size });
        if (updateSize) product.size_id = updateSize.id;
      }
      if (type !== undefined) {
        const updateType = await findModelByValues(ProductType, { type });
        if (updateType) product.type_id = updateType.id;
      }
      await product.save();
      const productWithAssociations = await findModelByValues(
        Product,
        { id: product.id },
        ['id', 'title', 'price'],
        [
          {
            model: User,
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
          },
          { model: ProductType, attributes: ['type'] },
          { model: ProductCondition, attributes: ['condition'] },
          { model: ProductSize, attributes: ['id', 'size'] },
        ]
      );
      res.json(productWithAssociations);
    } catch (err: any) {
      console.error(`Error from products delete route: `, err);
      res.status(400).json({ error: err.message });
    }
  }
);

// delete route
router.delete(
  '/delete/:id',
  checkLogin(),
  validation(productDeleteSchema),
  async (req: CustomRequest, res) => {
    try {
      let productId: number = parseInt(req.params.id);

      const data = await findModelByValues(Product, {
        id: req.userId,
        is_deleted: false,
      });

      if (!data) {
        throw new Error('Product not found');
      }
      if (data.dataValues.user_id !== req.userId) {
        const user = await User.findOne({ where: { id: req.userId } });
        if (!user!.dataValues.is_admin) {
          throw new Error(
            "You can't delete other user's products unless you are admin"
          );
        }
      }
      if (data.dataValues.is_deleted) {
        throw new Error('Product is already deleted');
      }
      await updateModel(
        Product,
        { deleted_at: Date.now, is_deleted: true },
        { id: productId }
      );
      res.json(
        await findAllModels(
          Product,
          ['id', 'title', 'price'],
          [
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
          ]
        )
      );
    } catch (err: any) {
      res.status(500).json({ message: `Internal server error` });
      console.log(`Error from products delete route: `, err);
    }
  }
);

// display route

router.get('/', async (req, res) => {
  res.json(
    await findAllModels(
      Product,
      ['id', 'title', 'price'],
      [
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
      ]
    )
  );
});

export default router;
