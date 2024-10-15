import { getPageObject } from '@/services/CommonServices';
import { CreateSuccess, DeleteSuccess, PageResponse, Question, QuestionType, UpdateSuccess } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuestionState {
    question: Question;
    questionLoading: boolean;
    questionError: string | null;
    questionMessage: string | null;
    questions: PageResponse<Question>;
}

const initialState: QuestionState = {
    question: {
        id: 0,
        quizId: 0,
        text: '',
        questionType: QuestionType.FOUROPTION,
        questionPic: '/addPic.png',
        maxScore: 0,
        randomizeOptions: false,
        options: Array(4).fill({ id: 0, text: '', isCorrect: false, optionPic: '/addPic.png' }),
    },
    questionLoading: false,
    questionError: null,
    questionMessage: null,
    questions: getPageObject(),
};

const questionSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        createQuestionRequest(state, action: PayloadAction<Question>) {
            state.questionLoading = true;
            state.questionError = null;
        },
        createQuestionSuccess(state, action: PayloadAction<CreateSuccess<Question>>) {
            state.questionLoading = false;
            state.questionError = null;
            state.questionMessage = action.payload.msg;
            state.questions.content.unshift(action.payload.data);
        },
        createQuestionFailure(state, action: PayloadAction<string>) {
            state.questionLoading = false;
            state.questionError = action.payload;
        },
        resetQuestionState(state) {
            state.questionMessage = null;
            state.questionError = null;
        },
        fetchQuestionsRequest(state, action: PayloadAction<string>) {
            state.questionLoading = true;
            state.questionError = null;
        },
        fetchQuestionsSuccess(state, action: PayloadAction<PageResponse<Question>>) {
            state.questionLoading = false;
            state.questionError = null;
            state.questions = action.payload;
        },
        fetchQuestionsFailure(state, action: PayloadAction<string>) {
            state.questionLoading = false;
            state.questionError = action.payload;
        },
        deleteQuestionRequest(state, action: PayloadAction<number>) {
            state.questionLoading = true;
            state.questionError = null;
        },
        deleteQuestionSuccess(state, action: PayloadAction<DeleteSuccess>) {
            state.questionLoading = false;
            state.questionError = null;
            state.questionMessage = action.payload.msg;
            state.questions.content = state.questions.content.filter((question: Question) => question.id != action.payload.id)
        },
        deleteQuestionFailure(state, action: PayloadAction<string>) {
            state.questionLoading = false;
            state.questionError = action.payload;
        },
        updateQuestionRequest(state, action: PayloadAction<Question>) {
            state.questionLoading = true;
            state.questionError = null;
        },
        updateQuestionSuccess(state, action: PayloadAction<UpdateSuccess<Question>>) {
            state.questionLoading = false;
            state.questionError = null;
            state.questionMessage = action.payload.msg
            const index = state.questions.content.findIndex((question: Question) => question.id === action.payload.data.id);
            if (index !== -1)
                state.questions.content[index] = { ...state.questions.content[index], ...action.payload.data };
        },
        updateQuestionFailure(state, action: PayloadAction<string>) {
            state.questionLoading = false;
            state.questionError = action.payload;
        },
    },
});

export const {
    createQuestionRequest,
    createQuestionSuccess,
    createQuestionFailure,
    resetQuestionState,
    fetchQuestionsRequest,
    fetchQuestionsSuccess,
    fetchQuestionsFailure,
    deleteQuestionRequest,
    deleteQuestionSuccess,
    deleteQuestionFailure,
    updateQuestionRequest,
    updateQuestionSuccess,
    updateQuestionFailure,
} = questionSlice.actions;

export default questionSlice.reducer;
