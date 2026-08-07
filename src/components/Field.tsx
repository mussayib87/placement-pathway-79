import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string | undefined;
  children: ReactNode;
  required?: boolean | undefined;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
