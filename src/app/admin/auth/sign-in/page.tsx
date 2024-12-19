"use client";

import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

// Define the validation schema
const adminFormSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have minimum 8 characters"),
  isAdmin: z.literal("true"), // Ensure isAdmin is always "true" for admin sign-in
});

type SignInFormValues = z.infer<typeof adminFormSchema>;

// Define the AdminSignIn component
export default function AdminSignIn() {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
      isAdmin: "true", // Set default value to "true"
    },
  });

  async function onSubmit(values: SignInFormValues) {
    const callbackUrl = "/admin/manage-products"; // Redirect to admin dashboard after sign-in
    const signinCreds = await signIn("credentials", {
      identifier: values.identifier,
      password: values.password,
      redirect: false,
      callbackUrl,
      isAdmin: values.isAdmin, // Pass 'isAdmin' as part of the credentials
    });

    if (signinCreds?.error) {
      toast.error("Invalid credentials or you do not have admin access.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] overflow-hidden p-5">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
          <div className="max-w-sm">
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              id="identifier"
              type="text"
              {...register("identifier")}
              placeholder="Enter your admin email or username"
            />
            {errors.identifier && (
              <p className="text-red-500">{errors.identifier.message}</p>
            )}
          </div>

          <div className="max-w-sm">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Hidden field to indicate admin sign-in */}
          <input type="hidden" value="true" {...register("isAdmin")} />

          <div className="mt-4">
            <Button type="submit">Admin Sign in</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
