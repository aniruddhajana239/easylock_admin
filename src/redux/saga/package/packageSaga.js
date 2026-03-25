import { call, put, takeLatest } from "redux-saga/effects";
import { packageApi } from "../../../api/package/packageApi";
import { packageActions } from "../../reducers/package/packageSlice";

function* getAll(action) {
    try {
        const response = yield call(packageApi.getAll, action.payload);
        yield put(packageActions.success(response.data));
    } catch (error) {
        yield put(packageActions.failed(error?.response?.data ?? error.message));
    }
}
export default function* packageSaga() {
    yield takeLatest(packageActions.getAll.type, getAll);
}
