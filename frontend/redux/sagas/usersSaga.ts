import { QuizAppBaseUrl } from '@/pages/_app';
import {
    createUserFailure,
    createUserRequest,
    createUserSuccess,
    deleteUserFailure,
    deleteUserRequest,
    deleteUserSuccess,
    fetchAdminProfileDataFailure,
    fetchAdminProfileDataRequest,
    fetchAdminProfileDataSuccess,
    fetchEducatorProfileDataFailure, fetchEducatorProfileDataRequest, fetchEducatorProfileDataSuccess,
    fetchUserFailure, fetchUserRequest, fetchUsersFailure, fetchUsersRequest, fetchUsersSuccess, fetchUserSuccess,
    updateUserFailure, updateUserRequest, updateUserSuccess
} from '@/redux/slices/usersSlice';
import { getAuthenticatedHeader, getPublicHeader } from '@/services/CommonServices';
import { AdminProfileData, EducatorProfileData, PageResponse, UnifiedResponse, User } from '@/types/types';
import { call, put, takeLatest } from 'redux-saga/effects';
import { apiCall } from '../hooks';

const getBaseUrl = () => `${QuizAppBaseUrl}/users`;
const getUserUrl = () => `${QuizAppBaseUrl}/users/currentUser`;
const getEducatorProfileUrl = () => `${QuizAppBaseUrl}/users/educatorProfileData`;
const getAdminProfileUrl = () => `${QuizAppBaseUrl}/users/adminProfileData`;
const getAuthUrl = (path: string) => `${QuizAppBaseUrl}/api/auth/${path}`;


function* handleCreateUser(action: ReturnType<typeof createUserRequest>) {
    try {
        const response: UnifiedResponse<User> = yield call(apiCall, getAuthUrl('register'), 'POST', getPublicHeader(), action.payload);
        yield put(createUserSuccess({ data: response.data, msg: response.msg }));
    } catch (error) {
        yield put(createUserFailure((error as Error).message));
    }
}

function* handleFetchUser() {
    try {
        const response: UnifiedResponse<User> = yield call(apiCall, getUserUrl(), 'GET', getAuthenticatedHeader());
        yield put(fetchUserSuccess(response.data));
    } catch (error) {
        yield put(fetchUserFailure((error as Error).message));
    }
}

function* handleFetchUsers(action: ReturnType<typeof fetchUsersRequest>) {
    let path = `${getBaseUrl()}/filters?${action.payload}`
    if (action.payload.startsWith("public"))
        path = `${getBaseUrl()}/filters/public?${action.payload.substring(6)}`
    try {
        const response: UnifiedResponse<PageResponse<User>> = yield call(apiCall, path, 'GET',
            path.includes("public") ? getPublicHeader() : getAuthenticatedHeader());
        yield put(fetchUsersSuccess(response.data));
    } catch (error) {
        yield put(fetchUsersFailure((error as Error).message));
    }
}

function* handleUpdateUser(action: ReturnType<typeof updateUserRequest>) {
    try {
        const response: UnifiedResponse<User> = yield call(apiCall, `${getBaseUrl()}/${action.payload.id}`, 'PUT', getAuthenticatedHeader(), action.payload);
        yield put(updateUserSuccess({ data: response.data, msg: response.msg }));
    } catch (error) {
        yield put(updateUserFailure((error as Error).message));
    }
}

function* handleDeleteUser(action: ReturnType<typeof deleteUserRequest>) {
    try {
        const response: UnifiedResponse<number> = yield call(
            apiCall,
            `${getBaseUrl()}/${action.payload}`,
            'DELETE',
            getAuthenticatedHeader()
        );
        yield put(deleteUserSuccess({ id: response.data, msg: response.msg }));
    } catch (error) {
        yield put(deleteUserFailure((error as Error).message));
    }
}


function* handleFetchEducatorProfileData() {
    try {
        const response: UnifiedResponse<EducatorProfileData> = yield call(apiCall, getEducatorProfileUrl(), 'GET', getAuthenticatedHeader());
        yield put(fetchEducatorProfileDataSuccess(response.data));
    } catch (error) {
        yield put(fetchEducatorProfileDataFailure((error as Error).message));
    }
}

function* handleFetchAdminProfileData() {
    try {
        const response: UnifiedResponse<AdminProfileData> = yield call(apiCall, getAdminProfileUrl(), 'GET', getAuthenticatedHeader());
        yield put(fetchAdminProfileDataSuccess(response.data));
    } catch (error) {
        yield put(fetchAdminProfileDataFailure((error as Error).message));
    }
}

export function* watchUsersSaga() {
    yield takeLatest(fetchUserRequest.type, handleFetchUser);
    yield takeLatest(fetchUsersRequest.type, handleFetchUsers);
    yield takeLatest(deleteUserRequest.type, handleDeleteUser);
    yield takeLatest(updateUserRequest.type, handleUpdateUser);
    yield takeLatest(fetchEducatorProfileDataRequest.type, handleFetchEducatorProfileData);
    yield takeLatest(fetchAdminProfileDataRequest.type, handleFetchAdminProfileData);
    yield takeLatest(createUserRequest.type, handleCreateUser);

}
