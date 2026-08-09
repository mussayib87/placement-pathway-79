import { supabase } from "@/integrations/supabase/client";

export type Company = {
  id: string;
  company_name: string;
  role: string;
  created_at: string;
};

export type Experience = {
  id: string;
  student_name: string;
  company: string;
  role: string;
  difficulty: string;
  interview_date: string | null;
  rounds: string | null;
  technical_questions: string | null;
  hr_questions: string | null;
  coding_questions: string | null;
  summary: string | null;
  tips: string | null;
  created_at: string;
};

export type Resource = {
  id: string;
  title: string;
  company: string | null;
  category: string;
  description: string | null;
  type: string;
  link: string;
  created_at: string;
};

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const RESOURCE_TYPES = [
  "PDF",
  "YouTube",
  "Website",
  "Notes",
  "DSA Sheet",
  "Aptitude",
  "System Design",
] as const;
export const CATEGORIES = [
  "DSA",
  "Aptitude",
  "Core CS",
  "System Design",
  "Interview Prep",
  "Resume",
  "HR",
] as const;

function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error) throw error;
  return data as T;
}

/** Current user id, used to stamp ownership on new rows (required by RLS). */
export async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Please sign in to continue.");
  return data.user.id;
}

/* ---------------- Companies ---------------- */
export const companiesApi = {
  list: async () =>
    unwrap<Company[]>(
      await supabase.from("companies").select("*").order("company_name"),
    ),
  create: async (payload: Pick<Company, "company_name" | "role">) =>
    unwrap<Company>(
      await supabase
        .from("companies")
        .insert({ ...payload, user_id: await currentUserId() })
        .select()
        .single(),
    ),
  update: async (id: string, payload: Partial<Company>) =>
    unwrap<Company>(
      await supabase
        .from("companies")
        .update(payload)
        .eq("id", id)
        .select()
        .single(),
    ),
  remove: async (id: string) => {
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) throw error;
  },
};

/* ---------------- Experiences ---------------- */
export const experiencesApi = {
  list: async () =>
    unwrap<Experience[]>(
      await supabase
        .from("interview_experiences")
        .select("*")
        .order("created_at", { ascending: false }),
    ),
  get: async (id: string) =>
    unwrap<Experience>(
      await supabase
        .from("interview_experiences")
        .select("*")
        .eq("id", id)
        .single(),
    ),
  create: async (payload: Record<string, unknown>) =>
    unwrap<Experience>(
      await supabase
        .from("interview_experiences")
        .insert({ ...payload, user_id: await currentUserId() } as never)
        .select()
        .single(),
    ),
  update: async (id: string, payload: Record<string, unknown>) =>
    unwrap<Experience>(
      await supabase
        .from("interview_experiences")
        .update(payload as never)
        .eq("id", id)
        .select()
        .single(),
    ),
  remove: async (id: string) => {
    const { error } = await supabase
      .from("interview_experiences")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

/* ---------------- Resources ---------------- */
export const resourcesApi = {
  list: async () =>
    unwrap<Resource[]>(
      await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false }),
    ),
  get: async (id: string) =>
    unwrap<Resource>(
      await supabase.from("resources").select("*").eq("id", id).single(),
    ),
  create: async (payload: Record<string, unknown>) =>
    unwrap<Resource>(
      await supabase
        .from("resources")
        .insert({ ...payload, user_id: await currentUserId() } as never)
        .select()
        .single(),
    ),
  update: async (id: string, payload: Record<string, unknown>) =>
    unwrap<Resource>(
      await supabase
        .from("resources")
        .update(payload as never)
        .eq("id", id)
        .select()
        .single(),
    ),
  remove: async (id: string) => {
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) throw error;
  },
};

/* ---------------- Query options ---------------- */
export const companiesQuery = {
  queryKey: ["companies"],
  queryFn: companiesApi.list,
};
export const experiencesQuery = {
  queryKey: ["experiences"],
  queryFn: experiencesApi.list,
};
export const resourcesQuery = {
  queryKey: ["resources"],
  queryFn: resourcesApi.list,
};
