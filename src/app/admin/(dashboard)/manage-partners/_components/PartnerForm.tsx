"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Partner } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PartnerFormProps {
  partner?: Partner | null;
  onSuccess?: () => void; // callback after success
}

interface PartnerFormInputs {
  name: string;
  logo?: FileList; // the new image file
}

// Two schemas: one for create (requires logo), one for update (optional)
const createPartnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  logo: z
    .any()
    .refine((files) => files && files.length === 1, "Logo is required"),
});

const updatePartnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  logo: z
    .any()
    .refine(
      (files) => !files || files.length <= 1,
      "Only one image can be uploaded"
    )
    .optional(),
  description: z.string().optional(),
});

export default function PartnerForm({ partner, onSuccess }: PartnerFormProps) {
  const router = useRouter();
  const isEditing = !!partner;

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormInputs>({
    resolver: zodResolver(
      isEditing ? updatePartnerSchema : createPartnerSchema
    ),
    defaultValues: isEditing
      ? {
          name: partner?.name || "",
        }
      : {},
  });

  const onSubmit = async (data: PartnerFormInputs) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      // Append the file under "logo" for new partner (or update)
      if (data.logo && data.logo.length > 0) {
        formData.append("logo", data.logo[0]); // <--- Key is "logo"
      }

      // Build endpoint & method
      const partnerEndpoint = partner
        ? `/api/partners/editPartner/${partner.id}`
        : "/api/partners/addPartner";
      const method = partner ? "PUT" : "POST";

      // Make the request
      const response = await fetch(partnerEndpoint, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Failed to save Partner");
      }

      // Success
      if (onSuccess) onSuccess();
      router.refresh();

      setSuccess(
        isEditing ? "Partner updated successfully!" : "Partner added successfully!"
      );
      if (!isEditing) {
        reset(); // if adding new, clear the form
      }

      // Navigate after a short delay
      setTimeout(() => {
        router.push("/admin/manage-partners");
      }, 1500);
    } catch (err: unknown) {
      console.error("Partner form error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Partner" : "Add Partner"}</CardTitle>
      </CardHeader>
      <CardContent className="bg-white border-solid b-4 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Partner Name */}
          <div>
            <Label htmlFor="name">Partner Name:</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* If editing, show current image */}
          {isEditing && partner?.logo && (
            <div>
              <Label>Current Image</Label>
              <Image
                src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${partner.logo}`}
                alt={partner.name}
                className="h-20 w-20 object-cover"
                width={200}
                height={100}
              />
            </div>
          )}

          {/* New image */}
          <div>
            <Label htmlFor="logo">
              {isEditing ? "Upload New Image (optional)" : "Partner Logo"}
            </Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              {...register("logo")}
            />
            {errors.logo && (
              <p className="text-destructive">{errors.logo.message}</p>
            )}
          </div>

          {/* Success / Error messages */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit button */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
              ? "Update Partner"
              : "Add Partner"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
