import { call, put, takeLatest } from "redux-saga/effects";
import { EmiApi } from "../../../api/emi/EmiApi";
import { emiActions } from "../../reducers/emi/EmiSlice";
function* getAll(action) {
  try {
    const response = yield call(EmiApi.getAll, action.payload);
    yield put(emiActions.success(response?.data));
  } catch (error) {
    yield put(
      emiActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* singleGet(action) {
  try {
    const response = yield call(EmiApi.singleGet, action.payload);
    yield put(emiActions.success(response?.data));
  } catch (error) {
    yield put(
      emiActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}

function* search(action) {
  try {
    const response = yield call(EmiApi.search, action.payload);
    yield put(emiActions.success(response?.data));
  } catch (error) {
    yield put(
      emiActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
export default function* emiSaga() {
  yield takeLatest(emiActions.getAll.type, getAll);
  yield takeLatest(emiActions.singleGet.type, singleGet);
  yield takeLatest(emiActions.Search.type, search);
}
