import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "list_experiences",
  title: "List interview experiences",
  description:
    "List shared interview experiences, optionally filtered by company or difficulty (Easy, Medium, Hard).",
  inputSchema: {
    company: z.string().trim().optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ company, difficulty, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    let query = supabaseForUser(ctx)
      .from("interview_experiences")
      .select(
        "id, student_name, company, role, difficulty, interview_date, summary, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);
    if (company) query = query.ilike("company", `%${company}%`);
    if (difficulty) query = query.eq("difficulty", difficulty);
    const { data, error } = await query;
    return error ? errorResult(error.message) : textResult({ experiences: data });
  },
});
