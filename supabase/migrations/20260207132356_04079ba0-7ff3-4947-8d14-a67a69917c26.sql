-- Create storage bucket for certificates PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Public can view certificates" ON storage.objects
FOR SELECT USING (bucket_id = 'certificates');

-- Create policy for authenticated insert (admins)
CREATE POLICY "Admins can upload certificates" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'certificates');

-- Create policy for delete (admins)
CREATE POLICY "Admins can delete certificates" ON storage.objects
FOR DELETE USING (bucket_id = 'certificates');

-- Add delete policy for certificates table (for admin management)
CREATE POLICY "Admins can delete certificates"
ON public.certificates
FOR DELETE
USING (true);