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
import raqeemLogo from '@/assets/raqeem-logo.png';

const CertGen: React.FC = () => {
  const { currentStep, reset } = useCertificateStore();
  const navigate = useNavigate();

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
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={raqeemLogo} alt="رقيم" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  CertGen
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  نظام إنشاء الشهادات
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground px-2 sm:px-3"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline mr-1">الرئيسية</span>
              </Button>
              <button
                onClick={reset}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">إعادة</span>
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="px-2 sm:px-3"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline mr-1">خروج</span>
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
      <main className="container mx-auto px-4 pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto">
          {renderStep()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 sm:py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            نظام إنشاء الشهادات - منصة رقيم التعليمية
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CertGen;
