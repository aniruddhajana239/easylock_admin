import { call, put, takeLatest } from "redux-saga/effects";
import { GroupApi } from "../../../api/groups/groupApi";
import { groupsActions } from "../../reducers/groups/groupSlice";
function* getAll(action) {
    try {
        const response = yield call(GroupApi.getAll, action.payload);
        yield put(groupsActions.success(response?.data));
    } catch (error) {
        yield put(
            groupsActions.failed(
                error.response.data ? error.response.data : error.message
            )
        );
    }
}
export default function* groupSaga() {
    yield takeLatest(groupsActions.getGroups.type, getAll);
}
