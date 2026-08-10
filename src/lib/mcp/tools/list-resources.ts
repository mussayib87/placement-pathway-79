import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "list_resources",
  title: "List preparation resources",
  description:
    "List curated placement preparation resources, optionally filtered by category, type or search text.",
  inputSchema: {
    search: z.string().trim().optional(),
    category: z.string().trim().optional().describe("e.g. DSA, Aptitude, Core CS."),
    type: z.string().trim().optional().describe("e.g. PDF, YouTube, Website."),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, category, type, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    let query = supabaseForUser(ctx)
      .from("resources")
      .select("id, title, company, category, description, type, link, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);
    if (search) query = query.ilike("title", `%${search}%`);
    if (category) query = query.eq("category", category);
    if (type) query = query.eq("type", type);
    const { data, error } = await query;
    return error ? errorResult(error.message) : textResult({ resources: data });
  },
});
