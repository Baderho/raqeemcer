import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Download, Loader2, FileX, Calendar, Hash, Eye, Instagram } from 'lucide-react';
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
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm hover:text-primary"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">العودة للبحث</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
              <Award className="w-4 h-4" />
              <span>نتائج البحث</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-2">
              <span className="text-foreground">شهادات: </span>
              <span className="bg-gradient-to-l from-primary to-cyan-400 bg-clip-text text-transparent">
                {decodedName}
              </span>
            </h2>
            <p className="text-muted-foreground">
              {isLoading
                ? 'جاري البحث عن الشهادات...'
                : certificates.length > 0
                ? `تم العثور على ${certificates.length} شهادة`
                : 'لم يتم العثور على شهادات'}
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              </div>
              <p className="text-muted-foreground mt-4">جاري البحث...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={() => navigate('/')}>
                حاول مرة أخرى
              </Button>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && certificates.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <FileX className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                لم يتم العثور على شهادات
              </h3>
              <p className="text-muted-foreground mb-6">
                لا توجد شهادات مسجلة بهذا الاسم حالياً
              </p>
              <Button onClick={() => navigate('/')} className="bg-gradient-to-l from-primary to-cyan-500">
                بحث جديد
              </Button>
            </motion.div>
          )}

          {/* Certificates Grid */}
          {!isLoading && !error && certificates.length > 0 && (
            <div className="grid gap-6">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group relative overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-0 relative">
                      <div className="flex flex-col sm:flex-row">
                        {/* Certificate Icon */}
                        <div className="sm:w-40 lg:w-48 bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center p-8">
                          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Award className="w-10 h-10 text-white" />
                          </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="flex-1 p-6">
                          <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                            {cert.course_title}
                          </h3>

                          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-6">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 text-primary shrink-0" />
                              <span>تاريخ الإصدار: {formatDate(cert.issued_date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Hash className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-mono text-xs" dir="ltr">{cert.certificate_id}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <Button
                              size="sm"
                              className="bg-gradient-to-l from-primary to-cyan-500 hover:opacity-90"
                              onClick={() => navigate(`/certificate/${cert.certificate_id}`)}
                            >
                              <Eye className="w-4 h-4 ml-1" />
                              عرض التفاصيل
                            </Button>
                            {cert.pdf_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-primary/30 hover:border-primary hover:bg-primary/10"
                                onClick={() => handleDownloadClick(cert)}
                              >
                                <Download className="w-4 h-4 ml-1" />
                                تحميل PDF
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
      <footer className="border-t border-primary/10 py-6 mt-auto bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={raqeemLogo} alt="رقيم" className="w-6 h-6 object-contain" />
              <span className="text-sm bg-gradient-to-l from-primary to-cyan-400 bg-clip-text text-transparent font-medium">
                منصة رقيم التعليمية
              </span>
            </div>
            <a
              href="https://www.instagram.com/raqeem_jo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-pink-500 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <p className="text-xs text-muted-foreground">
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
