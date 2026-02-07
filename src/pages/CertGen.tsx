import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, RefreshCw, LogOut, Home } from 'lucide-react';
import { useCertificateStore } from '@/hooks/useCertificateStore';
import { StepIndicator } from '@/components/StepIndicator';
import { TemplateUploader } from '@/components/TemplateUploader';
import { PositioningEditor } from '@/components/PositioningEditor';
import { DataUploader } from '@/components/DataUploader';
import { CertificatePreview } from '@/components/CertificatePreview';
import { Button } from '@/components/ui/button';

const CertGen: React.FC = () => {
  const { currentStep, reset } = useCertificateStore();
  const navigate = useNavigate();

  // Check admin access
  useEffect(() => {
    const hasAccess = sessionStorage.getItem('adminAccess');
    if (!hasAccess) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAccess');
    navigate('/admin');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TemplateUploader />;
      case 2:
        return <PositioningEditor />;
      case 3:
        return <DataUploader />;
      case 4:
        return <CertificatePreview />;
      default:
        return <TemplateUploader />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-gold-dark flex items-center justify-center shadow-gold">
                <Award className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  CertGen
                </h1>
                <p className="text-xs text-muted-foreground">
                  نظام إنشاء الشهادات - منصة رقيم
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">الرئيسية</span>
              </Button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Start Over</span>
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="container mx-auto px-4">
        <StepIndicator />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          {renderStep()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            نظام إنشاء الشهادات - منصة رقيم التعليمية
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CertGen;
