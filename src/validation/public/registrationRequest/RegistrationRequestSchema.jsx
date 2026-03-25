import * as yup from 'yup';

const validFileExtensions = ['jpg', 'png', 'jpeg'];
export const RequestSchema = yup.object({
    fullName: yup
        .string()
        .required('Please enter your full name')
        .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
    email: yup
        .string()
        .required('Please enter your email')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'),
    refferalEmail: yup
        .string()
        .required('Please enter referral email')
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
        .required('Please enter your address'),
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
        .required('Please enter your pin code'),
    profilePic: yup.mixed()
        .test("fileType", "Unsupported file type", (value) => {
            if (!value) return true;
            const extension = value.name.split('.').pop().toLowerCase();
            return validFileExtensions.includes(extension);
        }).required("Please choose a profile picture"),
    businessName: yup
        .string()
        .required('Please enter your business name')
        .matches(/^[a-zA-Z0-9\s]+$/, 'Business name can only contain letters, numbers, and spaces'),

});
