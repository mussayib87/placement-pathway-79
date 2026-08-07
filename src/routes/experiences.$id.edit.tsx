import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesQuery, experiencesApi } from "@/lib/api";
import {
  ExperienceForm,
  type ExperienceValues,
} from "@/components/ExperienceForm";
import { PageHeader, Spinner } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/experiences/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Interview Experience — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Update the rounds, questions, difficulty and preparation tips of a shared interview experience.",
      },
      {
        property: "og:title",
        content: "Edit Interview Experience — Placement Resource Hub",
      },
      {
        property: "og:description",
        content: "Update a shared interview experience.",
      },
    ],
  }),
  component: EditExperience,
});

function EditExperience() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const companies = useQuery(companiesQuery);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["experiences", id],
    queryFn: () => experiencesApi.get(id),
  });

  const update = useMutation({
    mutationFn: (values: ExperienceValues) => experiencesApi.update(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience updated");
      navigate({ to: "/experiences/$id", params: { id } });
    },
    onError: (e: Error) => toast.error(e.message || "Could not update"),
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
      <PageHeader
        title="Edit Interview Experience"
        description="Every field can be updated and saved instantly."
      />
      <div className="mt-6">
        <ExperienceForm
          initial={data}
          companies={(companies.data ?? []).map((c) => c.company_name)}
          submitting={update.isPending}
          submitLabel="Save changes"
          onSubmit={(values) => update.mutate(values)}
          onCancel={() => navigate({ to: "/experiences/$id", params: { id } })}
        />
      </div>
    </div>
  );
}
