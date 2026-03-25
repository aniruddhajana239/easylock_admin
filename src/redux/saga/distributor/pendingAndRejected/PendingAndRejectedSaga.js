import { call, put, takeLatest } from "redux-saga/effects";
import { PendingAndRejectDistributorApi } from "../../../../api/distributor/pendingAndReject/PendingAndRejectDistributorApi";
import { pendingAndRejectDistributorActions } from "../../../reducers/distributor/pendingAndRejected/PendingAndRejectedslice";

function* getAll(action) {
  try {
    const response = yield call(PendingAndRejectDistributorApi.pendingAndRejectGetAll, action.payload);
    yield put(pendingAndRejectDistributorActions.success(response?.data));
  } catch (error) {
    yield put(
      pendingAndRejectDistributorActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}

function* search(action) {
  try {
    const response = yield call(PendingAndRejectDistributorApi.search, action.payload);
    yield put(pendingAndRejectDistributorActions.success(response?.data));
  } catch (error) {
    yield put(pendingAndRejectDistributorActions.failed(error.response.data ? error.response.data : error.message));
  }
}
export default function* PendingAndRejectDistributorSaga() {
  yield takeLatest(pendingAndRejectDistributorActions.getAll.type, getAll);
  yield takeLatest(pendingAndRejectDistributorActions.Search.type, search);
}
