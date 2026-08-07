import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Building2, BookOpen, MessagesSquare, Search as SearchIcon } from "lucide-react";
import {
  companiesQuery,
  experiencesQuery,
  resourcesQuery,
} from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Chip, DifficultyBadge, EmptyState, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s['q'] === "string" ? (s['q'] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Search — Placement Resource Hub" },
      {
        name: "description",
        content:
          "Search across every interview experience, preparation resource and company in one place.",
      },
      { property: "og:title", content: "Search — Placement Resource Hub" },
      {
        property: "og:description",
        content:
          "One search box across experiences, resources and companies.",
      },
    ],
  }),
  component: SearchPage,
});

const match = (q: string, parts: (string | null | undefined)[]) =>
  parts.filter(Boolean).some((p) => String(p).toLowerCase().includes(q));

function SearchPage() {
  const { q: initial } = Route.useSearch();
  const [term, setTerm] = useState(initial);
  const q = term.trim().toLowerCase();

  const experiences = useQuery(experiencesQuery);
  const resources = useQuery(resourcesQuery);
  const companies = useQuery(companiesQuery);

  const expHits = q
    ? (experiences.data ?? []).filter((e) =>
        match(q, [
          e.company,
          e.role,
          e.student_name,
          e.summary,
          e.tips,
          e.technical_questions,
          e.hr_questions,
          e.coding_questions,
        ]),
      )
    : [];
  const resHits = q
    ? (resources.data ?? []).filter((r) =>
        match(q, [r.title, r.company, r.category, r.description, r.type]),
      )
    : [];
  const compHits = q
    ? (companies.data ?? []).filter((c) => match(q, [c.company_name, c.role]))
    : [];

  const total = expHits.length + resHits.length + compHits.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Global Search"
        description="One box across experiences, resources and companies."
      />

      <div className="relative mt-6">
        <SearchIcon className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Try “Google”, “DSA”, “system design”, “SDE”…"
          className="h-14 pl-12 text-base"
        />
      </div>

      {!q ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Start typing to search the entire hub.
        </p>
      ) : total === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={SearchIcon}
            title={`No matches for “${term}”`}
            description="Try a shorter keyword, a company name or a topic like DSA or aptitude."
          />
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "result" : "results"} for “{term}”
          </p>

          {expHits.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <MessagesSquare className="size-5 text-primary" /> Experiences (
                {expHits.length})
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {expHits.map((e) => (
                  <Link
                    key={e.id}
                    to="/experiences/$id"
                    params={{ id: e.id }}
                    className="surface-card hover-lift block p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{e.company}</p>
                        <p className="text-sm text-muted-foreground">{e.role}</p>
                      </div>
                      <DifficultyBadge value={e.difficulty} />
                    </div>
                    {e.summary && (
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {e.summary}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {resHits.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <BookOpen className="size-5 text-primary" /> Resources (
                {resHits.length})
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {resHits.map((r) => (
                  <div key={r.id} className="surface-card p-5">
                    <div className="flex flex-wrap gap-2">
                      <Chip>{r.category}</Chip>
                      <Chip>{r.type}</Chip>
                    </div>
                    <p className="mt-3 font-bold">{r.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {r.description}
                    </p>
                    <Button asChild size="sm" className="mt-4">
                      <a href={r.link} target="_blank" rel="noreferrer noopener">
                        Open resource
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {compHits.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Building2 className="size-5 text-primary" /> Companies (
                {compHits.length})
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {compHits.map((c) => (
                  <div key={c.id} className="surface-card p-5">
                    <p className="font-bold">{c.company_name}</p>
                    <p className="text-sm text-muted-foreground">{c.role}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
