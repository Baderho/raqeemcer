import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, ArrowRight, Download, Loader2, FileX, GraduationCap, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

interface Certificate {
  id: string;
  participant_name: string;
  course_title: string;
  certificate_id: string;
  issued_date: string;
  pdf_url: string | null;
  qr_verification_url: string | null;
}

const CertificatesDisplay: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decodedName = decodeURIComponent(name || '');

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!decodedName) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .ilike('participant_name', `%${decodedName}%`)
          .order('issued_date', { ascending: false });

        if (error) throw error;
        setCertificates(data || []);
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setError('حدث خطأ أثناء البحث عن الشهادات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, [decodedName]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-gold-dark flex items-center justify-center shadow-gold">
                <GraduationCap className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  منصة رقيم التعليمية
                </h1>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للبحث
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">
              شهادات: {decodedName}
            </h2>
            <p className="text-muted-foreground">
              {isLoading
                ? 'جاري البحث عن الشهادات...'
                : certificates.length > 0
                ? `تم العثور على ${certificates.length} شهادة`
                : 'لم يتم العثور على شهادات'}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="mt-4"
              >
                حاول مرة أخرى
              </Button>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && certificates.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <FileX className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                لم يتم العثور على شهادات
              </h3>
              <p className="text-muted-foreground mb-6">
                لا توجد شهادات مسجلة بهذا الاسم حالياً
              </p>
              <Button onClick={() => navigate('/')} className="gold-button">
                بحث جديد
              </Button>
            </div>
          )}

          {/* Certificates Grid */}
          {!isLoading && !error && certificates.length > 0 && (
            <div className="grid gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="overflow-hidden hover:shadow-medium transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Certificate Icon */}
                      <div className="md:w-48 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center p-6">
                        <div className="w-20 h-20 rounded-xl bg-accent/20 flex items-center justify-center">
                          <Award className="w-10 h-10 text-accent" />
                        </div>
                      </div>

                      {/* Certificate Details */}
                      <div className="flex-1 p-6">
                        <h3 className="text-xl font-display font-bold text-foreground mb-4">
                          {cert.course_title}
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>تاريخ الإصدار: {formatDate(cert.issued_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Hash className="w-4 h-4" />
                            <span>رقم الشهادة: {cert.certificate_id}</span>
                          </div>
                        </div>

                        {cert.pdf_url && (
                          <div className="mt-4">
                            <Button
                              asChild
                              className="gold-button"
                            >
                              <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 ml-2" />
                                تحميل الشهادة
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} منصة رقيم التعليمية - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CertificatesDisplay;
