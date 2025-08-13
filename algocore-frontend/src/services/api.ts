import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  RefreshRequest,
  ProblemDetailsDto,
  SubmissionRequestDto,
  SubmissionResponseDto,
  SubmissionListDto,
  User,
  PaginatedResponse,
  TestCaseRequestDto
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken({ refreshToken });
              localStorage.setItem('accessToken', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);
              
              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshData: RefreshRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/refresh', refreshData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/users/me');
    return response.data;
  }

  // Problem endpoints
  async getAllProblems(): Promise<ProblemDetailsDto[]> {
    const response: AxiosResponse<ProblemDetailsDto[]> = await this.api.get('/problems');
    return response.data;
  }

  async getProblemById(id: string): Promise<ProblemDetailsDto> {
    const response: AxiosResponse<ProblemDetailsDto> = await this.api.get(`/problems/${id}`);
    return response.data;
  }

  async createProblem(problemData: any): Promise<ProblemDetailsDto> {
    const response: AxiosResponse<ProblemDetailsDto> = await this.api.post('/problems/create', problemData);
    return response.data;
  }

  // Admin endpoints
  async deleteProblem(problemId: string): Promise<void> {
    await this.api.delete(`/problems/${problemId}`);
  }

  async hasSubmissions(problemId: string): Promise<boolean> {
    const response: AxiosResponse<boolean> = await this.api.get(`/problems/${problemId}/has-submissions`);
    return response.data;
  }

  async getProblemTestCases(problemId: string): Promise<TestCaseRequestDto[]> {
    const response: AxiosResponse<TestCaseRequestDto[]> = await this.api.get(`/problems/${problemId}/testcases`);
    return response.data;
  }

  async updateProblemTestCases(problemId: string, testCases: TestCaseRequestDto[]): Promise<ProblemDetailsDto> {
    const response: AxiosResponse<ProblemDetailsDto> = await this.api.put(`/problems/${problemId}/testcases`, testCases);
    return response.data;
  }

  // Submission endpoints
  async submitProblem(problemId: string, submission: SubmissionRequestDto): Promise<SubmissionResponseDto> {
    const response: AxiosResponse<SubmissionResponseDto> = await this.api.post(`/problems/${problemId}/submit`, submission);
    return response.data;
  }

  async getSubmissionsForProblem(problemId: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<SubmissionListDto>> {
    const response: AxiosResponse<PaginatedResponse<SubmissionListDto>> = await this.api.get(`/submissions/problems/${problemId}?page=${page}&size=${size}`);
    return response.data;
  }

  async getUserSubmissionsForProblem(problemId: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<SubmissionListDto>> {
    const response: AxiosResponse<PaginatedResponse<SubmissionListDto>> = await this.api.get(`/submissions/me/problems/${problemId}/list?page=${page}&size=${size}`);
    return response.data;
  }

  async getUserSubmissions(page: number = 0, size: number = 10): Promise<PaginatedResponse<SubmissionResponseDto>> {
    const response: AxiosResponse<PaginatedResponse<SubmissionResponseDto>> = await this.api.get(`/users/me/submissions?page=${page}&size=${size}`);
    return response.data;
  }

  // Utility methods
  setAuthTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearAuthTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const apiService = new ApiService();
export default apiService; 