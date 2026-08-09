import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import "./Notes.css";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("id", { ascending: true });
if (error) {
  console.error("Error loading notes:", error);
  setError(`Supabase error: ${error.message}`);
}
       else {
        setNotes(data || []);
      }

      setLoading(false);
    }

    fetchNotes();
  }, []);

  const years = useMemo(
    () => [...new Set(notes.map((note) => note.year))],
    [notes]
  );

  const semesters = useMemo(
    () => [
      ...new Set(
        notes
          .filter((note) => note.year === year)
          .map((note) => note.semester)
      ),
    ],
    [notes, year]
  );

  const branches = useMemo(
    () => [
      ...new Set(
        notes
          .filter(
            (note) =>
              note.year === year &&
              note.semester === semester
          )
          .map((note) => note.branch)
      ),
    ],
    [notes, year, semester]
  );

  const subjects = useMemo(
    () => [
      ...new Set(
        notes
          .filter(
            (note) =>
              note.year === year &&
              note.semester === semester &&
              note.branch === branch
          )
          .map((note) => note.subject)
      ),
    ],
    [notes, year, semester, branch]
  );

  if (loading) {
    return (
      <div className="notes-page">
        <h1>Engineering Notes</h1>
        <p>Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notes-page">
        <h1>Engineering Notes</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <h1>Engineering Notes</h1>

      {/* YEAR */}
      <h2>Select Year</h2>

      <div className="button-container">
        {years.map((item) => (
          <button
            key={item}
            onClick={() => {
              setYear(item);
              setSemester("");
              setBranch("");
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* SEMESTER */}
      {year && (
        <>
          <h2>Select Semester</h2>

          <div className="button-container">
            {semesters.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSemester(item);
                  setBranch("");
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {/* BRANCH */}
      {semester && (
        <>
          <h2>Select Branch</h2>

          <div className="button-container">
            {branches.map((item) => (
              <button
                key={item}
                onClick={() => setBranch(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {/* SUBJECTS */}
      {branch && (
        <>
          <h2>Select Subject</h2>

          <div className="subjects">
            {subjects.length === 0 ? (
              <p>No notes uploaded yet.</p>
            ) : (
              subjects.map((subject) => (
                <div className="subject-card" key={subject}>
                  <h3>{subject}</h3>

                  {notes
                    .filter(
                      (note) =>
                        note.year === year &&
                        note.semester === semester &&
                        note.branch === branch &&
                        note.subject === subject
                    )
                    .map((note) => (
                      <div className="note" key={note.id}>
                        <span>{note.title}</span>

                        <a
                          href={note.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      </div>
                    ))}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
                      }
