import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/Field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTIES, type Experience } from "@/lib/api";

export const experienceSchema = z.object({
  student_name: z.string().trim().min(2, "Student name is required").max(80),
  company: z.string().trim().min(1, "Company is required").max(80),
  role: z.string().trim().min(2, "Role is required").max(80),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  interview_date: z.string().trim().min(1, "Interview date is required"),
  rounds: z.string().trim().min(3, "Describe the interview rounds").max(1000),
  technical_questions: z.string().trim().max(3000).optional().or(z.literal("")),
  hr_questions: z.string().trim().max(3000).optional().or(z.literal("")),
  coding_questions: z.string().trim().max(3000).optional().or(z.literal("")),
  summary: z.string().trim().min(10, "Add a short summary").max(3000),
  tips: z.string().trim().max(3000).optional().or(z.literal("")),
});

export type ExperienceValues = z.infer<typeof experienceSchema>;

type Props = {
  initial?: Experience;
  companies: string[];
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: ExperienceValues) => void;
  onCancel: () => void;
};

export function ExperienceForm({
  initial,
  companies,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] = useState<ExperienceValues>({
    student_name: initial?.student_name ?? "",
    company: initial?.company ?? "",
    role: initial?.role ?? "",
    difficulty: (initial?.difficulty as ExperienceValues["difficulty"]) ?? "Medium",
    interview_date: initial?.interview_date ?? "",
    rounds: initial?.rounds ?? "",
    technical_questions: initial?.technical_questions ?? "",
    hr_questions: initial?.hr_questions ?? "",
    coding_questions: initial?.coding_questions ?? "",
    summary: initial?.summary ?? "",
    tips: initial?.tips ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof ExperienceValues, v: string) =>
    setValues((p) => ({ ...p, [key]: v }) as ExperienceValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = experienceSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues)
        next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card space-y-6 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Student Name" error={errors["student_name"]} required>
          <Input
            value={values.student_name}
            onChange={(e) => set("student_name", e.target.value)}
            placeholder="e.g. Ananya Sharma"
          />
        </Field>
        <Field label="Company" error={errors["company"]} required>
          <Input
            list="company-options"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="e.g. Google"
          />
          <datalist id="company-options">
            {companies.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Role" error={errors["role"]} required>
          <Input
            value={values.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </Field>
        <Field label="Interview Date" error={errors["interview_date"]} required>
          <Input
            type="date"
            value={values.interview_date}
            onChange={(e) => set("interview_date", e.target.value)}
          />
        </Field>
        <Field label="Interview Difficulty" error={errors["difficulty"]} required>
          <Select
            value={values.difficulty}
            onValueChange={(v) => set("difficulty", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Interview Rounds" error={errors["rounds"]} required>
          <Input
            value={values.rounds}
            onChange={(e) => set("rounds", e.target.value)}
            placeholder="OA, 2 technical rounds, HR"
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Technical Questions" error={errors["technical_questions"]}>
          <Textarea
            rows={4}
            value={values.technical_questions}
            onChange={(e) => set("technical_questions", e.target.value)}
            placeholder="DBMS indexing, OOPs, OS scheduling…"
          />
        </Field>
        <Field label="HR Questions" error={errors["hr_questions"]}>
          <Textarea
            rows={4}
            value={values.hr_questions}
            onChange={(e) => set("hr_questions", e.target.value)}
            placeholder="Tell me about yourself, why this company…"
          />
        </Field>
        <Field label="Coding Questions" error={errors["coding_questions"]}>
          <Textarea
            rows={4}
            value={values.coding_questions}
            onChange={(e) => set("coding_questions", e.target.value)}
            placeholder="Number of Islands, LRU Cache…"
          />
        </Field>
        <Field label="Preparation Tips" error={errors["tips"]}>
          <Textarea
            rows={4}
            value={values.tips}
            onChange={(e) => set("tips", e.target.value)}
            placeholder="What worked, what you would do differently…"
          />
        </Field>
      </div>

      <Field label="Experience Summary" error={errors["summary"]} required>
        <Textarea
          rows={5}
          value={values.summary}
          onChange={(e) => set("summary", e.target.value)}
          placeholder="Walk through how the process went end to end."
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
