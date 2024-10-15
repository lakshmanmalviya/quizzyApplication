import { getPageObject } from '@/services/CommonServices';
import { Category, CreateSuccess, DeleteSuccess, PageResponse, UpdateSuccess } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryState {
    category: Category;
    categoryLoading: boolean;
    categoryError: string | null;
    categoryMessage: string | null;
    categories: PageResponse<Category>;
}

const initialState: CategoryState = {
    category: {
        id: 0,
        name: '',
        description: '',
        categoryPic: '/addPic.png',
    },
    categoryLoading: false,
    categoryError: null,
    categoryMessage: null,
    categories: getPageObject(),
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {

        createCategoryRequest(state, action: PayloadAction<Category>) {
            state.categoryLoading = true;
            state.categoryError = null;
        },
        createCategorySuccess(state, action: PayloadAction<CreateSuccess<Category>>) {
            state.categoryLoading = false;
            state.categoryError = null;
            state.categoryMessage = action.payload.msg;
            state.categories.content.unshift({
                ...action.payload.data,
                quizzes: [],
            });
        },
        createCategoryFailure(state, action: PayloadAction<string>) {
            state.categoryLoading = false;
            state.categoryError = action.payload;
            state.categoryMessage = null;
        },
        createCategoryPopupReset(state) {
            state.categoryMessage = null;
            state.categoryError = null;
        },
        fetchCategoriesRequest(state, action: PayloadAction<string>) {
            state.categoryLoading = true;
            state.categoryError = null;
        },
        fetchCategoriesSuccess(state, action: PayloadAction<PageResponse<Category>>) {
            state.categoryLoading = false;
            state.categoryError = null;
            state.categories = action.payload;
        },
        fetchCategoriesFailure(state, action: PayloadAction<string>) {
            state.categoryLoading = false;
            state.categoryError = action.payload;
        },
        deleteCategoryRequest(state, action: PayloadAction<number>) {
            state.categoryLoading = true;
            state.categoryError = null;
        },
        deleteCategorySuccess(state, action: PayloadAction<DeleteSuccess>) {
            state.categoryLoading = false;
            state.categoryError = null;
            state.categoryMessage = action.payload.msg;
            state.categories.content = state.categories.content.filter((category: Category) => category.id != action.payload.id)
        },
        deleteCategoryFailure(state, action: PayloadAction<string>) {
            state.categoryLoading = false;
            state.categoryError = action.payload;
        },
        updateCategoryRequest(state, action: PayloadAction<Category>) {
            state.categoryLoading = true;
            state.categoryError = null;
        },
        updateCategorySuccess(state, action: PayloadAction<UpdateSuccess<Category>>) {
            state.categoryLoading = false;
            state.categoryError = null;
            state.categoryMessage = action.payload.msg;
            const index = state.categories.content.findIndex((category: Category) => category.id === action.payload.data.id);
            if (index !== -1) {
                state.categories.content[index] = { ...state.categories.content[index], ...action.payload.data };
            }
        },
        updateCategoryFailure(state, action: PayloadAction<string>) {
            state.categoryLoading = false;
            state.categoryError = action.payload;
        },
    },
});

export const {
    createCategoryRequest,
    createCategorySuccess,
    createCategoryFailure,
    createCategoryPopupReset,
    fetchCategoriesRequest,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    deleteCategoryRequest,
    deleteCategorySuccess,
    deleteCategoryFailure,
    updateCategoryRequest,
    updateCategorySuccess,
    updateCategoryFailure,
} = categorySlice.actions;

export default categorySlice.reducer;
