"use client";

import * as z from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username:z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must have minimum 8 characters"),
});

type SignUpFormValues = z.infer<typeof formSchema>;

export default function UserSignUp() {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    register,
    setError
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username:"",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpFormValues) {  
    try {  
     const response = await fetch("/api/auth/register", {  
      method: "POST",  
      headers: {  
        "Content-Type": "application/json",  
      },  
      body: JSON.stringify({  
        name: values.name,  
        username: values.username,  
        email: values.email,  
        password: values.password,  
      }),  
     });  
    
     const data = await response.json();  
    
     if (response.ok) {  
      toast("Account created successfully");  
      router.push("/admin/auth/sign-in");  
     } else {  
      if (data.error) {  
        if (typeof data.error === "object") {  
         if (data.error.email) {  
          setError("email", {  
            type: "manual",  
            message: data.error.email,  
          });  
         }  
         if (data.error.username) {  
          setError("username", {  
            type: "manual",  
            message: data.error.username,  
          });  
         }  
        } else {  
         switch (data.error) {  
          case "MissingCredentials":  
            toast.error("Please provide all required fields.");  
            break;  
          case "InternalServerError":  
            toast.error("Something went wrong!");  
            break;  
          default:  
            toast.error("Something went wrong!");  
         }  
        }  
      }  
     }  
    } catch (error: any) {  
     console.error("Sign-up failed:", error);  
     toast.error("Something went wrong!");  
    }  
  }  
  

  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Enter your name"
              className="mt-1 block w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              {...register("username")}
              placeholder="Enter your username"
              className="mt-1 block w-full"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
          

          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="mt-1 block w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="mt-1 block w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>
        <p className="text-sm my-3 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-700 cursor-pointer text-sm underline"
            onClick={() => router.push("/user/sign-in")}
          >
            Sign in here
          </span>
        </p>
      </div>
    </div>
  );
}
