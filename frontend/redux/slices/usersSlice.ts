import { getPageObject } from '@/services/CommonServices';
import { AdminProfileData, CreateSuccess, DeleteSuccess, EducatorProfileData, PageResponse, Role, UpdateSuccess, User } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    user: User;
    userLoading: boolean;
    userError: string | null;
    userMessage: string | null;
    educatorProfileData: EducatorProfileData;
    adminProfileData: AdminProfileData;
    users: PageResponse<User>;
}

const initialState: UserState = {
    user: {
        id: 0,
        email: '',
        name: '',
        password: '',
        profilePic: '',
        role: Role.STUDENT,
        isActive: true,
        bio: '',
        education: '',
        isApproved: false,
    },
    userLoading: false,
    userError: null,
    userMessage: null,
    educatorProfileData: {
        totalQuiz: 0,
        totalQuestion: 0,
    },
    adminProfileData: {
        totalCategory: 0,
        totalUser: 0,
    },
    users: getPageObject(),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUserStateOnLogout: (state) => initialState,

        resetUserMessage: (state) => {
            state.userMessage = null;
            state.userError = null;
        },
        createUserRequest: (state, action: PayloadAction<User>) => {
            state.userLoading = true;
            state.userError = null;
            state.userMessage = null;
        },
        createUserFailure: (state, action: PayloadAction<string>) => {
            state.userLoading = false;
            state.userError = action.payload;
            state.userMessage = null;
        },
        createUserSuccess: (state, action: PayloadAction<CreateSuccess<User>>) => {
            state.userLoading = false;
            state.user = action.payload.data;
            state.userError = null;
            state.userMessage = action.payload.msg;
            state.users.content.unshift(action.payload.data);
        },
        fetchUserRequest: (state) => {
            state.userLoading = true;
            state.userError = null;
            state.userMessage = null;
        },
        fetchUserSuccess: (state, action: PayloadAction<User>) => {
            state.userLoading = false;
            state.user = action.payload;
            state.userError = null;
        },
        fetchUserFailure: (state, action: PayloadAction<string>) => {
            state.userLoading = false;
            state.userError = action.payload;
            state.userMessage = null;
        },
        fetchUsersRequest: (state, action: PayloadAction<string>) => {
            state.userLoading = true;
            state.userError = null;
        },
        fetchUsersSuccess: (state, action: PayloadAction<PageResponse<User>>) => {
            state.userLoading = false;
            state.users = action.payload;
            state.userError = null;
        },
        fetchUsersFailure: (state, action: PayloadAction<string>) => {
            state.userLoading = false;
            state.userError = action.payload;
            state.userMessage = null;
        },
        deleteUserRequest: (state, action: PayloadAction<number>) => {
            state.userLoading = true;
            state.userError = null;
        },
        deleteUserSuccess: (state, action: PayloadAction<DeleteSuccess>) => {
            state.userLoading = false;
            state.userError = action.payload.msg;
            state.users.content = state.users.content.filter((user: User) => user.id != action.payload.id)
        },
        deleteUserFailure: (state, action: PayloadAction<string>) => {
            state.userLoading = false;
            state.userError = action.payload;
            state.userMessage = null;
        },
        updateUserRequest: (state, action: PayloadAction<User>) => {
            state.userLoading = true;
            state.userError = null;
            state.userMessage = null;
        },
        updateUserSuccess: (state, action: PayloadAction<UpdateSuccess<User>>) => {
            state.userLoading = false;
            state.user = action.payload.data;
            state.userError = null;
            state.userMessage = action.payload.msg;
            state.users.content = state.users.content.map((user: User) => {
                if (user.id !== action.payload.data.id) { return user; }
                else { return { ...user, ...action.payload.data, }; }
            });
        },
        updateUserFailure: (state, action: PayloadAction<string>) => {
            state.userLoading = false;
            state.userError = action.payload;
            state.userMessage = null;
        },
        fetchEducatorProfileDataRequest: (state) => {
            state.userLoading = true;
            state.userError = null;
        },
        fetchEducatorProfileDataSuccess: (state, action: PayloadAction<EducatorProfileData>) => {
            state.userLoading = false;
            state.educatorProfileData = action.payload;
            state.userError = null;
        },
        fetchEducatorProfileDataFailure: (state, action: PayloadAction<string>) => {
            state.userLoading = false;
            state.userError = action.payload;
        },
        fetchAdminProfileDataRequest: (state) => {
            state.userLoading = true;
            state.userError = null;
        },
        fetchAdminProfileDataSuccess: (state, action: PayloadAction<AdminProfileData>) => {
            state.userLoading = false;
            state.adminProfileData = action.payload;
            state.userError = null;
        },
        fetchAdminProfileDataFailure: (state, action: PayloadAction<string>) => {
            state.userLoading = false;
            state.userError = action.payload;
        },
    },
});

export const {
    fetchUserRequest,
    fetchUserSuccess,
    fetchUserFailure,
    updateUserRequest,
    updateUserSuccess,
    updateUserFailure,
    fetchUsersRequest,
    fetchEducatorProfileDataRequest,
    fetchEducatorProfileDataFailure,
    fetchEducatorProfileDataSuccess,
    fetchAdminProfileDataRequest,
    fetchAdminProfileDataFailure,
    fetchAdminProfileDataSuccess,
    fetchUsersSuccess,
    fetchUsersFailure,
    resetUserMessage,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFailure,
    createUserRequest,
    createUserSuccess,
    createUserFailure,
    resetUserStateOnLogout,
} = userSlice.actions;

export default userSlice.reducer;
