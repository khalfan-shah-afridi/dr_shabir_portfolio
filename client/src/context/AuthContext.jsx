import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD / RESTORE ADMIN SESSION
  // ==========================================
  useEffect(() => {
    const restoreSession = async () => {
      const savedAdmin =
        localStorage.getItem("admin");

      const accessToken =
        localStorage.getItem("accessToken");

      const refreshToken =
        localStorage.getItem("refreshToken");

      // Nothing saved
      if (!savedAdmin) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const parsedAdmin =
          JSON.parse(savedAdmin);

        // ======================================
        // ACCESS TOKEN EXISTS
        // ======================================
        if (accessToken) {
          setAdmin(parsedAdmin);
          setLoading(false);
          return;
        }

        // ======================================
        // ACCESS TOKEN MISSING
        // TRY REFRESH TOKEN
        // ======================================
        if (refreshToken) {
          const response =
            await api.post(
              "/auth/refresh",
              {
                refreshToken,
              }
            );

          const newAccessToken =
            response.data?.accessToken;

          if (newAccessToken) {
            localStorage.setItem(
              "accessToken",
              newAccessToken
            );

            setAdmin(parsedAdmin);
            setLoading(false);
            return;
          }
        }

        // ======================================
        // NO VALID SESSION
        // ======================================
        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        localStorage.removeItem(
          "admin"
        );

        setAdmin(null);

      } catch (error) {
        console.error(
          "Session restore failed:",
          error?.response?.data ||
            error.message
        );

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        localStorage.removeItem(
          "admin"
        );

        setAdmin(null);
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================
  const login = async (
    email,
    password
  ) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const {
      accessToken,
      refreshToken,
      admin: adminData,
    } = response.data;

    if (accessToken) {
      localStorage.setItem(
        "accessToken",
        accessToken
      );
    }

    if (refreshToken) {
      localStorage.setItem(
        "refreshToken",
        refreshToken
      );
    }

    if (adminData) {
      localStorage.setItem(
        "admin",
        JSON.stringify(adminData)
      );

      setAdmin(adminData);
    }

    return response.data;
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = async () => {
    const refreshToken =
      localStorage.getItem(
        "refreshToken"
      );

    try {
      if (refreshToken) {
        await api.post(
          "/auth/logout",
          {
            refreshToken,
          }
        );
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "admin"
      );

      setAdmin(null);
    }
  };

  // ==========================================
  // MANUAL REFRESH ACCESS TOKEN
  // ==========================================
  const refreshAccessToken =
    async () => {
      const refreshToken =
        localStorage.getItem(
          "refreshToken"
        );

      if (!refreshToken) {
        throw new Error(
          "Refresh token not found"
        );
      }

      const response =
        await api.post(
          "/auth/refresh",
          {
            refreshToken,
          }
        );

      const newAccessToken =
        response.data?.accessToken;

      if (!newAccessToken) {
        throw new Error(
          "Access token not returned"
        );
      }

      localStorage.setItem(
        "accessToken",
        newAccessToken
      );

      return newAccessToken;
    };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  const changePassword = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    const response =
      await api.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

    return response.data;
  };

  // ==========================================
  // SEND CHANGE EMAIL OTP
  // ==========================================
  const sendChangeEmailOTP =
    async (newEmail) => {
      const response =
        await api.post(
          "/auth/send-change-email-otp",
          {
            newEmail,
          }
        );

      return response.data;
    };

  // ==========================================
  // CHANGE EMAIL
  // ==========================================
  const changeEmail = async ({
    newEmail,
    currentPassword,
    otp,
  }) => {
    const response =
      await api.put(
        "/auth/change-email",
        {
          newEmail,
          currentPassword,
          otp,
        }
      );

    if (response.data?.admin) {
      setAdmin(
        response.data.admin
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(
          response.data.admin
        )
      );
    }

    return response.data;
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================
  const contextValue = {
    admin,

    loading,

    isAuthenticated:
      Boolean(admin) &&
      Boolean(
        localStorage.getItem(
          "refreshToken"
        )
      ),

    login,
    logout,
    refreshAccessToken,
    changePassword,
    sendChangeEmailOTP,
    changeEmail,
  };

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}