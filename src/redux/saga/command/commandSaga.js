import { call, put, takeLatest } from "redux-saga/effects";
import { commandApi } from "../../../api/command/commandApi";
import { commandActions } from "../../reducers/command/commandSlice";
function* sendCommand(action) {
    try {
        const response = yield call(commandApi.sendCommand, action.payload);
        yield put(commandActions.success(response?.data));
    } catch (error) {
        yield put(
            commandActions.failed(
                error.response.data ? error.response.data : error.message
            )
        );
    }
}
export default function* commandSaga() {
    yield takeLatest(commandActions.send.type, sendCommand);
}
