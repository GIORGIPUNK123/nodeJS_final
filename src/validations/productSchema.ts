import * as yup from 'yup';
import Product from '../database/seqModels/productsModel';
import User from '../database/seqModels/userModel';
export const productCreateSchema = yup.object().shape({
  title: yup
    .string()
    .required('Product title is required')
    .test(
      `test if title doesn't exist`,
      `Title already exists in the database for this user please use different title`,
      (title: string, context: any) => {
        const { userId } = context.options.context;
        return Product.findAll({
          where: {
            is_deleted: false,
            user_id: userId,
            title: title,
          },
        }).then((data) => {
          if (data.length === 0) {
            return true;
          } else return false;
        });
      }
    ),
  price: yup.number().required('Product price is required').min(5),
  type: yup
    .string()
    .oneOf(['pullover', 'jeans', 'jacket', 'hoodie'])
    .required('Product type is required'),
  condition: yup
    .string()
    .oneOf(['new', 'old'])
    .required(`Product condition is required`),
  size: yup
    .string()
    .oneOf(['xs', 's', 'm', 'xl', 'xll', 'xxl'])
    .required('Product size is required'),
});

export const productDeleteSchema = yup.object().shape({
  productId: yup
    .number()
    .required(`ID is required`)
    .test(
      'delete-product',
      'Product is invalid',
      async (id: number, context: any) => {
        try {
          const { userId } = context.options.context;
          const data = await Product.findOne({
            where: { id: id, is_deleted: false },
          });
          if (!data) {
            throw new Error('Product not found');
          }
          if (data.dataValues.user_id !== userId) {
            const user = await User.findOne({ where: { id: userId } });
            if (!user?.dataValues.is_admin) {
              throw new Error(
                "You can't delete other user's products unless you are admin"
              );
            }
          }
          if (data.dataValues.is_deleted) {
            throw new Error('Product is already deleted');
          }
          return true;
        } catch (error: any) {
          throw new yup.ValidationError(error.message);
        }
      }
    ),
});

export const productBuySchema = yup.object().shape({
  productId: yup
    .number()
    .required(`ID is required`)
    .test(
      `Test if id exists`,
      `Product doesn't exist in the database`,
      async (id: number, context: any) => {
        const { userId } = context.options.context;
        try {
          const user = await User.findOne({
            where: {
              id: userId,
            },
          });
          const product = await Product.findOne({
            where: {
              id: id,
            },
          });
          if (product !== null && product !== undefined) {
            if (user!.dataValues.balance <= product!.dataValues.price) {
              throw new Error('Not enough balance');
            }
            if (userId === product!.dataValues.user_id) {
              throw new Error(`Can't buy a product from yourself`);
            }
          } else {
            throw new Error(`Product doesn't exist`);
          }
          return true;
        } catch (error: any) {
          throw new yup.ValidationError(error.message);
        }
      }
    ),
});
