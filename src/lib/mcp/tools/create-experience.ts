import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "create_experience",
  title: "Share an interview experience",
  description:
    "Create a new interview experience owned by the signed-in user of the Placement Resource Hub.",
  inputSchema: {
    student_name: z.string().trim().min(1),
    company: z.string().trim().min(1),
    role: z.string().trim().min(1),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    interview_date: z
      .string()
      .trim()
      .optional()
      .describe("ISO date, e.g. 2026-03-14."),
    rounds: z.string().trim().optional(),
    technical_questions: z.string().trim().optional(),
    hr_questions: z.string().trim().optional(),
    coding_questions: z.string().trim().optional(),
    summary: z.string().trim().optional(),
    tips: z.string().trim().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("interview_experiences")
      .insert({
        ...input,
        difficulty: input.difficulty ?? "Medium",
        interview_date: input.interview_date || null,
        user_id: ctx.getUserId(),
      })
      .select()
      .single();
    return error ? errorResult(error.message) : textResult({ experience: data });
  },
});
