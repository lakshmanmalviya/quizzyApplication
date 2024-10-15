import { getPageObject } from '@/services/CommonServices';
import { CreateSuccess, DeleteSuccess, FetchRequest, PageResponse, Quiz, Severity, UpdateSuccess } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuizState {
    quiz: Quiz;
    quizLoading: boolean;
    quizError: string | null;
    quizMessage: string | null;
    quizzes: PageResponse<Quiz>;
}

const initialState: QuizState = {
    quiz: {
        id: 0,
        title: '',
        description: '',
        quizPic: '/addPic.png',
        categoryId: 0,
        randomizeQuestions: true,
        timeLimit: 0,
        attemptedTimes: 0,
        createdAt: '',
        severity: Severity.BEGINNER,
        pass: 0,
    },
    quizLoading: false,
    quizError: null,
    quizMessage: null,
    quizzes: getPageObject(),
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        resetQuizState(state) {
            state.quizMessage = null;
            state.quizError = null;
        },
        updateQuiz(state, action: PayloadAction<Quiz>) {
            state.quiz = { ...action.payload };
        },
        createQuizRequest(state, action: PayloadAction<Quiz>) {
            state.quizLoading = true;
            state.quizError = null;
            state.quizMessage = null;
        },
        createQuizSuccess(state, action: PayloadAction<CreateSuccess<Quiz>>) {
            state.quizLoading = false;
            state.quizError = null;
            state.quizMessage = action.payload.msg;
            state.quizzes.content.unshift({
                ...action.payload.data,
                questions: [],
                attemptedUserCount: 0,
            });
        },
        createQuizFailure(state, action: PayloadAction<string>) {
            state.quizLoading = false;
            state.quizError = action.payload;
        },
        fetchQuizzesRequest(state, action: PayloadAction<string>) {
            state.quizLoading = true;
            state.quizError = null;
        },
        fetchQuizzesSuccess(state, action: PayloadAction<PageResponse<Quiz>>) {
            state.quizLoading = false;
            state.quizError = null;
            state.quizzes = action.payload;
        },
        fetchQuizzesFailure(state, action: PayloadAction<string>) {
            state.quizLoading = false;
            state.quizError = action.payload;
        },
        deleteQuizRequest(state, action: PayloadAction<number>) {
            state.quizLoading = true;
            state.quizError = null;
            state.quizMessage = null;
        },
        deleteQuizSuccess(state, action: PayloadAction<DeleteSuccess>) {
            state.quizLoading = false;
            state.quizError = null;
            state.quizMessage = action.payload.msg;
            state.quizzes.content = state.quizzes.content.filter((quiz: Quiz) => quiz.id != action.payload.id)
        },
        deleteQuizFailure(state, action: PayloadAction<string>) {
            state.quizLoading = false;
            state.quizError = action.payload;
        },
        updateQuizRequest(state, action: PayloadAction<Quiz>) {
            state.quizLoading = true;
            state.quizError = null;
            state.quizMessage = null;
        },
        updateQuizSuccess(state, action: PayloadAction<UpdateSuccess<Quiz>>) {
            state.quizLoading = false;
            state.quizError = null;
            state.quizMessage = action.payload.msg;
            const index = state.quizzes.content.findIndex((quiz: Quiz) => quiz.id === action.payload.data.id);
            if (index !== -1)
                state.quizzes.content[index] = { ...state.quizzes.content[index], ...action.payload.data };
        },
        updateQuizFailure(state, action: PayloadAction<string>) {
            state.quizLoading = false;
            state.quizError = action.payload;
        }
    }
});

export const {
    createQuizRequest,
    createQuizSuccess,
    createQuizFailure,
    fetchQuizzesRequest,
    fetchQuizzesSuccess,
    fetchQuizzesFailure,
    deleteQuizRequest,
    deleteQuizSuccess,
    deleteQuizFailure,
    updateQuizRequest,
    updateQuizSuccess,
    updateQuizFailure,
    resetQuizState,
    updateQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
