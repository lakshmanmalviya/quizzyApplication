import React from "react";

export enum Role {
  STUDENT = 'Student',
  EDUCATOR = 'Educator',
  ADMIN = 'Admin',
};

export enum Severity {
  HARD = 'Hard',
  MEDIUM = 'Medium',
  BEGINNER = 'Beginner',
};

export enum QuestionType {
  FOUROPTION = 'Four',
  TWOOPTION = 'Two',
}

export interface AuthResponse {
  token: string;
  role: Role;
  isApproved: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  categoryPic: string;
  creator?: User;
  quizzes?: Quiz[]
  isDeleted?: boolean;
  createdAt?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: Role;
  bio: string;
  profilePic: string;
  isActive: boolean;
  education: string;
  quizzes?: Quiz[];
  isApproved: boolean;
}

export interface Quiz {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  quizPic?: string;
  timeLimit: number;
  randomizeQuestions?: boolean;
  attemptedTimes?: number;
  createdAt: string;
  category?: Category;
  questions?: Question[];
  severity: Severity;
  attemptedUserCount?: number;
  isBookmarked?: boolean;
  pass: number;
}

export interface FetchRequest {
  page?: PageRequest;
  dateRange?: DateRangeRequest;
  creatorId?: number;
  categoryId?: number;
  search?: string;
  id?: number;
  uniqueString: string;
}

export interface Question {
  id: number,
  quizId: number,
  text: string,
  questionType: QuestionType,
  questionPic?: string,
  maxScore: number,
  randomizeOptions?: boolean,
  options: Option[]
  quiz?: Quiz
}

export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
  optionPic: string;
}

export interface Result {
  id: number;
  quizId: number,
  score: number;
  timeSpent: number;
  isCompleted: boolean;
  correctAnswers: number;
  timesTaken: number;
  totalScore: number;
  totalQuestion: number;
  incorrectAnswers: number;
  feedbackText: string;
  feedbackColor: string;
  quiz?: Quiz;
  pass: boolean;
  createdAt?: string;
}

export interface Bookmark {
  id: number;
  quizId: number;
  isBookmarked: boolean;
  quiz?: Quiz;
  createdAt?: string;
}

export interface UserResultData {
  totalCompletedQuizzes: number;
  totalInCompletedQuizzes: number;
  totalTimeSpent: number;
  totalOfTotalScore: number;
  totalScore: number;
}

export interface EducatorProfileData {
  totalQuiz: number;
  totalQuestion: number;
}

export interface AdminProfileData {
  totalCategory: number;
  totalUser: number;
}

export interface Feedback {
  feedbackText: string;
  id: number;
  questionId: number;
}

export interface PageRequest {
  page: number;
  size: number;
}

export interface DeleteSuccess {
  id: number;
  msg: string;
}

export interface CreateSuccess<T> {
  data: T;
  msg: string;
}

export interface UpdateSuccess<T> {
  data: T;
  msg: string;
}

export interface UpdateSuccess<T> {
  data: T;
  msg: string;
}

export interface DateRangeRequest {
  start: string;
  end: string;
}

export interface UnifiedResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface SortingOption {
  id: string;
  name: string;
}

export interface Filters {
  start?: string;
  end?: string;
  page?: number;
  size?: number;
  name?: string;
  bio?: string;
  education?: string;
  text?: string;
  questionType?: string;
  maxScore?: number;
  randomizeOptions?: boolean;
  description?: string;
  quizId?: number;
  score?: number;
  timeSpent?: number;
  isCompleted?: boolean;
  correctAnswers?: number;
  timesTaken?: number;
  totalScore?: number;
  totalQuestion?: number;
  incorrectAnswers?: number;
  creatorId?: number;
  categoryId?: number;
  title?: string;
  quizPic?: string;
  timeLimit?: number;
  randomizeQuestions?: boolean;
  attemptedTimes?: number;
  createdAt?: string;
  sort?: string;
  query?: string;
  role?: Role;
  severity?: Severity;
  toggle?: boolean;
}