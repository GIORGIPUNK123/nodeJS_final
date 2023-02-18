import * as yup from 'yup';
import 'yup-phone-lite';
import User from '../database/seqModels/userModel';
export const registrationSchema = yup.object().shape({
  body: yup.object().shape({
    first_name: yup.string().required('Name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup
      .string()
      .email('Please write correct email')
      .required('Email is required'),
    phone: yup.string().length(9).required('Phone is requiered'),
    password: yup.string().min(8).required('Password is required'),
  }),
});
export const loginSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  }),
});
