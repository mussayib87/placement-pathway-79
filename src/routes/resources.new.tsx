import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesQuery, resourcesApi } from "@/lib/api";
import { ResourceForm, type ResourceValues } from "@/components/ResourceForm";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/resources/new")({
  head: () => ({
    meta: [
      { title: "Add Resource — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Share a DSA sheet, aptitude PDF, system design guide or notes with the placement community.",
      },
      { property: "og:title", content: "Add Resource — Placement Resource Hub" },
      {
        property: "og:description",
        content: "Share a sheet, PDF, guide or notes with the community.",
      },
    ],
  }),
  component: NewResource,
});

function NewResource() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const companies = useQuery(companiesQuery);

  const create = useMutation({
    mutationFn: (values: ResourceValues) => resourcesApi.create(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Resource added");
      navigate({ to: "/resources" });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save"),
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Add Resource"
        description="Link the sheets, notes and guides that actually helped you."
      />
      <div className="mt-6">
        <ResourceForm
          companies={(companies.data ?? []).map((c) => c.company_name)}
          submitting={create.isPending}
          submitLabel="Add resource"
          onSubmit={(values) => create.mutate(values)}
          onCancel={() => navigate({ to: "/resources" })}
        />
      </div>
    </div>
  );
}
