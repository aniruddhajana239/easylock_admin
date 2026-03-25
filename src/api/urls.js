export const urls = {
  //auth
  LOGIN_URL: "/user/login-by-admin-or-superdistributor",
  REFRESH_LOGIN_URL: "user/refresh-login",
  PROFILE_SINGLE_GET: "/admin/get-admin",
  UPDATE_PROFILE: "/user/update",
  SEND_EMAIL: "/user/forget-password",
  VERIFY_OTP: "/user/verify-otp",
  FORGOT_PASSWORD: "/user/change-password",
  UPDATE_PASSWORD: "/user/update-password",
  //superdistributor
  ADD_SUPERDISTRIBUTOR: "/super-distributor/registration",
  GETALL_SUPERDISTRIBUTOR: "/super-distributor/get-all-super-distributor",
  SINGLE_GET_SUPERDISTRIBUTOR: "/super-distributor/get-super-distributor",
  SUPERDISTRIBUTOR_SEARCH: "/super-distributor/search-all-super-distributor",
  SUPERDISTRIBUTOR_UPDATE_ACCOUNT_STATUS: "/super-distributor/update-account-status",
  //distributor
  ADD_DISTRIBUTOR: "/distributor/registration",
  GETALL_DISTRIBUTOR: "/distributor/get-all-distributor",
  GETALL_PENDING_AND_REJECT_DISTRIBUTOR: "/distributor/get-all-pending-and-reject-distributor",
  SINGLE_GET_DISTRIBUTOR: "/distributor/get-distributor",
  DISTRIBUTOR_REGISTRATION_REQUEST: "/distributor/registration-request",
  DISTRIBUTOR_SEARCH: "/distributor/search-all-distributor",
  PENDING_AND_REJECT_DISTRIBUTOR_SEARCH: "/distributor/search-all-pending-and-reject-distributor",
  DISTRIBUTOR_STATUS_UPDATE: "/distributor/update-status",
  DISTRIBUTOR_UPDATE_ACCOUNT_STATUS: "/distributor/update-account-status",
  //retailer
  ADD_RETAILER: "/retailer/registration",
  GETALL_RETAILER: "/retailer/get-all-retailer",
  SINGLE_GET_RETAILER: "/retailer/get-retailer",
  RETAILER_SEARCH: "/retailer/search-all-retailer",
  RETAILER_STATUS_UPDATE: "/retailer/update-status",
  GETALL_PENDING_AND_REJECT_RETAILER: "/retailer/get-all-pending-and-reject-retailer",
  RETAILER_REGISTRATION_REQUEST: "/retailer/registration-request",
  PENDING_AND_REJECT_RETAILER_SEARCH: "/retailer/search-all-pending-and-reject-retailer",
  RETAILER_UPDATE_ACCOUNT_STATUS: "/retailer/update-account-status",
  //keys
  RETAILER_ADD_TOKEN: "/retailer/add-tokens",
  DISTRIBUTOR_ADD_TOKEN: "/distributor/add-tokens",
  SUPER_DISTRIBUTOR_ADD_TOKEN: "/super-distributor/add-tokens",
  KEY_HISTORY_GETALL: "/token/get-all",
  KEY_REFUND: "/token/taken-back",
  KEY_HISTORY_FOR_DISTRIBUTOR_RETAILER_GETALL: "/token/get-all-details",
  SEARCH_TOKEN_HISTORY: "/token/search-all-details",
  GET_ALL_SUPERDISTRIBUTOR_TOKEN_HISTORY: "/token/get-all-by-super-distributor",
  TOKEN_SUMMARY: "/token/get-token-summary",
  //customer
  GETALL_CUSTOMER: "/customer/get-all-customer",
  SINGLE_GET_CUSTOMER: "/customer/get-customer",
  CUSTOMER_SEARCH: "/customer/search-all-customer",
  //device
  GETALL_DEVICE: "/device/get-all-device",
  SINGLE_GET_DEVICE: "/device/get-device",
  UPDATE_DEVICE_STATUS: "/device/update-device-status",
  DEVICE_SEARCH: "/device/search-all-device",
  GET_DEVICE_BY_IMEI: "/device/single-device-imei",
  //emi
  GETALL_EMI: "/emi/get-all-emi",
  SINGLE_GET_EMI: "/emi/get-emi",
  EMI_SEARCH: "/emi/search-all-emi",
  //For Dashborad
  GET_SALES_SUMMARY: "/device/sales-summary",
  GET_DEVICE_SUMMARY: "/device/all-device-count",
  GET_DISTRIBUTOR_RETAILER_SUMMARY: "/user/dashboard-counts",
  TOKEN_SALES_GRAPH: "/user/monthly-token-sales-graph",

  //for distributor and retailer
  UPDATE_PASSWORD_BY_ADMIN: "user/change-password-by-admin",

  //for app lock
  GET_DEVICE_APP_LOCK_DETAILS: "package/get-by-device",
  UPDATE_APPLOCK_STATUS: "package/update-package-by-device",
  UPDATE_REFERRAL_EMAIL: "/admin/update-referral-email",

  CREATE_OFFER: "/offer/create-offer",
  GETALL_OFFERS: "/offer/get-all-offer",
  DELETE_OFFER: "/offer/delete",
  UPDATE_OFFER: "/offer/update",
  SEND_COMMAND: "/device/send-command",
  PACKAGE_GET_ALL: '/package/get-by-package-name',
  RESTRICTION_GET: "/device/policies",
  RESTRICTION_UPDATE: "/device/policy",
  ACTIVITY_LOG: "/device/get-all-command",

  // for node id
  GET_GROUPS: "/device/get-groups"
}