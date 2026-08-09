import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import HeroFuturistic from "@/components/HeroFuturistic";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MessageSquare,
  MessagesSquare,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
  Briefcase,
  Code2,
  Database,
  Brain,
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
          "Search interview experiences, company insights and curated placement resources shared by students.",
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

/* ---------------------------------------------------------
   EXPERIENCE PREVIEW
--------------------------------------------------------- */

function ExperiencePreview({ exp }: { exp: Experience }) {
  return (
    <Link
      to="/experiences/$id"
      params={{ id: exp.id }}
      className="surface-card group block overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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

/* ---------------------------------------------------------
   EMPTY STATE
--------------------------------------------------------- */

function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionTo,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  actionTo?: string;
}) {
  return (
    <div className="surface-card flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>

      <h3 className="font-bold">{title}</h3>

      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {actionText && actionTo && (
        <Button asChild className="mt-5">
          <Link to={actionTo}>
            {actionText}
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   PREPARATION CHECKLIST
--------------------------------------------------------- */

function PreparationChecklist() {
  const [completed, setCompleted] = useState<string[]>([]);

  const tasks = [
    {
      id: "dsa",
      title: "Practice DSA",
      description: "Arrays, strings, linked lists and basic algorithms.",
      icon: Code2,
    },
    {
      id: "dbms",
      title: "Revise DBMS",
      description: "SQL, normalization, keys, joins and transactions.",
      icon: Database,
    },
    {
      id: "interview",
      title: "Read interview experiences",
      description: "Learn what students were actually asked.",
      icon: MessagesSquare,
    },
    {
      id: "resume",
      title: "Prepare your resume",
      description: "Keep your projects and technical skills ready.",
      icon: Briefcase,
    },
  ];

  const progress = Math.round((completed.length / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Target className="size-5 text-primary" />

              <h3 className="font-extrabold">
                Start your placement preparation
              </h3>
            </div>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Complete these basics before your next placement drive.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-2xl font-extrabold text-primary">
              {progress}%
            </p>

            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="divide-y divide-border">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isComplete = completed.includes(task.id);

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => toggleTask(task.id)}
              className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/40 sm:p-5"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isComplete
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <Icon className="size-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`font-semibold ${
                    isComplete ? "line-through opacity-60" : ""
                  }`}
                >
                  {task.title}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {task.description}
                </p>
              </div>

              <CheckCircle2
                className={`size-5 shrink-0 transition-colors ${
                  isComplete
                    ? "text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   HOME
--------------------------------------------------------- */

function Home() {
  const navigate = useNavigate();

  const [term, setTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const companies = useQuery(companiesQuery);
  const experiences = useQuery(experiencesQuery);
  const resources = useQuery(resourcesQuery);

  /* -------------------------------------------------------
     COMPANY STATISTICS
  ------------------------------------------------------- */

  const companyStats = useMemo(
    () =>
      (companies.data ?? []).map((company) => ({
        ...company,

        experiences: (experiences.data ?? []).filter(
          (experience) =>
            experience.company.toLowerCase() ===
            company.company_name.toLowerCase(),
        ).length,
      })),
    [companies.data, experiences.data],
  );

  const topCompanies = [...companyStats]
    .sort((a, b) => b.experiences - a.experiences)
    .slice(0, 6);

  /* -------------------------------------------------------
     SEARCH SUGGESTIONS
  ------------------------------------------------------- */

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

    for (const experience of experiences.data ?? []) {
      if (
        experience.role.toLowerCase().includes(query) &&
        !suggestions.includes(experience.role)
      ) {
        suggestions.push(experience.role);
      }

      if (
        experience.company.toLowerCase().includes(query) &&
        !suggestions.includes(experience.company)
      ) {
        suggestions.push(experience.company);
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

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  const performSearch = (value = term) => {
    const searchValue = value.trim();

    navigate({
      to: "/search",
      search: { q: searchValue },
    });

    setShowSuggestions(false);
  };

  const handlePopularSearch = (value: string) => {
    setTerm(value);
    performSearch(value);
  };

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  const isLoading =
    companies.isLoading ||
    experiences.isLoading ||
    resources.isLoading;

  return (
    <>
      {/* ===================================================
          HERO
      =================================================== */}
          <section className="gradient-hero relative isolate overflow-hidden">
  <HeroFuturistic />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-10 bg-black/25"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -top-24 -right-24 z-10 size-72 rounded-full bg-white/10 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -bottom-32 -left-24 z-10 size-80 rounded-full bg-white/10 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute top-1/2 right-1/4 z-10 size-40 -translate-y-1/2 rounded-full bg-white/5 blur-2xl"
  />

  <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
    <div className="max-w-4xl text-primary-foreground">

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold shadow-sm backdrop-blur-md transition-transform duration-300 hover:scale-105">
        <Sparkles className="size-3.5" />
        <span>Student-powered placement preparation</span>
        <Zap className="size-3.5" />
      </div>

      <h1 className="text-4xl leading-[1.06] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
        Prepare for the company
        <br className="hidden sm:block" />
        <span className="text-white/75">
          {" "}you want to join.
        </span>
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
        Find real interview experiences, company insights,
        coding sheets and placement resources — all in one
        searchable hub.
      </p>

      <form
        className="relative mt-8 w-full max-w-2xl"
        onSubmit={(event) => {
          event.preventDefault();
          performSearch();
        }}
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={term}
              onChange={(event) => {
                setTerm(event.target.value);
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

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Link to="/notes">
            <BookOpen className="mr-2 size-4" />
            Engineering Notes
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs font-semibold text-white/60">
          Popular searches
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            "Google",
            "Amazon",
            "Microsoft",
            "TCS",
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
      {/* ===================================================
          STATISTICS
      =================================================== */}

      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6">
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
                (experiences.data ?? []).map(
                  (experience) => experience.student_name,
                ),
              ).size
            }
            icon={Users}
          />
        </div>
      </section>

      {/* ===================================================
          QUICK PREPARATION
      ================================================*/}
     <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-wider text-primary uppercase">
            Start here
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
            What are you preparing for?
          </h2>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Jump directly into the area you want to improve.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/resources"
            className="surface-card group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Code2 className="size-5" />
            </div>

            <h3 className="font-bold">DSA & Coding</h3>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Practice coding questions and interview problems.
            </p>

            <span className="mt-4 inline-flex items-center text-xs font-bold text-primary">
              Start practicing
              <ArrowRight className="ml-1 size-3.5" />
            </span>
          </Link>

          <Link
            to="/resources"
            className="surface-card group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Brain className="size-5" />
            </div>

            <h3 className="font-bold">Aptitude</h3>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Improve quantitative, logical and verbal ability.
            </p>

            <span className="mt-4 inline-flex items-center text-xs font-bold text-primary">
              Find resources
              <ArrowRight className="ml-1 size-3.5" />
            </span>
          </Link>

          <Link
            to="/experiences"
            className="surface-card group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <MessagesSquare className="size-5" />
            </div>

            <h3 className="font-bold">Interview Prep</h3>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Learn from students who already attended interviews.
            </p>

            <span className="mt-4 inline-flex items-center text-xs font-bold text-primary">
              Read experiences
              <ArrowRight className="ml-1 size-3.5" />
            </span>
          </Link>

          <Link
            to="/companies"
            className="surface-card group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Building2 className="size-5" />
            </div>

            <h3 className="font-bold">Company Prep</h3>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Explore hiring companies and interview patterns.
            </p>

            <span className="mt-4 inline-flex items-center text-xs font-bold text-primary">
              Explore companies
              <ArrowRight className="ml-1 size-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* ===================================================
          PREPARATION CHECKLIST
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <PreparationChecklist />

          <div className="surface-card flex flex-col justify-between overflow-hidden p-6">
            <div>
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="size-6" />
              </div>

              <h3 className="text-xl font-extrabold">
                Build your placement profile
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Track your preparation, explore companies and
                discover resources that match your placement goals.
              </p>
            </div>

            <Button asChild className="mt-8 w-full">
              <Link to="/dashboard">
                Open my dashboard
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===================================================
          LATEST EXPERIENCES
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-wider text-primary uppercase">
              Community
            </p>

            <h2 className="mt-1 text-2xl font-extrabold">
              Latest interview experiences
            </h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Fresh, first-hand accounts from recent placement drives.
            </p>
          </div>

          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/experiences">
              View all
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6">
          {experiences.isLoading ? (
            <CardSkeletonGrid count={3} />
          ) : experiences.data?.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {experiences.data.slice(0, 3).map((experience) => (
                <ExperiencePreview
                  key={experience.id}
                  exp={experience}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No interview experiences yet"
              description="Be one of the first students to share a real placement experience with the community."
              actionText="Share your experience"
              actionTo="/experiences/new"
            />
          )}
        </div>
      </section>

      {/* ===================================================
          POPULAR COMPANIES
      =================================================== */}
     <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-primary uppercase">
                Hiring
              </p>

              <h2 className="mt-1 text-2xl font-extrabold">
                Popular companies
              </h2>

              <p className="mt-1.5 text-sm text-muted-foreground">
                Companies students in this hub are preparing for.
              </p>
            </div>

            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/companies">
                View all
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-6">
            {companies.isLoading ? (
              <CardSkeletonGrid count={6} />
            ) : topCompanies.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topCompanies.map((company) => (
                  <Link
                    key={company.id}
                    to="/companies"
                    className="surface-card hover-lift flex items-center justify-between gap-3 p-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold">
                        {company.company_name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {company.role}
                      </p>
                    </div>

                    <Chip>
                      {company.experiences} experiences
                    </Chip>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Building2}
                title="Companies are coming soon"
                description="The company directory will appear here as companies are added to the hub."
                actionText="Explore companies"
                actionTo="/companies"
              />
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          TRENDING PREPARATION
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-wider text-primary uppercase">
            Trending
          </p>

          <h2 className="mt-1 text-2xl font-extrabold">
            Popular preparation topics
          </h2>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Quickly find the topics students commonly prepare for.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            "DSA",
            "SQL",
            "DBMS",
            "OOP",
            "Operating Systems",
            "Computer Networks",
            "Aptitude",
            "HR Interview",
            "Resume",
            "Projects",
          ].map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handlePopularSearch(topic)}
              className="surface-card flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <TrendingUp className="size-4 text-primary" />
              {topic}
            </button>
          ))}
        </div>
      </section>

      {/* ===================================================
          RECENT RESOURCES
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-wider text-primary uppercase">
              Learn
            </p>

            <h2 className="mt-1 text-2xl font-extrabold">
              Recent resources
            </h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Sheets, notes and links curated by the community.
            </p>
          </div>

          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/resources">
              View all
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6">
          {resources.isLoading ? (
            <CardSkeletonGrid count={3} />
          ) : resources.data?.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resources.data.slice(0, 6).map((resource) => (
                <a
                  key={resource.id}
                  href={resource.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="surface-card hover-lift group block p-5"
                >
                  <div className="flex items-center gap-2">
                    <Chip>{resource.category}</Chip>
                    <Chip>{resource.type}</Chip>
                  </div>

                  <h3 className="mt-3 font-bold transition-colors group-hover:text-primary">
                    {resource.title}
                  </h3>

                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {resource.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    Open resource
                    <ExternalLink className="size-3.5" />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No resources yet"
              description="Be the first to contribute a useful placement resource."
              actionText="Add a resource"
              actionTo="/resources/new"
            />
          )}
        </div>
      </section>

      {/* ===================================================
          FINAL CTA
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="gradient-hero overflow-hidden rounded-3xl p-8 text-primary-foreground sm:p-12">
          <div className="max-w-2xl">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles className="size-6" />
            </div>

            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Have an interview experience to share?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
              Help the next student prepare better by sharing the
              questions, rounds and lessons from your placement journey.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="secondary"
                size="lg"
              >
                <Link to="/experiences/new">
                  Share experience
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/resources/new">
                  Add a resource
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
               }
