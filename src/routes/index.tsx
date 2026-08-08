import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  MessagesSquare,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
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
      {
        title: "Placement Resource Hub — Interview Prep, All in One Place",
      },
      {
        name: "description",
        content:
          "Stop hunting through WhatsApp groups. Search interview experiences, company insights and curated placement resources shared by students.",
      },
      {
        property: "og:title",
        content:
          "Placement Resource Hub — Interview Prep, All in One Place",
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

/* -------------------------------------------------------------------------- */
/* Experience Card                                                            */
/* -------------------------------------------------------------------------- */

function ExperiencePreview({ exp }: { exp: Experience }) {
  return (
    <Link
      to="/experiences/$id"
      params={{ id: exp.id }}
      className="group surface-card hover-lift block overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold transition-colors group-hover:text-primary">
            {exp.company}
          </h3>

          <p className="mt-0.5 text-sm text-muted-foreground">
            {exp.role}
          </p>
        </div>

        <DifficultyBadge value={exp.difficulty} />
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {exp.summary}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Users className="size-3.5" />
          {exp.student_name}
        </p>

        <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-70 transition-all group-hover:translate-x-1 group-hover:opacity-100">
          Read
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Home                                                                       */
/* -------------------------------------------------------------------------- */

function Home() {
  const navigate = useNavigate();

  const [term, setTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const companies = useQuery(companiesQuery);
  const experiences = useQuery(experiencesQuery);
  const resources = useQuery(resourcesQuery);

  /* ------------------------------------------------------------------------ */
  /* Company statistics                                                       */
  /* ------------------------------------------------------------------------ */

  const companyStats = useMemo(
    () =>
      (companies.data ?? []).map((c) => ({
        ...c,
        experiences: (experiences.data ?? []).filter(
          (e) =>
            e.company.toLowerCase() === c.company_name.toLowerCase(),
        ).length,
      })),
    [companies.data, experiences.data],
  );

  const topCompanies = [...companyStats]
    .sort((a, b) => b.experiences - a.experiences)
    .slice(0, 6);

  /* ------------------------------------------------------------------------ */
  /* Search suggestions                                                       */
  /* ------------------------------------------------------------------------ */

  const searchSuggestions = useMemo(() => {
    const query = term.trim().toLowerCase();

    if (!query) return [];

    const suggestions: string[] = [];

    for (const company of companies.data ?? []) {
      if (
        company.company_name.toLowerCase().includes(query) &&
        !suggestions.includes(company.company_name)
      ) {
        suggestions.push(company.company_name);
      }
    }

    for (const exp of experiences.data ?? []) {
      if (
        exp.role.toLowerCase().includes(query) &&
        !suggestions.includes(exp.role)
      ) {
        suggestions.push(exp.role);
      }

      if (
        exp.company.toLowerCase().includes(query) &&
        !suggestions.includes(exp.company)
      ) {
        suggestions.push(exp.company);
      }
    }

    for (const resource of resources.data ?? []) {
      if (
        resource.title.toLowerCase().includes(query) &&
        !suggestions.includes(resource.title)
      ) {
        suggestions.push(resource.title);
      }
    }

    return suggestions.slice(0, 6);
  }, [term, companies.data, experiences.data, resources.data]);

  /* ------------------------------------------------------------------------ */
  /* Search                                                                   */
  /* ------------------------------------------------------------------------ */

  const performSearch = (value = term) => {
    navigate({
      to: "/search",
      search: {
        q: value.trim(),
      },
    });

    setShowSuggestions(false);
  };

  const handlePopularSearch = (value: string) => {
    setTerm(value);
    performSearch(value);
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  const isLoading =
    companies.isLoading ||
    experiences.isLoading ||
    resources.isLoading;

  return (
    <>
      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <section className="gradient-hero relative overflow-hidden">
        {/* Decorative background elements */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-white/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-1/4 size-40 -translate-y-1/2 rounded-full bg-white/5 blur-2xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="max-w-4xl text-primary-foreground">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold shadow-sm backdrop-blur-md transition-transform duration-300 hover:scale-105">
              <Sparkles className="size-3.5" />

              <span>Prepare smarter. Get placed faster.</span>

              <Zap className="size-3.5" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl leading-[1.06] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Every placement resource,
              <br className="hidden sm:block" />
              <span className="text-white/75">
                {" "}
                in one searchable hub.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Interview experiences, coding sheets, aptitude material and
              senior notes — all brought together so you can search once and
              prepare faster.
            </p>

            {/* ============================================================ */}
            {/* SEARCH                                                         */}
            {/* ============================================================ */}

            <form
              className="relative mt-8 w-full max-w-2xl"
              onSubmit={(e) => {
                e.preventDefault();
                performSearch();
              }}
            >
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={term}
                    onChange={(e) => {
                      setTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search company, role, question or resource..."
                    className="h-13 border-0 bg-card pl-11 pr-10 text-foreground shadow-xl ring-1 ring-black/5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Search the hub"
                  />

                  {term && (
                    <button
                      type="button"
                      onClick={() => {
                        setTerm("");
                        setShowSuggestions(false);
                      }}
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <X className="size-4" />
                    </button>
                  )}

                  {/* Search suggestions */}
                  {showSuggestions &&
                    term.trim() &&
                    searchSuggestions.length > 0 && (
                      <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card p-1.5 text-foreground shadow-2xl">
                        {searchSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              setTerm(suggestion);
                              performSearch(suggestion);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                          >
                            <Search className="size-4 text-muted-foreground" />

                            <span className="truncate font-medium">
                              {suggestion}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="secondary"
                  className="h-13 px-7 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Search className="mr-2 size-4" />
                  Search
                </Button>
              </div>
            </form>

            {/* Popular searches */}
            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold text-white/60">
                Popular searches
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Google",
                  "Amazon",
                  "Microsoft",
                  "DSA",
                  "Aptitude",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePopularSearch(item)}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Link to="/experiences">
                  Browse experiences
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 hover:text-primary-foreground"
              >
                <Link to="/experiences/new">
                  Share your experience
                </Link>
              </Button>
            </div>

            {/* Small trust line */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                Student powered
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                Free resources
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                Real experiences
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* STATS                                                               */}
      {/* ================================================================== */}

      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="transition-transform duration-300 hover:-translate-y-1">
            <StatCard
              label="Companies"
              value={companies.data?.length ?? 0}
              icon={Building2}
            />
          </div>

          <div className="transition-transform duration-300 hover:-translate-y-1">
            <StatCard
              label="Experiences"
              value={experiences.data?.length ?? 0}
              icon={MessagesSquare}
            />
          </div>

          <div className="transition-transform duration-300 hover:-translate-y-1">
            <StatCard
              label="Resources"
              value={resources.data?.length ?? 0}
              icon={BookOpen}
            />
          </div>

          <div className="transition-transform duration-300 hover:-translate-y-1">
            <StatCard
              label="Contributors"
              value={
                new Set(
                  (experiences.data ?? []).map(
                    (e) => e.student_name,
                  ),
                ).size
              }
              icon={Users}
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* QUICK CATEGORIES                                                    */}
      {/* ================================================================== */}

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-wider text-primary uppercase">
            Explore
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
            Everything you need for placement prep
          </h2>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Jump directly to the preparation material you're looking for.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Experiences */}
          <Link
            to="/experiences"
            className="group surface-card relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute -top-8 -right-8 size-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <MessagesSquare className="size-5" />
              </div>

              <h3 className="font-bold">Interview Experiences</h3>

              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Learn from students who already attended placement drives.
              </p>

              <span className="mt-4 inline-flex items-center text-xs font-bold text-primary">
                Explore
                <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Resources */}
          <Link
            to="/resources"
            className="group surface-card relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute -top-8 -right-8 size-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <BookOpen className="size-5" />
              </div>

              <h3 className="font-bold">Study Resources</h3>

              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Find coding sheets, notes, aptitude material and more.
              </p>

              <span className="mt-4 inline-flex items-center text-xs font-bold text-primary">
                Browse
                <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Companies */}
          <Link
            to="/companies"
            className="group surface-card relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute -top-8 -right-8 size-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="mb-4 flex
