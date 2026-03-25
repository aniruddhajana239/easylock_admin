import { call, put, takeLatest } from "redux-saga/effects";
import { RetailerApi } from "../../../api/retailer/RetailerApi";
import { retailerActions } from "../../reducers/retailer/RetailerSlice";
import { KeysApi } from "../../../api/keys/KeysApi";

function* add(action) {
  try {
    const response = yield call(RetailerApi.add, action.payload);
    yield put(retailerActions.success(response?.data));
  } catch (error) {
    yield put(
      retailerActions.failed(
        error?.response?.data ? error?.response?.data : error?.message
      )
    );
  }
}

function* getAll(action) {
  try {
    const response = yield call(RetailerApi.getAll, action.payload);
    yield put(retailerActions.success(response?.data));
  } catch (error) {
    yield put(
      retailerActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* getByDistributor(action) {
  try {
    const response = yield call(RetailerApi.getByDistributorId, action.payload);
    yield put(retailerActions.success(response?.data));
  } catch (error) {
    yield put(
      retailerActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* singleGet(action) {
  try {
    const retailerId=action?.payload;
    const response = yield call(RetailerApi.singleGet,retailerId);
    yield put(retailerActions.success(response?.data));
  } catch (error) {
    yield put(
      retailerActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* addToken(action) {
  try {
    const response = yield call(KeysApi.addRetailerToken, action.payload);
    yield put(retailerActions.success(response?.data));
  } catch (error) {
    yield put(
      retailerActions.failed(
        error?.response?.data ? error?.response?.data : error?.message
      )
    );
  }
}
function* updateStatus(action) {
  try {
    const response = yield call(retailerActions.updateStatus, action.payload);
    yield put(retailerActions.success(response));
  } catch (error) {
    yield put(retailerActions.failed(error.response.data ? error.response.data : error.message));
  }
}

function* updateAccountStatus(action) {
  try {

    const response = yield call(RetailerApi.updateAccountStatus, action.payload);
    yield put(retailerActions.success(response));
  } catch (error) {
    yield put(retailerActions.failed(error.response.data ? error.response.data : error.message));
  }
}

function* search(action) {
  try {
    
    const response = yield call(RetailerApi.search, action.payload);
    yield put(retailerActions.success(response?.data));
  
  } catch (error) {
    yield put(retailerActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* updatePasswordByAdmin(action) {
  try {
    const response = yield call(RetailerApi.updatePasswordByAdmin, action.payload);
    yield put(retailerActions.success(response));
  } catch (error) {
    yield put(retailerActions.failed(error.response.data ? error.response.data : error.message));
  }
}
export default function* RetailerSaga() {
  yield takeLatest(retailerActions.add.type, add);
  yield takeLatest(retailerActions.getAll.type, getAll);
  yield takeLatest(retailerActions.getByDistributorId.type, getByDistributor);
  yield takeLatest(retailerActions.singleGet.type, singleGet);
  yield takeLatest(retailerActions.addToken.type, addToken);
  yield takeLatest(retailerActions.Search.type, search);
  yield takeLatest(retailerActions.updateStatus.type, updateStatus);
  yield takeLatest(retailerActions.updateAccountStatus.type, updateAccountStatus);
  yield takeLatest(retailerActions.updatePasswordByAdmin.type, updatePasswordByAdmin);
}
