import apiClient from "@/lib/api-client";

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

// Auth Services
export const authServices = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>("/login", credentials);     
      const data = response.data;
      
      // Store token in localStorage
      if (typeof window !== "undefined" && data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Store user in localStorage
      if (typeof window !== "undefined" && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      return data;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  },

  /**
   * Logout 
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/user");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

