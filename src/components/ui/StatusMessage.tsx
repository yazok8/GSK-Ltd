'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusMessageVariants = cva(
  "px-4 py-3 rounded border transition-opacity duration-300",
  {
    variants: {
      variant: {
        success: "bg-green-100 border-green-400 text-green-700",
        error: "bg-red-100 border-red-400 text-red-700",
      }
    },
    defaultVariants: {
      variant: "success"
    }
  }
);

interface StatusMessageProps extends VariantProps<typeof statusMessageVariants> {
  message: string | null;
  className?: string;
}

export function StatusMessage({ message, variant, className }: StatusMessageProps) {
  if (!message) return null;

  return (
    <div className={cn(statusMessageVariants({ variant }), className)}>
      {message}
    </div>
  );
}