import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { adminAuthApi } from "@/lib/api/admin-auth";
import type { IErrorResponse } from "@/lib/types/api";
import { IAdmin, IAuthToken } from "@/domain/admin";

interface IUseAdminLoginOptions {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function useAdminLogin(options: IUseAdminLoginOptions = {}) {
  const { onSuccess, redirectTo = "/admin" } = options;
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const login = async (credentials: IAdmin): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { token }: IAuthToken = await adminAuthApi.login(credentials);
      console.log("Received token:", token);
      adminAuthApi.storeToken(token);

      toast({
        title: "Logged in",
        description: "Welcome back!",
      });

      onSuccess?.();
      router.replace(redirectTo);

      return { success: true };
    } catch (error) {
      const err = error as IErrorResponse;

      const message = err?.message;

      toast({
        title: "Login error",
        description: message,
        variant: "destructive",
      });

      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    adminAuthApi.removeToken();
    router.replace("/login");
  };

  return {
    login,
    logout,
    isLoading,
  };
}
