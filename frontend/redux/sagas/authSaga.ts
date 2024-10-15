import { QuizAppBaseUrl } from '@/pages/_app';
import {
    loginFailure, loginRequest,
    loginSuccess,
} from '@/redux/slices/authSlice';
import { getPublicHeader } from '@/services/CommonServices';
import { AuthResponse, UnifiedResponse } from '@/types/types';
import { call, put, takeLatest } from 'redux-saga/effects';
import { apiCall } from '../hooks';

const getAuthUrl = (path: string) => `${QuizAppBaseUrl}/api/auth/${path}`;

function* handleLogin(action: ReturnType<typeof loginRequest>) {
    try {
        const response: UnifiedResponse<AuthResponse> = yield call(apiCall, getAuthUrl('login'), 'POST', getPublicHeader(), action.payload);
        yield put(loginSuccess(response.data));
    } catch (error) {
        yield put(loginFailure((error as Error).message));
    }
}

export function* watchAuthSaga() {
    yield takeLatest(loginRequest.type, handleLogin);
}
