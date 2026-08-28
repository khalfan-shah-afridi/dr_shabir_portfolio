import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
api.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const message =
      error.response?.data?.message || "";

    // ==========================================
    // DO NOT REFRESH THE REFRESH ENDPOINT
    // ==========================================
    const isRefreshRequest =
      originalRequest.url?.includes("/auth/refresh");

    // ==========================================
    // HANDLE UNAUTHORIZED REQUEST
    // ==========================================
    const shouldRefresh =
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      (
        message === "Access token expired" ||
        message === "Authorization header is required" ||
        message === "Invalid access token" ||
        message === "Invalid or expired token" ||
        message === "Token expired" ||
        message === "No token provided"
      );

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken =
        localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error(
          "Refresh token not found"
        );
      }

      // ==========================================
      // GET NEW ACCESS TOKEN
      // ==========================================
      const refreshResponse =
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

      const newAccessToken =
        refreshResponse.data?.accessToken;

      if (!newAccessToken) {
        throw new Error(
          "New access token was not returned"
        );
      }

      // ==========================================
      // SAVE NEW ACCESS TOKEN
      // ==========================================
      localStorage.setItem(
        "accessToken",
        newAccessToken
      );

      // ==========================================
      // RETRY ORIGINAL REQUEST
      // ==========================================
      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      console.error(
        "Automatic token refresh failed:",
        refreshError?.response?.data ||
          refreshError.message
      );

      // ==========================================
      // SESSION REALLY EXPIRED
      // ==========================================
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "admin"
      );

      // Only redirect if currently inside admin area
      if (
        window.location.pathname.startsWith(
          "/admin"
        )
      ) {
        window.location.href =
          "/login";
      }

      return Promise.reject(
        refreshError
      );
    }
  }
);

export default api;