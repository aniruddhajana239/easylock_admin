import { call, put, takeLatest } from "redux-saga/effects";
import { CustomerApi } from "../../../api/customer/CustomerAApi";
import { customerActions } from "../../reducers/customer/CustomerSlice";
function* getAll(action) {
  try {
    const response = yield call(CustomerApi.getAll, action.payload);
    yield put(customerActions.success(response?.data));
  } catch (error) {
    yield put(
      customerActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* singleGet(action) {
  try {
    const distributorId=action?.payload;
    const response = yield call(CustomerApi.singleGet, distributorId);
    yield put(customerActions.success(response?.data));
  } catch (error) {
    yield put(
      customerActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}

function* search(action) {
  try {
    const response = yield call(CustomerApi.search, action.payload);
    yield put(customerActions.success(response?.data));
  } catch (error) {
    yield put(customerActions.failed(error.response.data ? error.response.data : error.message));
  }
}
export default function* customerSaga() {
  yield takeLatest(customerActions.getAll.type, getAll);
  yield takeLatest(customerActions.singleGet.type, singleGet);
  yield takeLatest(customerActions.search.type, search);
}
