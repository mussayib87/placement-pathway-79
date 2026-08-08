          import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ExternalLink,
  MessagesSquare,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import {
  companiesQuery,
  experiencesQuery,
  resourcesQuery,
  type Experience,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardSkeletonGrid,
  Chip,
  DifficultyBadge,
  StatCard,
} from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Placement Resource Hub — Interview Prep, All in One Place" },
      {
        name: "description",
        content:
          "Stop hunting through WhatsApp groups. Search interview experiences, company insights and curated placement resources shared by students.",
      },
      {
        property: "og:title",
        content: "Placement Resource Hub — Interview Prep, All in One Place",
      },
      {
        property: "og:description",
        content:
          "Search interview experiences, company insights and curated placement resources shared by students.",
      },
    ],
  }),
  component: Home,
});

function ExperiencePreview({ exp }: { exp: Experience }) {
  return (
    <Link
      to="/experiences/$id"
      params={{ id: exp.id }}
      className="surface-card hover-lift block p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">{exp.company}</h3>
          <p className="text-sm text-muted-foreground">{exp.role}</p>
        </div>
        <DifficultyBadge value={exp.difficulty} />
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {exp.summary}
      </p>
      <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Users className="size-3.5" /> {exp.student_name}
      </p>
    </Link>
  );
}

function Home() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const companies = useQuery(companiesQuery);
  const experiences = useQuery(experiencesQuery);
  const resources = useQuery(resourcesQuery);

  const companyStats = (companies.data ?? []).map((c) => ({
    ...c,
    experiences: (experiences.data ?? []).filter(
      (e) => e.company.toLowerCase() === c.company_name.toLowerCase(),
    ).length,
  }));

  const topCompanies = [...companyStats]
    .sort((a, b) => b.experiences - a.experiences)
    .slice(0, 6);

  return (
    <>
      <section className="gradient-hero relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <Sparkles className="size-3.5" />
              Prepare smarter. Get placed faster.
            </span>

            <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">
              Every placement resource,
              <br />
              in one searchable hub.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Interview experiences, coding sheets, aptitude material and senior
              notes are scattered across WhatsApp, Telegram and Drive links. This
              hub brings them together so you can search once and prepare
              faster.
            </p>

            <form
              className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/search", search: { q: term } });
              }}
            >
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search company, role, question or resource…"
                  className="h-12 border-transparent bg-card pl-9 text-foreground"
                  aria-label="Search the hub"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="h-12"
              >
                Search
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/experiences">Browse experiences</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
              >
                <Link to="/experiences/new">Share yours</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Companies"
            value={companies.data?.length ?? 0}
            icon={Building2}
          />

          <StatCard
            label="Experiences"
            value={experiences.data?.length ?? 0}
            icon={MessagesSquare}
          />

          <StatCard
            label="Resources"
            value={resources.data?.length ?? 0}
            icon={BookOpen}
          />

          <StatCard
            label="Contributors"
            value={
              new Set(
                (experiences.data ?? []).map((e) => e.student_name),
              ).size
            }
            icon={Users}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">
              Latest interview experiences
            </h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Fresh, first-hand accounts from recent drives.
            </p>
          </div>

          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/experiences">
              View all <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6">
          {experiences.isLoading ? (
            <CardSkeletonGrid count={3} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(experiences.data ?? []).slice(0, 3).map((exp) => (
                <ExperiencePreview key={exp.id} exp={exp} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold">Popular companies</h2>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Where students in this hub interviewed the most.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topCompanies.map((c) => (
              <Link
                key={c.id}
                to="/companies"
                className="surface-card hover-lift flex items-center justify-between gap-3 p-5"
              >
                <div>
                  <p className="font-bold">{c.company_name}</p>
                  <p className="text-sm text-muted-foreground">{c.role}</p>
                </div>

                <Chip>{c.experiences} experiences</Chip>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">Recent resources</h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Sheets, notes and links curated by the community.
            </p>
          </div>

          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/resources">
              View all <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6">
          {resources.isLoading ? (
            <CardSkeletonGrid count={3} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(resources.data ?? []).slice(0, 6).map((r) => (
                <a
                  key={r.id}
                  href={r.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="surface-card hover-lift block p-5"
                >
                  <div className="flex items-center gap-2">
                    <Chip>{r.category}</Chip>
                    <Chip>{r.type}</Chip>
                  </div>

                  <h3 className="mt-3 font-bold">{r.title}</h3>

                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {r.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    Open resource <ExternalLink className="size-3.5" />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
        }  
