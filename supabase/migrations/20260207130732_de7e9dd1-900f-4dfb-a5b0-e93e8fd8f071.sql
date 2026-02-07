-- Allow insert for certificates (from admin/CertGen)
CREATE POLICY "Allow public insert for certificates" 
ON public.certificates 
FOR INSERT 
WITH CHECK (true);