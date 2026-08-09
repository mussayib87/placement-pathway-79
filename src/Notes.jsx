import { useState } from "react";
import notesData from "./notesData";

export default function Notes() {
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");

  const years = Object.keys(notesData);

  const semesters = year
    ? Object.keys(notesData[year])
    : [];

  const branches =
    year && semester
      ? Object.keys(notesData[year][semester])
      : [];

  const subjects =
    year && semester && branch
      ? Object.keys(notesData[year][semester][branch])
      : [];

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

                  {notesData[year][semester][branch][subject].map(
                    (note) => (
                      <div className="note" key={note.title}>
                        <span>{note.title}</span>

                        <a
                          href={note.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      </div>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
    }
