
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO anon, authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can manage companies" ON public.companies FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.interview_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  interview_date DATE,
  rounds TEXT,
  technical_questions TEXT,
  hr_questions TEXT,
  coding_questions TEXT,
  summary TEXT,
  tips TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_experiences TO anon, authenticated;
GRANT ALL ON public.interview_experiences TO service_role;
ALTER TABLE public.interview_experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can manage experiences" ON public.interview_experiences FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT,
  category TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'Website',
  link TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can manage resources" ON public.resources FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.companies (company_name, role) VALUES
('Google', 'Software Engineer'),
('Amazon', 'SDE-1'),
('Microsoft', 'Software Engineer'),
('TCS', 'Systems Engineer'),
('Infosys', 'Systems Engineer'),
('Zoho', 'Member Technical Staff'),
('Deloitte', 'Analyst'),
('Flipkart', 'SDE Intern');

INSERT INTO public.interview_experiences (student_name, company, role, difficulty, interview_date, rounds, technical_questions, hr_questions, coding_questions, summary, tips) VALUES
('Ananya Sharma', 'Google', 'Software Engineer', 'Hard', '2026-01-14', 'Online Assessment, 2 DSA rounds, Googleyness, Hiring Committee', 'Graph traversal, LRU cache design, complexity analysis of tries', 'Tell me about a time you failed. Why Google?', 'Word Ladder II, Minimum Window Substring', 'Four rounds spread over three weeks. Interviewers focused heavily on clean thought process over final answers.', 'Talk out loud constantly. Practice 150 curated LeetCode problems rather than 500 random ones.'),
('Rohit Verma', 'Amazon', 'SDE-1', 'Medium', '2025-12-02', 'OA, 2 technical rounds, Bar Raiser', 'Design a parking lot, OOPs principles, DB indexing', 'Describe a leadership principle you live by', 'Number of Islands, K closest points to origin', 'Bar Raiser round was mostly behavioural with STAR-format questions.', 'Prepare 8-10 STAR stories mapped to Amazon leadership principles.'),
('Sneha Iyer', 'Zoho', 'Member Technical Staff', 'Medium', '2025-11-19', 'Aptitude, Basic programming, Advanced programming, HR', 'String manipulation without library functions, pointers in C', 'Are you open to relocation to Chennai?', 'Text justification, Matrix spiral print', 'Zoho tests raw programming ability with no IDE assistance in early rounds.', 'Practice writing code on paper. Library functions are usually banned.'),
('Karthik Nair', 'TCS', 'Systems Engineer', 'Easy', '2025-10-08', 'NQT, Technical Interview, HR', 'DBMS normalization, basic OOPs, SDLC models', 'Why TCS? Where do you see yourself in five years?', 'Fibonacci series, palindrome check', 'Very approachable panel. Focus stays on fundamentals and communication.', 'Revise your final year project deeply, they ask a lot about it.'),
('Meera Joshi', 'Microsoft', 'Software Engineer', 'Hard', '2026-02-03', 'OA, 3 technical rounds, AA round', 'Design a rate limiter, binary tree serialization', 'How do you handle disagreement with a teammate?', 'Serialize and Deserialize Binary Tree, Meeting Rooms II', 'The AA round mixed system design with culture fit questions.', 'Be strong on trees and dynamic programming; Microsoft loves both.');

INSERT INTO public.resources (title, company, category, description, type, link) VALUES
('Striver SDE Sheet', NULL, 'DSA', '191 curated problems covering every DSA pattern asked in placements.', 'DSA Sheet', 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems'),
('Neetcode 150', NULL, 'DSA', 'Video explanations for the 150 most common interview problems.', 'YouTube', 'https://neetcode.io/practice'),
('Indiabix Aptitude', NULL, 'Aptitude', 'Topic-wise quantitative aptitude practice with detailed solutions.', 'Website', 'https://www.indiabix.com/aptitude/questions-and-answers/'),
('System Design Primer', 'Amazon', 'System Design', 'The classic GitHub repository for scalable system design preparation.', 'Website', 'https://github.com/donnemartin/system-design-primer'),
('Google Interview Prep Notes', 'Google', 'Interview Prep', 'Compiled notes from seniors who cleared Google onsite rounds.', 'Notes', 'https://techdevguide.withgoogle.com/'),
('Core CS Subjects PDF', NULL, 'Core CS', 'OS, DBMS, CN and OOPs revision notes in a single PDF.', 'PDF', 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/');
