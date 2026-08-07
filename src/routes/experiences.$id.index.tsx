import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { experiencesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { DifficultyBadge, Spinner } from "@/components/ui-kit";

export const Route = createFileRoute("/experiences/$id/")({
  head: () => ({
    meta: [
      { title: "Interview Experience — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Full interview breakdown: rounds, technical questions, HR questions, coding problems and preparation tips.",
      },
      {
        property: "og:title",
        content: "Interview Experience — Placement Resource Hub",
      },
      {
        property: "og:description",
        content:
          "Rounds, technical and HR questions, coding problems and preparation tips.",
      },
    ],
  }),
  component: ExperienceDetail,
});

function Section({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <div className="surface-card p-5">
      <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  );
}

function ExperienceDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["experiences", id],
    queryFn: () => experiencesApi.get(id),
  });

  const remove = useMutation({
    mutationFn: () => experiencesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience deleted");
      navigate({ to: "/experiences" });
    },
    onError: (e: Error) => toast.error(e.message || "Delete failed"),
  });

  if (isLoading) return <Spinner label="Loading experience…" />;
  if (isError || !data)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Experience not found</h1>
        <Button asChild className="mt-4">
          <Link to="/experiences">Back to experiences</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/experiences">
          <ArrowLeft className="size-4" /> Back
        </Link>
      </Button>

      <div className="surface-card mt-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">{data.company}</h1>
            <p className="mt-1 text-muted-foreground">{data.role}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="size-3.5" /> {data.student_name}
              </span>
              {data.interview_date && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {new Date(data.interview_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <DifficultyBadge value={data.difficulty} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/experiences/$id/edit" params={{ id: data.id }}>
              <Pencil className="size-4" /> Edit
            </Link>
          </Button>
          <ConfirmDelete
            title="Delete this experience?"
            description="This permanently removes it from the hub."
            onConfirm={() => remove.mutateAsync()}
          >
            <Button size="sm" variant="outline">
              <Trash2 className="size-4 text-destructive" /> Delete
            </Button>
          </ConfirmDelete>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <Section title="Experience Summary" body={data.summary} />
        <Section title="Interview Rounds" body={data.rounds} />
        <div className="grid gap-4 md:grid-cols-2">
          <Section title="Technical Questions" body={data.technical_questions} />
          <Section title="HR Questions" body={data.hr_questions} />
          <Section title="Coding Questions" body={data.coding_questions} />
          <Section title="Preparation Tips" body={data.tips} />
        </div>
      </div>
    </div>
  );
}
