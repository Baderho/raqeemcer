-- Create certificates table to store generated certificates
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  certificate_id TEXT NOT NULL UNIQUE,
  issued_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  pdf_url TEXT,
  qr_verification_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Allow public read access for certificate verification
CREATE POLICY "Certificates are viewable by everyone" 
ON public.certificates 
FOR SELECT 
USING (true);

-- Create index for faster name searches
CREATE INDEX idx_certificates_participant_name ON public.certificates (participant_name);

-- Create index for certificate_id lookups
CREATE INDEX idx_certificates_certificate_id ON public.certificates (certificate_id);