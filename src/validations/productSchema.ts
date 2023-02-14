import * as yup from 'yup';
import Product from '../database/seqModels/productsModel';
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
  title: yup
    .string()
    .required('Product title is required')
    .test(
      `test if title doesn't exist`,
      `Title doesn't exist in the database`,
      (title: string) =>
        Product.findOne({ where: { title } }).then((data) =>
          data === null ? true : false
        )
    ),
});
