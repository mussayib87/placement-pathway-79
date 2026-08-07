import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Building2,
  MessagesSquare,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { companiesQuery, experiencesQuery, resourcesQuery } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  CardSkeletonGrid,
  Chip,
  DifficultyBadge,
  PageHeader,
  StatCard,
} from "@/components/ui-kit";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Track total companies, interview experiences, resources, recent uploads and top hiring companies at a glance.",
      },
      { property: "og:title", content: "Dashboard — Placement Resource Hub" },
      {
        property: "og:description",
        content:
          "Track companies, experiences, resources and recent uploads at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const companies = useQuery(companiesQuery);
  const experiences = useQuery(experiencesQuery);
  const resources = useQuery(resourcesQuery);

  const loading =
    companies.isLoading || experiences.isLoading || resources.isLoading;

  const topCompanies = [...(companies.data ?? [])]
    .map((c) => ({
      ...c,
      count: (experiences.data ?? []).filter(
        (e) => e.company.toLowerCase() === c.company_name.toLowerCase(),
      ).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Dashboard"
        description="A quick pulse on everything shared in the hub."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/experiences/new">
                <Plus className="size-4" /> Add Experience
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/resources/new">
                <Plus className="size-4" /> Add Resource
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Companies"
          value={companies.data?.length ?? 0}
          icon={Building2}
        />
        <StatCard
          label="Interview Experiences"
          value={experiences.data?.length ?? 0}
          icon={MessagesSquare}
        />
        <StatCard
          label="Total Resources"
          value={resources.data?.length ?? 0}
          icon={BookOpen}
        />
        <StatCard
          label="Contributors"
          value={new Set((experiences.data ?? []).map((e) => e.student_name)).size}
          icon={Users}
        />
      </div>

      {loading ? (
        <div className="mt-8">
          <CardSkeletonGrid count={3} />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="surface-card p-6 lg:col-span-2">
            <h2 className="text-lg font-bold">Recent uploads</h2>
            <ul className="mt-4 divide-y divide-border">
              {[
                ...(experiences.data ?? []).slice(0, 4).map((e) => ({
                  id: e.id,
                  kind: "Experience" as const,
                  title: `${e.company} · ${e.role}`,
                  meta: e.student_name,
                  date: e.created_at,
                })),
                ...(resources.data ?? []).slice(0, 4).map((r) => ({
                  id: r.id,
                  kind: "Resource" as const,
                  title: r.title,
                  meta: r.category,
                  date: r.created_at,
                })),
              ]
                .sort((a, b) => (a.date < b.date ? 1 : -1))
                .slice(0, 6)
                .map((item) => (
                  <li
                    key={`${item.kind}-${item.id}`}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.meta} ·{" "}
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Chip>{item.kind}</Chip>
                  </li>
                ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="surface-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <TrendingUp className="size-4 text-primary" /> Top companies
              </h2>
              <ul className="mt-4 space-y-3">
                {topCompanies.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm font-medium">{c.company_name}</span>
                    <Chip>{c.count}</Chip>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card p-6">
              <h2 className="text-lg font-bold">Quick actions</h2>
              <div className="mt-4 grid gap-2">
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/companies">
                    <Building2 className="size-4" /> Manage companies
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/experiences">
                    <MessagesSquare className="size-4" /> All experiences
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/resources">
                    <BookOpen className="size-4" /> All resources
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link to="/search" search={{ q: "" }}>
                    <Search className="size-4" /> Global search
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(experiences.data ?? []).slice(0, 3).map((e) => (
          <Link
            key={e.id}
            to="/experiences/$id"
            params={{ id: e.id }}
            className="surface-card hover-lift p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{e.company}</p>
                <p className="text-sm text-muted-foreground">{e.role}</p>
              </div>
              <DifficultyBadge value={e.difficulty} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {e.summary}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
