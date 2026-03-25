import { call, put, takeLatest } from "redux-saga/effects";
import { AuthApi } from "../../../api/auth/AuthApi";
import { authActions } from "../../reducers/auth/authSlice";
import { authPasswordActions } from "../../reducers/auth/authPasswordSlice";

function* login(action) {
    try {
        const response = yield call(AuthApi.login, action.payload);
        yield put(authActions.success(response.data));
    } catch (error) {
           yield put(authActions.failed(error?.response?.data ?? error.message));
    }
}
function* refreshLogin(action) {
    try {
        const response = yield call(AuthApi.refreshLogin, action.payload);
        yield put(authActions.success(response.data));
    } catch (error) {
           yield put(authActions.failed(error?.response?.data ?? error.message));
    }
}
function* getUserData(action) {
    try {
      const response = yield call(AuthApi.profileGet, action?.payload);
      yield put(authActions.success(response?.data));
    } catch (error) {
      yield put(
        authActions.failed(
          error.response.data ? error.response.data : error.message
        )
      );
    }
  }
  function* updatePassword(action) {
    try {
        const response = yield call(AuthApi.update_password, action.payload);
        yield put(authPasswordActions.success(response));
    } catch (error) {
        yield put(authPasswordActions.failed(error?.response?.data ?? error.message));
    }
}
export default function* authSaga() {
    yield takeLatest(authActions.login.type, login);
    yield takeLatest(authActions.refreshLogin.type, refreshLogin);
    yield takeLatest(authActions.getUserData.type, getUserData);
    yield takeLatest(authPasswordActions.updatePassword.type, updatePassword);
}
