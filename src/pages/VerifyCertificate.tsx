import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Loader2, Award, Calendar, User, Hash, ArrowRight, ShieldCheck, Heart, Instagram } from 'lucide-react';
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
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
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <motion.div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-raqeem flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
              animate={{ 
                boxShadow: [
                  '0 4px 25px -4px hsla(187, 85%, 35%, 0.35)',
                  '0 8px 35px -4px hsla(187, 85%, 35%, 0.5)',
                  '0 4px 25px -4px hsla(187, 85%, 35%, 0.35)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              التحقق من صحة الشهادة
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              أدخل رقم الشهادة للتحقق من صحتها وصلاحيتها
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-panel-strong mb-6">
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="أدخل رقم الشهادة (مثل: RQM-ABC12345)"
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
          </motion.div>

          {/* Result */}
          {hasSearched && !isLoading && (
            <motion.div 
              className="animate-fade-in"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {certificate ? (
                <Card className="glass-panel-strong border-primary/30 overflow-hidden">
                  <div className="bg-gradient-raqeem p-4 sm:p-6">
                    <div className="flex items-center gap-3 text-primary-foreground">
                      <motion.div 
                        className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg">شهادة صالحة ✓</h3>
                        <p className="text-primary-foreground/80 text-sm">تم التحقق من صحة هذه الشهادة</p>
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
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <XCircle className="w-8 h-8 text-destructive" />
                    </motion.div>
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      لم يتم العثور على الشهادة
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      رقم الشهادة المدخل غير موجود في نظامنا. تأكد من صحة الرقم وحاول مرة أخرى.
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>من إبداعات</span>
              <a href="https://nahno.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                منصة نحن
              </a>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/raqeem_jo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} منصة رقيم التعليمية
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VerifyCertificate;
