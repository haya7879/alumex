import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const getBaseURL = () => {
  return "https://api-test.leoron.eu/api";
};

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor - Add token to headers if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add token from localStorage if available (for token-based auth)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          if (typeof window !== "undefined") {
            // Clear all auth data
            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            // Redirect to login if not already there
            if (!window.location.pathname.includes("/auth/login")) {
              window.location.href = "/auth/login";
            }
          }
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
        default:
          console.error("An error occurred:", error.message);
      }
    } else if (error.request) {
      // Request was made but no response received (usually CORS or network error)
      let errorMessage = "لم يتم استلام استجابة من الخادم";
      
      if (error.code === "ERR_NETWORK") {
        errorMessage = "خطأ في الاتصال بالخادم. تأكد من إعدادات CORS في Laravel أو تحقق من اتصال الإنترنت";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى";
      } else if (error.request.status === 0) {
        errorMessage = "خطأ في الاتصال بالخادم. تأكد من إعدادات CORS في Laravel";
      }
      
      console.error("No response received:", errorMessage, error);
      
      // Create a more user-friendly error
      const networkError: any = new Error(errorMessage);
      networkError.isNetworkError = true;
      networkError.code = error.code;
      return Promise.reject(networkError);
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
      const setupError: any = new Error(error.message || "حدث خطأ أثناء إعداد الطلب");
      return Promise.reject(setupError);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Export types for API responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
