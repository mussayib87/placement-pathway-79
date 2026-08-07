import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  companiesQuery,
  experiencesApi,
} from "@/lib/api";
import {
  ExperienceForm,
  type ExperienceValues,
} from "@/components/ExperienceForm";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/experiences/new")({
  head: () => ({
    meta: [
      { title: "Add Interview Experience — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Document your interview rounds, questions and preparation tips to help the next batch of students.",
      },
      {
        property: "og:title",
        content: "Add Interview Experience — Placement Resource Hub",
      },
      {
        property: "og:description",
        content:
          "Share your interview rounds, questions and tips with fellow students.",
      },
    ],
  }),
  component: NewExperience,
});

function NewExperience() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const companies = useQuery(companiesQuery);

  const create = useMutation({
    mutationFn: (values: ExperienceValues) => experiencesApi.create(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience shared. Thank you!");
      navigate({ to: "/experiences" });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save"),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Add Interview Experience"
        description="The more detail you add, the more useful it is for juniors."
      />
      <div className="mt-6">
        <ExperienceForm
          companies={(companies.data ?? []).map((c) => c.company_name)}
          submitting={create.isPending}
          submitLabel="Submit"
          onSubmit={(values) => create.mutate(values)}
          onCancel={() => navigate({ to: "/experiences" })}
        />
      </div>
    </div>
  );
}
