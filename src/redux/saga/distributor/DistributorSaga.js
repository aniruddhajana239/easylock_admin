import { call, put, takeLatest } from "redux-saga/effects";
import { DistributorApi } from "../../../api/distributor/DistributorApi";
import { distributorActions } from "../../reducers/distributor/DistributorSlice";
function* add(action) {
  try {
    const response = yield call(DistributorApi.add, action.payload);
    yield put(distributorActions.success(response?.data));
  } catch (error) {
    yield put(
      distributorActions.failed(
        error?.response?.data ? error?.response?.data : error?.message
      )
    );
  }
}

function* getAll(action) {
  try {
    const response = yield call(DistributorApi.getAll, action.payload);
    yield put(distributorActions.success(response?.data));
  } catch (error) {
    yield put(
      distributorActions.failed(
        error?.response?.data ? error.response.data : error.message
      )
    );
  }
}

function* singleGet(action) {
  try {
    const distributorId = action?.payload;
    const response = yield call(DistributorApi.singleGet, distributorId);
    yield put(distributorActions.success(response?.data));
  } catch (error) {
    yield put(
      distributorActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* getDistributorProfile() {
  try {
    const response = yield call(DistributorApi.getDistributorProfile);
    yield put(distributorActions.success(response?.data));
  } catch (error) {
    yield put(
      distributorActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* addToken(action) {
  try {
    const response = yield call(DistributorApi.addToken, action.payload);
    yield put(distributorActions.success(response?.data));
  } catch (error) {
    yield put(
      distributorActions.failed(
        error?.response?.data ? error?.response?.data : error?.message
      )
    );
  }
}

function* search(action) {
  try {
    const response = yield call(DistributorApi.search, action.payload);
    yield put(distributorActions.success(response?.data));
  } catch (error) {
    yield put(distributorActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* updateStatus(action) {
  try {
    const response = yield call(DistributorApi.updateStatus, action.payload);
    yield put(distributorActions.success(response));
  } catch (error) {
    yield put(distributorActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* updateAccountStatus(action) {
  try {
    const response = yield call(DistributorApi.updateAccountStatus, action.payload);
    yield put(distributorActions.success(response));
  } catch (error) {
    yield put(distributorActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* updatePasswordByAdmin(action) {
  try {
    const response = yield call(DistributorApi.updatePasswordByAdmin, action.payload);
    yield put(distributorActions.success(response));
  } catch (error) {
    yield put(distributorActions.failed(error.response.data ? error.response.data : error.message));
  }
}
export default function* distributorSaga() {
  yield takeLatest(distributorActions.add.type, add);
  yield takeLatest(distributorActions.getAll.type, getAll);
  yield takeLatest(distributorActions.singleGet.type, singleGet);
  yield takeLatest(distributorActions.addToken.type, addToken);
  yield takeLatest(distributorActions.Search.type, search);
  yield takeLatest(distributorActions.updateStatus.type, updateStatus);
  yield takeLatest(distributorActions.updateAccountStatus.type, updateAccountStatus);
  yield takeLatest(distributorActions.getDistributorProfile.type, getDistributorProfile);
  yield takeLatest(distributorActions.updatePasswordByAdmin.type, updatePasswordByAdmin);
}
