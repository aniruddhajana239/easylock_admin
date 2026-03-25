import * as yup from 'yup';

export const OTPSchema = yup.object().shape({
    email: yup.string().email("Format d'e-mail invalide").required("L'e-mail est requis"),
});
export const forgetPassSchema = yup.object().shape({
    email: yup.string().email("Format d'e-mail invalide").required("L'e-mail est requis"),
    otp: yup.string().when('showOtpInput', {
        is: true,
        then: yup.string().length(4, 'OTP doit être composé de 4 chiffres').required('Veuillez entrer OTP'),
    }),
    newPassword: yup.string().when('showOtpInput', {
        is: true,
        then: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Un nouveau mot de passe est requis'),
    }),
    confirmPassword: yup.string().when('showOtpInput', {
        is: true,
        then: yup.string()
            .oneOf([yup.ref('newPassword'), null], 'Le mot de passe ne correspond pas')
            .required('Veuillez saisir le mot de passe confirmé'),
    }),
});