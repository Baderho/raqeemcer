import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, ArrowRight, Download, Loader2, FileX, Calendar, 
  Hash, ShieldCheck, User, BookOpen, Instagram, QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { InstagramFollowModal, hasFollowedInstagram } from '@/components/InstagramFollowModal';
import raqeemLogo from '@/assets/raqeem-logo.png';

interface Certificate {
  id: string;
  participant_name: string;
  course_title: string;
  certificate_id: string;
  issued_date: string;
  pdf_url: string | null;
  qr_verification_url: string | null;
}

const CertificateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstagramModal, setShowInstagramModal] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) {
        setIsLoading(false);
        setError('معرف الشهادة غير موجود');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('certificate_id', id)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          setError('الشهادة غير موجودة');
        } else {
          setCertificate(data);
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError('حدث خطأ أثناء جلب بيانات الشهادة');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownloadClick = () => {
    if (!certificate?.pdf_url) return;
    
    if (hasFollowedInstagram()) {
      window.open(certificate.pdf_url, '_blank');
    } else {
      setShowInstagramModal(true);
    }
  };

  const handleConfirmFollow = () => {
    if (certificate?.pdf_url) {
      window.open(certificate.pdf_url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <img src={raqeemLogo} alt="رقيم" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg -z-10" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-l from-primary to-cyan-400 bg-clip-text text-transparent">رقيم</h1>
                <p className="text-[10px] text-muted-foreground">RAQEEM.AI</p>
              </div>
            </button>

            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm hover:text-primary"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">العودة</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              </div>
              <p className="text-muted-foreground mt-4">جاري تحميل الشهادة...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <FileX className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{error}</h3>
              <p className="text-muted-foreground mb-6">تأكد من صحة رابط الشهادة</p>
              <Button onClick={() => navigate('/')} className="bg-gradient-to-l from-primary to-cyan-500">
                العودة للرئيسية
              </Button>
            </motion.div>
          )}

          {/* Certificate Details */}
          {certificate && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Certificate Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-400/20 rounded-3xl blur-2xl" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-primary/20 rounded-3xl overflow-hidden">
                  {/* Header Banner */}
                  <div className="bg-gradient-to-r from-primary to-cyan-500 p-8 text-center">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4"
                    >
                      <Award className="w-14 h-14 text-white" />
                    </motion.div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      شهادة إتمام
                    </h2>
                    <p className="text-white/80">Certificate of Completion</p>
                  </div>

                  {/* Certificate Content */}
                  <div className="p-6 sm:p-10 space-y-8">
                    {/* Course Title */}
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm mb-2">اسم الدورة</p>
                      <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-l from-primary to-cyan-400 bg-clip-text text-transparent">
                        {certificate.course_title}
                      </h3>
                    </div>

                    {/* Details Grid */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-muted/30 rounded-2xl p-5 border border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm">اسم المشارك</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground pr-13">
                          {certificate.participant_name}
                        </p>
                      </div>

                      <div className="bg-muted/30 rounded-2xl p-5 border border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm">تاريخ الإصدار</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground pr-13">
                          {formatDate(certificate.issued_date)}
                        </p>
                      </div>

                      <div className="bg-muted/30 rounded-2xl p-5 border border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Hash className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm">رقم الشهادة</span>
                        </div>
                        <p className="text-lg font-mono font-semibold text-foreground pr-13" dir="ltr">
                          {certificate.certificate_id}
                        </p>
                      </div>

                      <div className="bg-muted/30 rounded-2xl p-5 border border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                          </div>
                          <span className="text-muted-foreground text-sm">حالة الشهادة</span>
                        </div>
                        <p className="text-lg font-semibold text-green-500 pr-13">
                          موثقة ✓
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      {certificate.pdf_url && (
                        <Button
                          size="lg"
                          className="flex-1 h-14 text-lg bg-gradient-to-l from-primary to-cyan-500 hover:opacity-90 rounded-xl shadow-lg shadow-primary/25"
                          onClick={handleDownloadClick}
                        >
                          <Download className="w-5 h-5 ml-2" />
                          تحميل الشهادة PDF
                        </Button>
                      )}
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 h-14 text-lg border-primary/30 hover:border-primary hover:bg-primary/10 rounded-xl"
                        onClick={() => navigate(`/verify?id=${certificate.certificate_id}`)}
                      >
                        <QrCode className="w-5 h-5 ml-2" />
                        صفحة التحقق
                      </Button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-primary/10 bg-muted/20 p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <img src={raqeemLogo} alt="رقيم" className="w-5 h-5" />
                      <span>صادرة من منصة رقيم التعليمية</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-400/10 border border-pink-500/20 rounded-2xl p-6 text-center"
              >
                <Instagram className="w-10 h-10 text-pink-500 mx-auto mb-3" />
                <p className="text-foreground font-medium mb-3">تابعنا على انستجرام للمزيد من الدورات</p>
                <a
                  href="https://www.instagram.com/raqeem_jo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-5 h-5" />
                  @raqeem_jo
                </a>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-6 mt-auto bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={raqeemLogo} alt="رقيم" className="w-6 h-6 object-contain" />
              <span className="text-sm bg-gradient-to-l from-primary to-cyan-400 bg-clip-text text-transparent font-medium">
                منصة رقيم التعليمية
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} منصة رقيم التعليمية
            </p>
          </div>
        </div>
      </footer>

      {/* Instagram Follow Modal */}
      <InstagramFollowModal
        isOpen={showInstagramModal}
        onClose={() => setShowInstagramModal(false)}
        onConfirmFollow={handleConfirmFollow}
        participantName={certificate?.participant_name || ''}
      />
    </div>
  );
};

export default CertificateDetails;
