import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  companiesApi,
  companiesQuery,
  experiencesQuery,
  resourcesQuery,
  type Company,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/Field";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import {
  CardSkeletonGrid,
  Chip,
  EmptyState,
  PageHeader,
} from "@/components/ui-kit";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Companies — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Browse every company students have interviewed with, along with the number of shared experiences and resources.",
      },
      { property: "og:title", content: "Companies — Placement Resource Hub" },
      {
        property: "og:description",
        content:
          "Browse companies with counts of shared interview experiences and resources.",
      },
    ],
  }),
  component: CompaniesPage,
});

function CompanyDialog({
  company,
  trigger,
}: {
  company?: Company;
  trigger: React.ReactNode;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(company?.company_name ?? "");
  const [role, setRole] = useState(company?.role ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { company_name: name.trim(), role: role.trim() };
      return company
        ? companiesApi.update(company.id, payload)
        : companiesApi.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
      toast.success(company ? "Company updated" : "Company added");
      setOpen(false);
      if (!company) {
        setName("");
        setRole("");
      }
    },
    onError: (e: Error) => toast.error(e.message || "Something went wrong"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{company ? "Edit company" : "Add company"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Company Name" error={errors["name"]} required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Google"
            />
          </Field>
          <Field label="Role" error={errors["role"]} required>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={() => {
              const next: Record<string, string> = {};
              if (name.trim().length < 2) next["name"] = "Company name is required";
              if (role.trim().length < 2) next["role"] = "Role is required";
              setErrors(next);
              if (Object.keys(next).length) return;
              mutation.mutate();
            }}
          >
            {mutation.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompaniesPage() {
  const qc = useQueryClient();
  const companies = useQuery(companiesQuery);
  const experiences = useQuery(experiencesQuery);
  const resources = useQuery(resourcesQuery);
  const [term, setTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const roles = useMemo(
    () => Array.from(new Set((companies.data ?? []).map((c) => c.role))).sort(),
    [companies.data],
  );

  const remove = useMutation({
    mutationFn: companiesApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company deleted");
    },
    onError: (e: Error) => toast.error(e.message || "Delete failed"),
  });

  const rows = (companies.data ?? [])
    .filter(
      (c) =>
        c.company_name.toLowerCase().includes(term.toLowerCase()) ||
        c.role.toLowerCase().includes(term.toLowerCase()),
    )
    .filter((c) => roleFilter === "all" || c.role === roleFilter)
    .map((c) => ({
      ...c,
      experienceCount: (experiences.data ?? []).filter(
        (e) => e.company.toLowerCase() === c.company_name.toLowerCase(),
      ).length,
      resourceCount: (resources.data ?? []).filter(
        (r) => (r.company ?? "").toLowerCase() === c.company_name.toLowerCase(),
      ).length,
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Companies"
        description="Every company students in this hub have interviewed with."
        action={
          <CompanyDialog
            trigger={
              <Button>
                <Plus className="size-4" /> Add Company
              </Button>
            }
          />
        }
      />

      <div className="surface-card mt-6 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search company or role…"
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        {companies.isLoading ? (
          <CardSkeletonGrid />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies found"
            description="Try a different search, or add the first company to get started."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((c) => (
              <div key={c.id} className="surface-card hover-lift p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{c.company_name}</h3>
                    <p className="text-sm text-muted-foreground">{c.role}</p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <Building2 className="size-5" />
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Chip>{c.experienceCount} experiences</Chip>
                  <Chip>{c.resourceCount} resources</Chip>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <a href={`/search?q=${encodeURIComponent(c.company_name)}`}>
                      View Details
                    </a>
                  </Button>
                  <CompanyDialog
                    company={c}
                    trigger={
                      <Button size="sm" variant="outline">
                        <Pencil className="size-4" />
                      </Button>
                    }
                  />
                  <ConfirmDelete
                    title={`Delete ${c.company_name}?`}
                    description="This removes the company entry. Experiences and resources stay untouched."
                    onConfirm={() => remove.mutateAsync(c.id)}
                  >
                    <Button size="sm" variant="outline">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </ConfirmDelete>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
