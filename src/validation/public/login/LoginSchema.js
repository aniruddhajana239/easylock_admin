import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Please enter your email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'),
  password: yup.string().required('Please enter your password'),
});
