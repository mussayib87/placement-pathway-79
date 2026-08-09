import { createFileRoute } from "@tanstack/react-router";
import Notes from "@/Notes";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
});

function NotesPage() {
  return <Notes />;
}
