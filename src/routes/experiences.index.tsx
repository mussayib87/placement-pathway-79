import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Eye,
  MessagesSquare,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import {
  DIFFICULTIES,
  experiencesApi,
  experiencesQuery,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import {
  CardSkeletonGrid,
  Chip,
  DifficultyBadge,
  EmptyState,
  PageHeader,
} from "@/components/ui-kit";

export const Route = createFileRoute("/experiences/")({
  head: () => ({
    meta: [
      { title: "Interview Experiences — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Read detailed interview experiences with rounds, technical and HR questions, difficulty and preparation tips.",
      },
      {
        property: "og:title",
        content: "Interview Experiences — Placement Resource Hub",
      },
      {
        property: "og:description",
        content:
          "Rounds, technical and HR questions, difficulty and tips from real student interviews.",
      },
    ],
  }),
  component: ExperiencesPage,
});

function ExperiencesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(experiencesQuery);
  const [term, setTerm] = useState("");
  const [company, setCompany] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const companies = useMemo(
    () => Array.from(new Set((data ?? []).map((e) => e.company))).sort(),
    [data],
  );

  const remove = useMutation({
    mutationFn: experiencesApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience deleted");
    },
    onError: (e: Error) => toast.error(e.message || "Delete failed"),
  });

  const rows = (data ?? [])
    .filter((e) => {
      const q = term.toLowerCase();
      return (
        !q ||
        [
          e.company,
          e.role,
          e.student_name,
          e.technical_questions,
          e.hr_questions,
          e.coding_questions,
          e.summary,
          e.tips,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    })
    .filter((e) => company === "all" || e.company === company)
    .filter((e) => difficulty === "all" || e.difficulty === difficulty)
    .sort((a, b) => {
      const da = a.interview_date ?? a.created_at;
      const db = b.interview_date ?? b.created_at;
      return sort === "newest" ? (da < db ? 1 : -1) : da > db ? 1 : -1;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Interview Experiences"
        description="First-hand accounts of real placement interviews, round by round."
        action={
          <Button asChild>
            <Link to="/experiences/new">
              <Plus className="size-4" /> Add Experience
            </Link>
          </Button>
        }
      />

      <div className="surface-card mt-6 grid gap-3 p-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search company, role, student or question…"
            className="pl-9"
          />
        </div>
        <Select value={company} onValueChange={setCompany}>
          <SelectTrigger>
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All companies</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as "newest" | "oldest")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Showing {rows.length} {rows.length === 1 ? "experience" : "experiences"}
      </p>

      <div className="mt-4">
        {isLoading ? (
          <CardSkeletonGrid />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={MessagesSquare}
            title="No experiences yet"
            description="Be the first to document an interview so juniors don't start from zero."
            actionLabel="Add Experience"
            actionTo="/experiences/new"
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {rows.map((e) => (
              <article key={e.id} className="surface-card hover-lift p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{e.company}</h2>
                    <p className="text-sm text-muted-foreground">{e.role}</p>
                  </div>
                  <DifficultyBadge value={e.difficulty} />
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="size-3.5" /> {e.student_name}
                  </span>
                  {e.interview_date && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {new Date(e.interview_date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {e.rounds && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Rounds
                    </p>
                    <p className="mt-1 text-sm">{e.rounds}</p>
                  </div>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {e.technical_questions && (
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Technical
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm">
                        {e.technical_questions}
                      </p>
                    </div>
                  )}
                  {e.hr_questions && (
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        HR
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm">
                        {e.hr_questions}
                      </p>
                    </div>
                  )}
                </div>

                {e.tips && (
                  <div className="mt-4 rounded-lg bg-accent/60 p-3">
                    <Chip>Tip</Chip>
                    <p className="mt-2 line-clamp-2 text-sm">{e.tips}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link to="/experiences/$id" params={{ id: e.id }}>
                      <Eye className="size-4" /> View
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/experiences/$id/edit" params={{ id: e.id }}>
                      <Pencil className="size-4" /> Edit
                    </Link>
                  </Button>
                  <ConfirmDelete
                    title="Delete this experience?"
                    description="This permanently removes the interview experience from the hub."
                    onConfirm={() => remove.mutateAsync(e.id)}
                  >
                    <Button size="sm" variant="outline">
                      <Trash2 className="size-4 text-destructive" /> Delete
                    </Button>
                  </ConfirmDelete>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
