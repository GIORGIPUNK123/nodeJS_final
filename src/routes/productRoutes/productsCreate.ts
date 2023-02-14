import express, { Request, Response } from 'express';
import ProductCondition from '../../database/seqModels/productConditionsModel';
import ProductSize from '../../database/seqModels/productSizesModel';
import Product from '../../database/seqModels/productsModel';
import ProductType from '../../database/seqModels/productTypesModel';
import User from '../../database/seqModels/userModel';
const router = express.Router();

interface CustomRequest extends Request {
  userId?: number;
}
router.post('/', async (req: CustomRequest, res) => {
  const { title, price, type, condition, size } = req.body;

  const conditionRecord = await ProductCondition.findOne({
    where: { condition },
  });
  const typeRecord = await ProductType.findOne({
    where: { type },
  });
  const sizeRecord = await ProductSize.findOne({
    where: { size },
  });
  console.log('conditionRecord: ', conditionRecord?.dataValues.id);
  console.log('typeRecord: ', typeRecord?.dataValues.id);
  console.log('sizeRecord: ', sizeRecord?.dataValues.id);

  console.log('req.userId: ', req.userId);
  // Product.create({
  //   user_id: req.userId,
  //   title: req.body.title,
  //   price: req.body.price,
  //   type_id: typeRecord!.dataValues.id,
  //   condition_id: conditionRecord!.dataValues.id,
  //   size_id: sizeRecord!.dataValues.id,
  // });
  res.status(200).send(
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
