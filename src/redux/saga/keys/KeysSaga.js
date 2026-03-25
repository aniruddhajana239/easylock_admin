import { call, put, takeLatest } from "redux-saga/effects";
import { KeysApi } from "../../../api/keys/KeysApi";
import { keysActions } from "../../reducers/keys/KeysSlice";
import { tokenSummaryActions } from "../../reducers/keys/TokenSummary";

function* getallHistory(action) {
  try {
    const response = yield call(KeysApi.getAll, action.payload);
    yield put(keysActions.success(response?.data));
  } catch (error) {
    yield put(
      keysActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* getAllForSuperDistributor(action) {
  try {
    const response = yield call(KeysApi.getAllForSuperDistributor, action.payload);
    yield put(keysActions.success(response?.data));
  } catch (error) {
    yield put(
      keysActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* getAllForDistributorAndRetailer(action) {
  try {
    const response = yield call(KeysApi.getAllForDistributorAndRetailer, action.payload);
    yield put(keysActions.success(response?.data));
  } catch (error) {
    yield put(
      keysActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* addRetailerToken(action) {
  try {
    const response = yield call(KeysApi.addRetailerToken, action.payload);
    yield put(keysActions.success(response?.data));
  } catch (error) {
    yield put(
      keysActions.failed(
        error?.response?.data ? error?.response?.data : error?.message
      )
    );
  }
}

function* addDistributorToken(action) {
  try {
    const response = yield call(KeysApi.addDistributorToken, action.payload);
    yield put(keysActions.success(response?.data));
  } catch (error) {
    yield put(
      keysActions.failed(
        error?.response?.data ? error?.response?.data : error?.message
      )
    );
  }
}
function* addSuperDistributorToken(action) {
  try {
    const response = yield call(KeysApi.addSuperDistributorToken, action.payload);
    yield put(keysActions.success(response?.data));
  } catch (error) {
    yield put(
      keysActions.failed(
        error?.response?.data ? error?.response?.data : error?.message
      )
    );
  }
}
function* search(action) {
  try {
    const response = yield call(KeysApi.search, action.payload);
    yield put(keysActions.success(response?.data));
  } catch (error) {
    yield put(keysActions.failed(error.response.data ? error.response.data : error.message));
  }
}
function* getTokenSummary(action) {
  try {
    const response = yield call(KeysApi.tokenSummary, action.payload);
    yield put(tokenSummaryActions.success(response?.data));
  } catch (error) {
    yield put(
      tokenSummaryActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
export default function* keysSaga() {
  yield takeLatest(keysActions.getallHistory.type, getallHistory);
  yield takeLatest(keysActions.addRetailerToken.type, addRetailerToken);
  yield takeLatest(keysActions.addDistributorToken.type, addDistributorToken);
  yield takeLatest(keysActions.addSuperDistributorToken.type, addSuperDistributorToken);  
  yield takeLatest(keysActions.getAllForDistributorAndRetailer.type, getAllForDistributorAndRetailer);
  yield takeLatest(keysActions.Search.type, search);
  yield takeLatest(keysActions.getAllForSuperDistributor.type, getAllForSuperDistributor);
  yield takeLatest(tokenSummaryActions.getAll.type, getTokenSummary);
}
