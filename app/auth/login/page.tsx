"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLogin } from "@/services/auth/auth-hooks";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "password",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
    try {
      await loginMutation.mutateAsync(data);
      toast.success("تم تسجيل الدخول بنجاح");
    } catch (error: any) {
      console.error("Login error:", error);
      // Show user-friendly error message
      const errorMessage = error?.message || "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى";
      toast.error(errorMessage);
    }
  };

  return (
  // <div className="h-screen w-full flex">
  //   <div className="bg-auth h-full w-1/2">

  //   </div>
  // <div className="w-1/2 flex items-center justify-center">
  <Card className="py-6 max-w-md w-full">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <Logo variant="horizontal" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription className="text-sm">
            أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      icon={Mail}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      icon={Lock}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              isLoading={loginMutation.isPending}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  // </div>
  // </div>
  );
}
