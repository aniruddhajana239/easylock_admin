import { call, put, takeLatest } from "redux-saga/effects";
import { PendingAndRejectRetailerApi } from "../../../../api/retailer/pendingAndReject/PendingAndRejectRetailerApi";
import { pendingAndRejectRetailerActions } from "../../../reducers/retailer/pendingAndRejected/PendingAndRejectedSlice";


function* getAll(action) {
  try {
    const response = yield call(PendingAndRejectRetailerApi.pendingAndRejectGetAll, action.payload);
    yield put(pendingAndRejectRetailerActions.success(response?.data));
  } catch (error) {
    yield put(
      pendingAndRejectRetailerActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* search(action) {
  try {
    const response = yield call(PendingAndRejectRetailerApi.search, action.payload);
    yield put(pendingAndRejectRetailerActions.success(response?.data));
  } catch (error) {
    yield put(pendingAndRejectRetailerActions.failed(error.response.data ? error.response.data : error.message));
  }
}
export default function* PendingAndRejectRetailerSaga() {
  yield takeLatest(pendingAndRejectRetailerActions.getAll.type, getAll);
  yield takeLatest(pendingAndRejectRetailerActions.Search.type, search);
}
