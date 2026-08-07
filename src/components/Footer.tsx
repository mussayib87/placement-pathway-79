import { Link } from "@tanstack/react-router";
import { GraduationCap, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-display text-base font-extrabold">
              Placement Resource Hub
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            One centralized home for interview experiences, coding resources,
            aptitude material and preparation notes — instead of scattered
            WhatsApp groups and Drive links.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/companies" className="hover:text-primary">
                Companies
              </Link>
            </li>
            <li>
              <Link to="/experiences" className="hover:text-primary">
                Interview Experiences
              </Link>
            </li>
            <li>
              <Link to="/resources" className="hover:text-primary">
                Resources
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contribute</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/experiences/new" className="hover:text-primary">
                Add Experience
              </Link>
            </li>
            <li>
              <Link to="/resources/new" className="hover:text-primary">
                Add Resource
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-primary">
                Global Search
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Placement Resource Hub</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="size-3.5 text-primary" /> for the
            coding club <Github className="size-3.5" />
          </p>
        </div>
      </div>
    </footer>
  );
}
