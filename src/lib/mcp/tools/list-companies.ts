import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "list_companies",
  title: "List companies",
  description:
    "List companies tracked in the Placement Resource Hub, optionally filtered by name.",
  inputSchema: {
    search: z.string().trim().optional().describe("Filter by company name."),
    limit: z.number().int().min(1).max(100).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    let query = supabaseForUser(ctx)
      .from("companies")
      .select("id, company_name, role, created_at")
      .order("company_name")
      .limit(limit ?? 50);
    if (search) query = query.ilike("company_name", `%${search}%`);
    const { data, error } = await query;
    return error ? errorResult(error.message) : textResult({ companies: data });
  },
});
