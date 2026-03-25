import { call, put, takeLatest } from "redux-saga/effects";
import { ForgotPasswordApi } from "../../../api/forgotPassword/ForgotPasswordApi";
import { ForgotPasswordActions } from "../../reducers/forgotPassword/ForgotPasswordSlice";

function* sendEmail(action) { 
  try {
    const response = yield call(ForgotPasswordApi.sendEmail, action.payload);
    yield put(ForgotPasswordActions.success(response));
  } catch (error) {
    yield put(ForgotPasswordActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* verifyOtp(action) {
  try {

    const response = yield call(ForgotPasswordApi.verifyOtp, action.payload);
    yield put(ForgotPasswordActions.success(response));
  } catch (error) {
    yield put(ForgotPasswordActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* changePassword(action) {
  try {
    const response = yield call(ForgotPasswordApi.changePassword, action.payload);
    yield put(ForgotPasswordActions.success(response));
  } catch (error) {
    yield put(ForgotPasswordActions.failed(error.response.data ? error.response.data : error.message));
  }
}

export default function* forgotPasswordSaga() {
  yield takeLatest(ForgotPasswordActions.VerifyOtp.type, verifyOtp);
  yield takeLatest(ForgotPasswordActions.forgotPassword.type, changePassword);
  yield takeLatest(ForgotPasswordActions.sendEmail.type, sendEmail);
}
