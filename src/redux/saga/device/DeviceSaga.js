import { call, put, takeLatest } from "redux-saga/effects";
import { DeviceApi } from "../../../api/device/DeviceApi";
import { deviceActions } from "../../reducers/device/DeviceSlice";
import { ActivityLogApi } from "../../../api/activity/ActivityLogApi";
import { activityActions } from "../../reducers/activity/activitySlice";
function* getAll(action) {
  try {
    const response = yield call(DeviceApi.getAll, action.payload);
    yield put(deviceActions.success(response?.data));
  } catch (error) {
    yield put(
      deviceActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
function* getAllActivity(action) {
  try {
    const response = yield call(ActivityLogApi.getAll, action.payload);
    yield put(activityActions.success(response));
  } catch (error) {
    yield put(
      activityActions.failed(
        error.response ? error.response : error.message
      )
    );
  }
}
function* singleGet(action) {
  try {
    const response = yield call(DeviceApi.singleGet, action.payload);
    yield put(deviceActions.success(response?.data));
  } catch (error) {
    yield put(
      deviceActions.failed(
        error.response.data ? error.response.data : error.message
      )
    );
  }
}

function* search(action) {
  try {
    const response = yield call(DeviceApi.search, action.payload);
    yield put(deviceActions.success(response?.data));
  } catch (error) {
    yield put(deviceActions.failed(error.response.data ? error.response.data : error.message));
  }
}
export default function* deviceSaga() {
  yield takeLatest(deviceActions.getAll.type, getAll);
  yield takeLatest(activityActions.getAll.type, getAllActivity);
  yield takeLatest(deviceActions.singleGet.type, singleGet);
  yield takeLatest(deviceActions.Search.type, search);
}
