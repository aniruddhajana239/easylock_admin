import * as yup from 'yup';

const validFileExtensions = ['jpg', 'png', 'jpeg'];
export const retailerSchema = yup.object({
  fullName: yup
    .string()
    .required('Please enter your full name')
    .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  email: yup
    .string()
    .required('Please enter your email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'),
  contactNo: yup
    .string()
    .required('Please enter your contact number')
    .matches(/^\d{10}$/, 'Contact number must be exactly 10 digits'),
  gender: yup
    .string()
    .required('Please select your gender')
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),
  address: yup
    .string()
    .required('Please enter your address')
    .min(10, 'Address must be at least 10 characters long'),
  country: yup
    .string()
    .required('Please select your country'),
  city: yup
    .string()
    .required('Please enter your city'),
  state: yup
    .string()
    .required('Please enter your state'),
  pinCode: yup
    .string()
    .required('Please enter your pin code')
    .matches(/^\d{6}$/, 'Pin code must be exactly 6 digits'),
  profilePic: yup.mixed()
    .test("fileType", "Unsupported file type", (value) => {
      // If no file is provided, validation passes (optional field)
      if (!value || !value.name) return true;
      
      const extension = value.name.split('.').pop().toLowerCase();
      return validFileExtensions.includes(extension);
    })
    .nullable(), // This allows null values
  // password: yup
  //   .string()
  //   .required('Please enter your password')
  //   .min(8, 'Password must be at least 8 characters long'),
  // confirmPassword: yup
  //   .string()
  //   .required('Please confirm your password')
  //   .oneOf([yup.ref('password')], 'Passwords must match'),
  // referralId: yup
  //   .string()
  //   .optional()
  //   .matches(/^[a-zA-Z0-9]+$/, 'Referral ID must be alphanumeric'),
  businessName: yup
    .string()
    .required('Please enter your business name')
    .matches(/^[a-zA-Z0-9\s]+$/, 'Business name can only contain letters, numbers, and spaces'),
});

