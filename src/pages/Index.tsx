import React from 'react';
import { Award, RefreshCw } from 'lucide-react';
import { useCertificateStore } from '@/hooks/useCertificateStore';
import { StepIndicator } from '@/components/StepIndicator';
import { TemplateUploader } from '@/components/TemplateUploader';
import { PositioningEditor } from '@/components/PositioningEditor';
import { DataUploader } from '@/components/DataUploader';
import { CertificatePreview } from '@/components/CertificatePreview';

const Index = () => {
  const { currentStep, reset } = useCertificateStore();

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
                  AI-Powered Certificate Generator
                </p>
              </div>
            </div>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </button>
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
            Generate professional certificates with ease. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
