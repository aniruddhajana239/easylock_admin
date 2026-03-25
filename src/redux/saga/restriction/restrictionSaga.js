import { call, put, takeLatest } from "redux-saga/effects";
import { restrictionApi } from "../../../api/restriction/restrictionApi";
import { restrictionActions } from "../../reducers/restriction/restrictionSlice";
import { restrictionUpdateActions } from "../../reducers/restriction/restrictionUpdateSlice";

function* getAll(action) {
    try {
        const response = yield call(restrictionApi.getAll, action.payload);
        yield put(restrictionActions.success(response.data));
    } catch (error) {
        yield put(restrictionActions.failed(error?.response?.data ?? error.message));
    }
}
function* update(action) {
    try {
        const response = yield call(restrictionApi.updateStatus, action.payload);
        yield put(restrictionUpdateActions.success(response.data));
    } catch (error) {
        yield put(restrictionUpdateActions.failed(error?.response?.data ?? error.message));
    }
}
export default function* restrictionSaga() {
    yield takeLatest(restrictionActions.getAll.type, getAll);
    yield takeLatest(restrictionUpdateActions.update.type, update);
}
