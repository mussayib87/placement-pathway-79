import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  ExternalLink,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  CATEGORIES,
  RESOURCE_TYPES,
  resourcesApi,
  resourcesQuery,
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
  EmptyState,
  PageHeader,
} from "@/components/ui-kit";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: "Resources — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Curated DSA sheets, aptitude material, system design guides, PDFs and notes for placement preparation.",
      },
      { property: "og:title", content: "Resources — Placement Resource Hub" },
      {
        property: "og:description",
        content:
          "DSA sheets, aptitude material, system design guides, PDFs and notes in one place.",
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(resourcesQuery);
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const companies = useMemo(
    () =>
      Array.from(new Set((data ?? []).map((r) => r.company).filter(Boolean))),
    [data],
  );

  const remove = useMutation({
    mutationFn: resourcesApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Resource deleted");
    },
    onError: (e: Error) => toast.error(e.message || "Delete failed"),
  });

  const rows = (data ?? [])
    .filter((r) => {
      const q = term.toLowerCase();
      return (
        !q ||
        [r.title, r.company, r.category, r.description, r.type]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    })
    .filter((r) => category === "all" || r.category === category)
    .filter((r) => type === "all" || r.type === type)
    .sort((a, b) =>
      sort === "newest"
        ? a.created_at < b.created_at
          ? 1
          : -1
        : a.created_at > b.created_at
          ? 1
          : -1,
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Resources"
        description={`Curated links, sheets and notes${companies.length ? ` — including company-specific material.` : ""}`}
        action={
          <Button asChild>
            <Link to="/resources/new">
              <Plus className="size-4" /> Add Resource
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
            placeholder="Search title, company or description…"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {RESOURCE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
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

      <div className="mt-6">
        {isLoading ? (
          <CardSkeletonGrid />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No resources found"
            description="Adjust your filters, or add the resource that helped you most."
            actionLabel="Add Resource"
            actionTo="/resources/new"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r) => (
              <article key={r.id} className="surface-card hover-lift flex flex-col p-5">
                <div className="flex flex-wrap gap-2">
                  <Chip>{r.category}</Chip>
                  <Chip>{r.type}</Chip>
                  {r.company && <Chip>{r.company}</Chip>}
                </div>
                <h2 className="mt-3 text-lg font-bold">{r.title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {r.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <a href={r.link} target="_blank" rel="noreferrer noopener">
                      Open <ExternalLink className="size-4" />
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/resources/$id/edit" params={{ id: r.id }}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <ConfirmDelete
                    title={`Delete "${r.title}"?`}
                    description="This permanently removes the resource from the hub."
                    onConfirm={() => remove.mutateAsync(r.id)}
                  >
                    <Button size="sm" variant="outline">
                      <Trash2 className="size-4 text-destructive" />
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
