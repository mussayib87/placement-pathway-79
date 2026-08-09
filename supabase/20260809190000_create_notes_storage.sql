INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read notes"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'notes');

CREATE POLICY "Public can upload notes"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'notes');

CREATE POLICY "Public can update notes"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'notes')
WITH CHECK (bucket_id = 'notes');

CREATE POLICY "Public can delete notes"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id = 'notes');
