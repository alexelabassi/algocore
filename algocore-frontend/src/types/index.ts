export enum ProblemDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum SchoolGrade {
  GRADE_9 = 'GRADE_9',
  GRADE_10 = 'GRADE_10',
  GRADE_11 = 'GRADE_11'
}

export enum SubmissionResult {
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED'
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface ProblemDetailsDto {
  id: string;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  schoolGrade: SchoolGrade;
  hasSolved?: boolean;
}

export interface ProblemSummaryDto {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  schoolGrade: SchoolGrade;
  acceptanceRate?: number;
  hasSolved?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface SubmissionRequestDto {
  code: string;
  language: string;
}

export interface SubmissionResponseDto {
  submissionId: string;
  result: SubmissionResult;
  stdout: string;
  stderr: string;
  runtimeMs: number;
  memoryKb: number;
  failedTestCaseId?: string;
  expectedOutput?: string;
  actualOutput?: string;
}

export interface SubmissionListDto {
  submissionId: string;
  username: string;
  result: SubmissionResult;
  language: string;
  runtimeMs: number;
  memoryKb: number;
  submittedAt: string;
  problemId: string;
  problemTitle: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TestCaseRequestDto {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
} 