import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Download, Loader2, FileX, Calendar, Hash, Eye, Instagram, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
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

const CertificatesDisplay: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Instagram modal state
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [selectedCertForDownload, setSelectedCertForDownload] = useState<Certificate | null>(null);

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

  const handleDownloadClick = (cert: Certificate) => {
    // Check if user has already followed
    if (hasFollowedInstagram()) {
      // Direct download
      if (cert.pdf_url) {
        window.open(cert.pdf_url, '_blank');
      }
    } else {
      // Show Instagram modal
      setSelectedCertForDownload(cert);
      setShowInstagramModal(true);
    }
  };

  const handleConfirmFollow = () => {
    if (selectedCertForDownload?.pdf_url) {
      window.open(selectedCertForDownload.pdf_url, '_blank');
    }
    setSelectedCertForDownload(null);
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
                <p className="text-xs text-muted-foreground">منصة الشهادات التعليمية</p>
              </div>
            </button>

            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">العودة للبحث</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-6 sm:mb-10"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
              <Award className="w-4 h-4" />
              <span>نتائج البحث</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              شهادات: {decodedName}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {isLoading
                ? 'جاري البحث عن الشهادات...'
                : certificates.length > 0
                ? `تم العثور على ${certificates.length} شهادة`
                : 'لم يتم العثور على شهادات'}
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
              <p className="text-muted-foreground">جاري البحث...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16 sm:py-20">
              <p className="text-destructive mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                حاول مرة أخرى
              </Button>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && certificates.length === 0 && (
            <motion.div 
              className="text-center py-16 sm:py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <FileX className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                لم يتم العثور على شهادات
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                لا توجد شهادات مسجلة بهذا الاسم حالياً
              </p>
              <Button onClick={() => navigate('/')} className="raqeem-button">
                بحث جديد
              </Button>
            </motion.div>
          )}

          {/* Certificates Grid */}
          {!isLoading && !error && certificates.length > 0 && (
            <div className="grid gap-4 sm:gap-6">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-panel-strong overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Certificate Icon */}
                        <div className="sm:w-40 lg:w-48 bg-gradient-raqeem flex items-center justify-center p-6 sm:p-8">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                          </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="flex-1 p-4 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                            {cert.course_title}
                          </h3>

                          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 text-primary shrink-0" />
                              <span>تاريخ الإصدار: {formatDate(cert.issued_date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Hash className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-mono" dir="ltr">{cert.certificate_id}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/verify?id=${cert.certificate_id}`)}
                              className="text-xs sm:text-sm"
                            >
                              <Eye className="w-4 h-4 ml-1" />
                              التحقق
                            </Button>
                            {cert.pdf_url && (
                              <Button
                                size="sm"
                                className="raqeem-button text-xs sm:text-sm py-2"
                                onClick={() => handleDownloadClick(cert)}
                              >
                                <Download className="w-4 h-4 ml-1" />
                                تحميل
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} منصة رقيم التعليمية
            </p>
          </div>
        </div>
      </footer>

      {/* Instagram Follow Modal */}
      <InstagramFollowModal
        isOpen={showInstagramModal}
        onClose={() => {
          setShowInstagramModal(false);
          setSelectedCertForDownload(null);
        }}
        onConfirmFollow={handleConfirmFollow}
        participantName={decodedName}
      />
    </div>
  );
};

export default CertificatesDisplay;
