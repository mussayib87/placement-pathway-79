import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

import {
  companiesQuery,
  experiencesQuery,
  resourcesQuery,
} from "@/lib/api";

import { Button } from "@/components/ui/button";

import {
  Chip,
  DifficultyBadge,
  EmptyState,
} from "@/components/ui-kit";

export const Route = createFileRoute("/companies/$id")({
  component: CompanyDetailsPage,
});

function CompanyDetailsPage() {
  const { id } = Route.useParams();

  const companies = useQuery(companiesQuery);
  const experiences = useQuery(experiencesQuery);
  const resources = useQuery(resourcesQuery);

  const company = (companies.data ?? []).find(
    (c) => String(c.id) === String(id),
  );

  if (companies.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-muted-foreground">
          Loading company...
        </p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <EmptyState
          icon={Building2}
          title="Company not found"
          description="The company you are looking for does not exist."
        />

        <div className="mt-6">
          <Button asChild>
            <Link to="/companies">
              <ArrowLeft className="mr-2 size-4" />
              Back to Companies
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const companyExperiences = (experiences.data ?? []).filter(
    (e) =>
      e.company.toLowerCase() ===
      company.company_name.toLowerCase(),
  );

  const companyResources = (resources.data ?? []).filter(
    (r) =>
      (r.company ?? "").toLowerCase() ===
      company.company_name.toLowerCase(),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      <Button asChild variant="outline" className="mb-6">
        <Link to="/companies">
          <ArrowLeft className="mr-2 size-4" />
          Back to Companies
        </Link>
      </Button>

      {/* Company information */}
      <div className="surface-card p-6 sm:p-8">
        <div className="flex items-start gap-4">

          <div className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <Building2 className="size-7" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {company.company_name}
            </h1>

            <p className="mt-1 text-muted-foreground">
              {company.role}
            </p>
          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Chip>
            {companyExperiences.length} experiences
          </Chip>

          <Chip>
            {companyResources.length} resources
          </Chip>
        </div>
      </div>

      {/* Interview Experiences */}
      <section className="mt-10">

        <div className="mb-5">
          <h2 className="text-2xl font-extrabold">
            Interview Experiences
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Experiences shared by students who interviewed at{" "}
            {company.company_name}.
          </p>
        </div>

        {companyExperiences.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No experiences yet"
            description="No interview experiences have been shared for this company."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {companyExperiences.map((exp) => (
              <Link
                key={exp.id}
                to="/experiences/$id"
                params={{ id: exp.id }}
                className="surface-card hover-lift block p-5"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h3 className="font-bold">
                      {exp.role}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {exp.student_name}
                    </p>
                  </div>

                  <DifficultyBadge value={exp.difficulty} />

                </div>

                <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                  {exp.summary}
                </p>

              </Link>
            ))}

          </div>
        )}

      </section>

      {/* Resources */}
      <section className="mt-10">

        <div className="mb-5">
          <h2 className="text-2xl font-extrabold">
            Resources
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Placement resources related to{" "}
            {company.company_name}.
          </p>
        </div>

        {companyResources.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No resources available for this company.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {companyResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.link}
                target="_blank"
                rel="noreferrer noopener"
                className="surface-card hover-lift block p-5"
              >

                <div className="flex gap-2">
                  <Chip>{resource.category}</Chip>
                  <Chip>{resource.type}</Chip>
                </div>

                <h3 className="mt-3 font-bold">
                  {resource.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {resource.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  Open resource
                  <ExternalLink className="size-3.5" />
                </span>

              </a>
            ))}

          </div>
        )}

      </section>

    </div>
  );
      }
