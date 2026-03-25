import { call, put, takeLatest } from "redux-saga/effects";
import { profileApi } from "../../../api/profile/profileApi";
import { profileActions } from "../../reducers/profile/ProfileSlice";
function* getUserData(action) {
    try {
      const response = yield call(profileApi.profileGet, action?.payload);
      yield put(profileActions.success(response?.data));
    } catch (error) {
      yield put(
        profileActions.failed(
          error.response.data ? error.response.data : error.message
        )
      );
    }
  }
  function* updateProfile(action) {
    try {
        const response = yield call(profileApi.update_profile, action.payload);
        yield put(profileActions.success(response));
    } catch (error) {
        yield put(profileActions.failed(error.response.data ? error.response.data : error.message));
    }
}
export default function* profileSaga() {
    yield takeLatest(profileActions.getUserData.type, getUserData);
    yield takeLatest(profileActions.update_profile.type,updateProfile);
}
