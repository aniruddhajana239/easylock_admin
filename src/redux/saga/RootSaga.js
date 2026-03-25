import { all } from "redux-saga/effects";
import  distributorSaga  from "./distributor/DistributorSaga";
import authSaga from "./auth/authSaga"
import  RetailerSaga  from "./retailer/RetailerSaga";
import PendingAndRejectRetailerSaga from "./retailer/pendingAndReject/PendingAndRejectRetailerSaga";
import keysSaga from "./keys/KeysSaga";
import customerSaga from "./customer/CustomerSaga";
import deviceSaga from "./device/DeviceSaga";
import profileSaga from "./profile/ProfileSaga";
import forgotPasswordSaga from "./forgotPassword/ForgotPasswordSaga";
import PendingAndRejectDistributorSaga from "./distributor/pendingAndRejected/PendingAndRejectedSaga";
import emiSaga from "./emi/EmiSaga";
import superDistributorSaga from "./superDistributor/SuperDistributorSaga";
import commandSaga from "./command/commandSaga";
import packageSaga from "./package/packageSaga";
import restrictionSaga from "./restriction/restrictionSaga";
import groupSaga from "./groups/groupSaga";
export function* rootSagas() {
    yield all([
        authSaga(),
        distributorSaga(),
        superDistributorSaga(),
        RetailerSaga(),
        PendingAndRejectRetailerSaga(),
        keysSaga(),
        customerSaga(),
        deviceSaga(),
        profileSaga(),
        forgotPasswordSaga(),
        PendingAndRejectDistributorSaga(),
        emiSaga(),
        commandSaga(),
        packageSaga(),
        restrictionSaga(),
        groupSaga()
    ])
}