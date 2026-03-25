import { call, put, takeLatest } from "redux-saga/effects";
import { SuperDistributorAPI } from "../../../api/superDistributor/SuperDistributor";
import { superDistributorActions } from "../../reducers/superDistributor/SuperDistributorSlice";
function* add(action) {
  try {
    const response = yield call(SuperDistributorAPI.add, action.payload);
    yield put(superDistributorActions.success(response?.data));
  } catch (error) {
    yield put(
      superDistributorActions.failed(
        error?.response?.data ? error?.response?.data : error?.message
      )
    );
  }
}

function* getAll(action) {
  try {
    const response = yield call(SuperDistributorAPI.getAll, action.payload);
    yield put(superDistributorActions.success(response?.data));
  } catch (error) {
    yield put(
      superDistributorActions.failed(
        error?.response?.data ? error.response.data : error.message
      )
    );
  }
}

function* singleGet(action) {
  try {
    const distributorId = action?.payload;
    const response = yield call(SuperDistributorAPI.singleGet, distributorId);
    yield put(superDistributorActions.success(response?.data));
  } catch (error) {
    yield put(
      superDistributorActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* getSuperDistributorProfile() {
  try {
    const response = yield call(SuperDistributorAPI.getSuperDistributorProfile);
    yield put(superDistributorActions.success(response?.data));
  } catch (error) {
    yield put(
      superDistributorActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* addToken(action) {
  try {
    const response = yield call(SuperDistributorAPI.addToken, action.payload);
    yield put(superDistributorActions.success(response?.data));
  } catch (error) {
    yield put(
      superDistributorActions.failed(
        error?.response?.data ? error?.response?.data : error?.message
      )
    );
  }
}

function* search(action) {
  try {
    const response = yield call(SuperDistributorAPI.search, action.payload);
    yield put(superDistributorActions.success(response?.data));
  } catch (error) {
    yield put(superDistributorActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* updateStatus(action) {
  try {
    const response = yield call(SuperDistributorAPI.updateStatus, action.payload);
    yield put(superDistributorActions.success(response));
  } catch (error) {
    yield put(superDistributorActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* updateAccountStatus(action) {
  try {
    const response = yield call(SuperDistributorAPI.updateAccountStatus, action.payload);
    yield put(superDistributorActions.success(response));
  } catch (error) {
    yield put(superDistributorActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* updatePasswordByAdmin(action) {
  try {
    const response = yield call(SuperDistributorAPI.updatePasswordByAdmin, action.payload);
    yield put(superDistributorActions.success(response));
  } catch (error) {
    yield put(superDistributorActions.failed(error.response.data ? error.response.data : error.message));
  }
}
export default function* superDistributorSaga() {
  yield takeLatest(superDistributorActions.add.type, add);
  yield takeLatest(superDistributorActions.getAll.type, getAll);
  yield takeLatest(superDistributorActions.singleGet.type, singleGet);
  yield takeLatest(superDistributorActions.addToken.type, addToken);
  yield takeLatest(superDistributorActions.Search.type, search);
  yield takeLatest(superDistributorActions.updateStatus.type, updateStatus);
  yield takeLatest(superDistributorActions.updateAccountStatus.type, updateAccountStatus);
  yield takeLatest(superDistributorActions.getSuperDistributorProfile.type, getSuperDistributorProfile);
  yield takeLatest(superDistributorActions.updatePasswordByAdmin.type, updatePasswordByAdmin);
}
