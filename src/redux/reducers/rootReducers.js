import { combineReducers } from "@reduxjs/toolkit";
import { authReducers } from "./auth/authSlice";
import { distributorReducers } from "./distributor/DistributorSlice";
import { retailerReducers } from "./retailer/RetailerSlice";
import { pendingAndRejectRetailerReducers } from "./retailer/pendingAndRejected/PendingAndRejectedSlice";
import { keysReducers } from "./keys/KeysSlice";
import { tokenSummaryReducers } from "./keys/TokenSummary";
import { customerReducers } from "./customer/CustomerSlice";
import { deviceReducers } from "./device/DeviceSlice";
import { profileReducers } from "./profile/ProfileSlice";
import { ForgotPasswordReducers } from "./forgotPassword/ForgotPasswordSlice";
import { pendingAndRejectDistributorReducers } from "./distributor/pendingAndRejected/PendingAndRejectedslice";
import { emiReducers } from "./emi/EmiSlice";
import { superDistributorReducers } from "./superDistributor/SuperDistributorSlice";
import { authPasswordReducers } from "./auth/authPasswordSlice";
import { commandReducers } from "./command/commandSlice";
import { packageReducers } from "./package/packageSlice";
import { restrictionReducers } from "./restriction/restrictionSlice";
import { restrictionUpdateReducers } from "./restriction/restrictionUpdateSlice";
import { activityReducers } from "./activity/activitySlice";
import { groupsReducers } from "./groups/groupSlice";

export const rootReducers = combineReducers({
    auth: authReducers,
    profile: profileReducers,
    distributor: distributorReducers,
    superDistributor: superDistributorReducers,
    retailer: retailerReducers,
    pendingAndRejectRetailer: pendingAndRejectRetailerReducers,
    keys: keysReducers,
    customer: customerReducers,
    device: deviceReducers,
    forgot_password: ForgotPasswordReducers,
    pendingAndRejectDistributor: pendingAndRejectDistributorReducers,
    emi: emiReducers,
    tokenSummary: tokenSummaryReducers,
    auth_password: authPasswordReducers,
    command: commandReducers,
    package: packageReducers,
    restriction:restrictionReducers,
    restriction_update:restrictionUpdateReducers,
    activity:activityReducers,
    groups:groupsReducers
});
