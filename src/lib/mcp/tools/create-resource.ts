import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "create_resource",
  title: "Add a preparation resource",
  description:
    "Add a new preparation resource owned by the signed-in user of the Placement Resource Hub.",
  inputSchema: {
    title: z.string().trim().min(1),
    link: z.string().trim().url(),
    category: z.string().trim().min(1).describe("e.g. DSA, Aptitude, Core CS."),
    type: z.string().trim().min(1).describe("e.g. PDF, YouTube, Website."),
    company: z.string().trim().optional(),
    description: z.string().trim().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("resources")
      .insert({ ...input, user_id: ctx.getUserId() })
      .select()
      .single();
    return error ? errorResult(error.message) : textResult({ resource: data });
  },
});
