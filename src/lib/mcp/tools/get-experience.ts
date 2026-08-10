import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "get_experience",
  title: "Get interview experience",
  description:
    "Fetch the full detail of one interview experience, including rounds, questions and tips.",
  inputSchema: { id: z.string().uuid().describe("Interview experience id.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("interview_experiences")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return errorResult(error.message);
    if (!data) return errorResult(`No interview experience found with id ${id}`);
    return textResult({ experience: data });
  },
});
