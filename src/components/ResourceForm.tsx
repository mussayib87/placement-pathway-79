import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/Field";
import { CATEGORIES, RESOURCE_TYPES, type Resource } from "@/lib/api";

export const resourceSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(120),
  company: z.string().trim().max(80).optional().or(z.literal("")),
  category: z.string().trim().min(1, "Category is required"),
  description: z
    .string()
    .trim()
    .min(10, "Add a short description")
    .max(1000),
  type: z.string().trim().min(1, "Resource type is required"),
  link: z
    .string()
    .trim()
    .min(1, "Link is required")
    .url("Enter a valid URL starting with http:// or https://"),
});

export type ResourceValues = z.infer<typeof resourceSchema>;

export function ResourceForm({
  initial,
  companies,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Resource;
  companies: string[];
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: ResourceValues) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ResourceValues>({
    title: initial?.title ?? "",
    company: initial?.company ?? "",
    category: initial?.category ?? "DSA",
    description: initial?.description ?? "",
    type: initial?.type ?? "Website",
    link: initial?.link ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof ResourceValues, v: string) =>
    setValues((p) => ({ ...p, [key]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = resourceSchema.safeParse(values);
        if (!parsed.success) {
          const next: Record<string, string> = {};
          for (const issue of parsed.error.issues)
            next[String(issue.path[0])] = issue.message;
          setErrors(next);
          return;
        }
        setErrors({});
        onSubmit(parsed.data);
      }}
      className="surface-card space-y-6 p-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" error={errors["title"]} required>
          <Input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Striver SDE Sheet"
          />
        </Field>
        <Field label="Company (optional)" error={errors["company"]}>
          <Input
            list="resource-company-options"
            value={values.company ?? ""}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Leave blank for general resources"
          />
          <datalist id="resource-company-options">
            {companies.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Category" error={errors["category"]} required>
          <Select
            value={values.category}
            onValueChange={(v) => set("category", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Resource Type" error={errors["type"]} required>
          <Select value={values.type} onValueChange={(v) => set("type", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESOURCE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Link" error={errors["link"]} required>
        <Input
          value={values.link}
          onChange={(e) => set("link", e.target.value)}
          placeholder="https://example.com/resource"
        />
      </Field>

      <Field label="Description" error={errors["description"]} required>
        <Textarea
          rows={4}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What does this resource cover and who is it for?"
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={submitting} className="sm:w-40">
          {submitting ? "Saving…" : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
