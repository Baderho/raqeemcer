import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Loader2, Award, Calendar, User, Hash, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import raqeemLogo from '@/assets/raqeem-logo.png';

interface Certificate {
  id: string;
  participant_name: string;
  course_title: string;
  certificate_id: string;
  issued_date: string;
  pdf_url: string | null;
}

const VerifyCertificate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState(searchParams.get('id') || '');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!certificateId.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setNotFound(false);
    setCertificate(null);

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('certificate_id', certificateId.trim())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCertificate(data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search if ID is in URL
  React.useEffect(() => {
    if (searchParams.get('id')) {
      handleSearch();
    }
  }, []);

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
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img src={raqeemLogo} alt="رقيم" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">رقيم</h1>
                <p className="text-xs text-muted-foreground">التحقق من الشهادات</p>
              </div>
            </button>

            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">الرئيسية</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-raqeem flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              التحقق من صحة الشهادة
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              أدخل رقم الشهادة للتحقق من صحتها وصلاحيتها
            </p>
          </div>

          {/* Search Form */}
          <Card className="glass-panel-strong mb-6">
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="أدخل رقم الشهادة (مثل: CERT-ABC123)"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="h-12 sm:h-14 text-base sm:text-lg pr-12 rounded-xl border-2 focus:border-primary"
                    dir="ltr"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Hash className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!certificateId.trim() || isLoading}
                  className="w-full h-12 raqeem-button text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin ml-2" />
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 ml-2" />
                      تحقق من الشهادة
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Result */}
          {hasSearched && !isLoading && (
            <div className="animate-fade-in">
              {certificate ? (
                <Card className="glass-panel-strong border-primary/30 overflow-hidden">
                  <div className="bg-gradient-raqeem p-4 sm:p-6">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">شهادة صالحة ✓</h3>
                        <p className="text-white/80 text-sm">تم التحقق من صحة هذه الشهادة</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <User className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">اسم الحاصل على الشهادة</p>
                          <p className="font-semibold text-foreground">{certificate.participant_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <Award className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">اسم الدورة / ورشة العمل</p>
                          <p className="font-semibold text-foreground">{certificate.course_title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <Calendar className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">تاريخ الإصدار</p>
                          <p className="font-semibold text-foreground">{formatDate(certificate.issued_date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <Hash className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">رقم الشهادة</p>
                          <p className="font-semibold text-foreground font-mono" dir="ltr">{certificate.certificate_id}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : notFound ? (
                <Card className="glass-panel-strong border-destructive/30">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <XCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      لم يتم العثور على الشهادة
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      رقم الشهادة المدخل غير موجود في نظامنا. تأكد من صحة الرقم وحاول مرة أخرى.
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} منصة رقيم التعليمية
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VerifyCertificate;
