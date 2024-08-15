import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { api } from "../services/api";
import { TOKEN_KEY, USER_KEY } from "../lib/constants";
import { useNavigate } from "@tanstack/react-router";
import { isExpired, decodeToken } from "react-jwt";
import { logoutRequest } from "@/lib/queries";

type AuthType = {
  email: string;
  password: string;
};

type TokenType = {
  Email: string;
  RoleId: string;
  UserId: string;
  aud: any;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  nbf: number;
};

const useAuth = () => {
  const navigate = useNavigate();
  // const [token, setToken, removeToken] = useLocalStorage<string | null>(
  //   TOKEN_KEY,
  //   null
  // );

  const token = localStorage.getItem(TOKEN_KEY)

  const [user, setUser, removeUser] = useLocalStorage<{
    Email: string;
    Role: string;
    RoleId: string;
    UserId: string;
  } | null>(USER_KEY, null);

  const [error, setError] = useState<string>();

  const login = async ({ email, password }: AuthType) => {
    try {
      const res = await api({
        endpoint: "api/Token",
        config: {
          method: "POST",
          data: {
            email,
            password,
          },
        },
      });

      if (res.status === 200) {
        const token = res.data.token;
        console.log(token);
        localStorage.setItem(TOKEN_KEY, token);

        const decodedToken: TokenType | null = decodeToken<TokenType>(token);
        console.log(decodedToken);

        if (decodedToken) {
          if (decodedToken.RoleId === "1") {
            setUser({
              Email: decodedToken.Email,
              Role: "administrator",
              RoleId: decodedToken.RoleId,
              UserId: decodedToken.UserId,
            });
          }
          if (decodedToken.RoleId === "2") {
            setUser({
              Email: decodedToken.Email,
              Role: "agent",
              RoleId: decodedToken.RoleId,
              UserId: decodedToken.UserId,
            });
          }

          if (decodedToken.RoleId === "3") {
            setUser({
              Email: decodedToken.Email,
              Role: "posetilac",
              RoleId: decodedToken.RoleId,
              UserId: decodedToken.UserId,
            });
          }
        }

        setError(undefined);
      }
    } catch (err) {
      removeUser();
      localStorage.removeItem(TOKEN_KEY);

      if (err) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong");
      }
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      removeUser();
      navigate({ to: "/" });
    }
  };

  const register = async ({ email, password }: AuthType) => {
    try {
      const res = await api({
        endpoint: "Auth/register",
        config: {
          method: "POST",
          data: {
            email,
            password,
          },
        },
      });

      if (res.status === 200) {
        const token = res.data.token;
        localStorage.setItem(TOKEN_KEY, token)

        const decodedToken: TokenType | null = decodeToken<TokenType>(token);
        console.log(decodedToken);

        if (decodedToken) {
          setUser({
            Email: decodedToken.Email,
            Role: decodedToken.RoleId === "1" ? "Admin" : "User",
            RoleId: decodedToken.RoleId,
            UserId: decodedToken.UserId,
          });
        }

        setError(undefined);
      }
    } catch (err) {
      removeUser();
      localStorage.removeItem(TOKEN_KEY);

      if (err) {
        setError("User already exists");
      } else {
        setError("Something went wrong");
      }
    }
  };

  const isAuth = Boolean(token);

  return {
    login,
    user,
    logout,
    register,
    error,
    isAuth,
  };
};

export default useAuth;
