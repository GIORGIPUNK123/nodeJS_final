import * as yup from 'yup';
import 'yup-phone-lite';
import User from '../database/seqModels/userModel';
export const registrationSchema = () => {
  return yup.object().shape({
    first_name: yup.string().required('Name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup
      .string()
      .email('Please write correct email')
      .required('Email is required')
      .test(
        'test if email exists',
        'Email already exists in the database',
        (email: string) =>
          User.findOne({ where: { email } }).then((data) =>
            data === null ? true : false
          )
      ),
    phone: yup
      .string()
      .length(9)
      .required('Phone is requiered')
      .test(
        'test if phone exists',
        'Phone already exists in the database',
        (phone: string) =>
          User.findOne({ where: { phone } }).then((data) =>
            data === null ? true : false
          )
      ),
    password: yup.string().min(8).required('Password is required'),
  });
};
export const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});
const findEmail = async (email: string) => User.findOne({ where: { email } });
