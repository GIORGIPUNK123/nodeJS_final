import * as yup from 'yup';
import Product from '../database/seqModels/productsModel';
import User from '../database/seqModels/usersModel';
export const productCreateSchema = yup.object().shape({
  body: yup.object().shape({
    title: yup.string().required('Product title is required'),
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
  }),
});
import { ValidationError } from 'yup';

export const productEditSchema = yup
  .object()
  .shape({
    paramsId: yup.number().required(`ID is required`),
    body: yup.object().shape({
      title: yup.string(),
      price: yup.number().positive(),
      type: yup.string().oneOf(['pullover', 'jeans', 'jacket', 'hoodie']),
      condition: yup.string().oneOf(['new', 'used']),
      size: yup.string().oneOf(['xs', 's', 'm', 'xl', 'xll', 'xxl']),
    }),
  })
  .test('at-least-one', `At least one value is required`, function (value) {
    const { title, price, type, condition, size } = value.body;
    if (!title && !price && !type && !condition && !size) {
      throw new ValidationError(
        `At least one value is required`,
        value,
        'body'
      );
    }
    return true;
  });
export const productDeleteSchema = yup.object().shape({
  paramsId: yup.number().required(`ID is required`),
});

export const productBuySchema = yup.object().shape({
  body: yup.object().shape({
    productId: yup.number().required(`Product ID is required to buy product`),
  }),
});
