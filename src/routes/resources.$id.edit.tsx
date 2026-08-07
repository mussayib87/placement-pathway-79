import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesQuery, resourcesApi } from "@/lib/api";
import { ResourceForm, type ResourceValues } from "@/components/ResourceForm";
import { PageHeader, Spinner } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/resources/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Resource — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Update the title, category, company tag, description or link of a shared preparation resource.",
      },
      {
        property: "og:title",
        content: "Edit Resource — Placement Resource Hub",
      },
      {
        property: "og:description",
        content: "Update a shared preparation resource.",
      },
    ],
  }),
  component: EditResource,
});

function EditResource() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const companies = useQuery(companiesQuery);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resources", id],
    queryFn: () => resourcesApi.get(id),
  });

  const update = useMutation({
    mutationFn: (values: ResourceValues) => resourcesApi.update(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Resource updated");
      navigate({ to: "/resources" });
    },
    onError: (e: Error) => toast.error(e.message || "Could not update"),
  });

  if (isLoading) return <Spinner label="Loading resource…" />;
  if (isError || !data)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Resource not found</h1>
        <Button asChild className="mt-4">
          <Link to="/resources">Back to resources</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader title="Edit Resource" description={data.title} />
      <div className="mt-6">
        <ResourceForm
          initial={data}
          companies={(companies.data ?? []).map((c) => c.company_name)}
          submitting={update.isPending}
          submitLabel="Save changes"
          onSubmit={(values) => update.mutate(values)}
          onCancel={() => navigate({ to: "/resources" })}
        />
      </div>
    </div>
  );
}
