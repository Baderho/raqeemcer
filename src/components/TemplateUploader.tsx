import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useCertificateStore, defaultElements } from '@/hooks/useCertificateStore';
import { CertificateTemplate } from '@/types/certificate';
import sampleTemplate from '@/assets/sample-certificate-template.jpg';

export const TemplateUploader: React.FC = () => {
  const { setTemplate, setCurrentStep } = useCertificateStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG or JPG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPreview(imageUrl);

      const img = new Image();
      img.onload = () => {
        const template: CertificateTemplate = {
          id: crypto.randomUUID(),
          name: file.name,
          imageUrl,
          width: img.width,
          height: img.height,
          elements: defaultElements,
          createdAt: new Date(),
        };
        setTemplate(template);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  }, [setTemplate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const useSampleTemplate = useCallback(() => {
    const img = new Image();
    img.onload = () => {
      const template: CertificateTemplate = {
        id: crypto.randomUUID(),
        name: 'Sample Certificate Template',
        imageUrl: sampleTemplate,
        width: img.width,
        height: img.height,
        elements: defaultElements,
        createdAt: new Date(),
      };
      setTemplate(template);
      setPreview(sampleTemplate);
    };
    img.src = sampleTemplate;
  }, [setTemplate]);

  const handleContinue = () => {
    setCurrentStep(2);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-foreground mb-2">
          Upload Certificate Template
        </h2>
        <p className="text-muted-foreground">
          Upload your certificate background image (PNG or JPG)
        </p>
      </div>

      {!preview ? (
        <>
          <label
            className={`upload-zone flex flex-col items-center justify-center p-12 cursor-pointer ${
              isDragOver ? 'drag-over' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">
              Drop your template here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse files
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PNG, JPG • Max size: 10MB
            </p>
          </label>

          {/* Sample Template Option */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Or try with our sample template</p>
            <button
              onClick={useSampleTemplate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all shadow-medium"
            >
              <Sparkles className="w-4 h-4" />
              Use Sample Template
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4 animate-scale-in">
          <div className="relative rounded-xl overflow-hidden shadow-strong">
            <img
              src={preview}
              alt="Certificate template preview"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent pointer-events-none" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">Template uploaded</p>
                <p className="text-sm text-muted-foreground">Ready to configure positions</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPreview(null);
                  setTemplate(null);
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Change template
              </button>
              <button
                onClick={handleContinue}
                className="gold-button"
              >
                Continue to Positioning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
