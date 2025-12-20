"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Eye, EyeOff, Lock } from "lucide-react";
import { useAdminLogin } from "@/hooks/use-admin-login";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function AdminLoginForm() {
  const { login, isLoading } = useAdminLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  const { register, handleSubmit, formState, reset } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "airaevents001@gmail.com", password: "password" },
    mode: "onChange",
  });

  async function onSubmit(values: LoginValues) {
    const result: { success: boolean; error?: string } = await login(values);
    if (result.success) {
      reset();
    }
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-aira-gold">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-aira-gold/60">
                <Mail className="h-4 w-4" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                className="pl-9 border-aira-gold/30 focus:border-aira-gold focus:ring-aira-gold/20"
                {...register("email")}
              />
            </div>
            {formState.errors.email && (
              <p className="text-sm text-red-600">{formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-aira-gold">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-aira-gold/60">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="pl-9 pr-10 border-aira-gold/30 focus:border-aira-gold focus:ring-aira-gold/20"
                {...register("password")}
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-aira-gold/60 hover:text-aira-gold transition-colors"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formState.errors.password && (
              <p className="text-sm text-red-600">{formState.errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-aira-gold text-foreground hover:bg-aira-gold/90 active:bg-aira-blue active:text-primary-foreground font-semibold transition-all"
            disabled={isLoading || !formState.isValid}
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
