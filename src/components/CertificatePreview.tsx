import React, { useRef, useEffect, useState } from 'react';
import { Download, FileDown, Loader2, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useCertificateStore } from '@/hooks/useCertificateStore';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

export const CertificatePreview: React.FC = () => {
  const { template, participants, config, progress, setProgress, setCurrentStep } = useCertificateStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedParticipant, setSelectedParticipant] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const currentParticipant = participants[selectedParticipant];

  // Generate preview
  useEffect(() => {
    if (!template || !currentParticipant) return;

    const generatePreview = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = template.width;
      canvas.height = template.height;

      // Load and draw template image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        ctx.drawImage(img, 0, 0, template.width, template.height);

        // Draw each element
        for (const element of template.elements) {
          if (!element.visible) continue;

          const x = (element.position.x / 100) * template.width;
          const y = (element.position.y / 100) * template.height;

          if (element.type === 'qrcode') {
            // Generate QR code
            const qrData = `${config.verificationBaseUrl}${currentParticipant.certificateId}`;
            try {
              const qrDataUrl = await QRCode.toDataURL(qrData, {
                width: element.size.width * 2,
                margin: 1,
                color: { dark: '#1e3a5f', light: '#ffffff' },
              });
              const qrImg = new Image();
              qrImg.onload = () => {
                ctx.drawImage(qrImg, x - element.size.width / 2, y - element.size.width / 2, element.size.width, element.size.width);
                setPreviewImage(canvas.toDataURL('image/png'));
              };
              qrImg.src = qrDataUrl;
            } catch (error) {
              console.error('QR generation error:', error);
            }
          } else {
            // Draw text
            let text = '';
            switch (element.type) {
              case 'name':
                text = currentParticipant.name;
                break;
              case 'title':
                text = config.courseTitle;
                break;
              case 'sentence':
                text = config.fixedSentence;
                break;
              case 'certificateId':
                text = currentParticipant.certificateId;
                break;
            }

            if (element.style && text) {
              ctx.font = `${element.style.fontWeight === 'bold' ? 'bold ' : ''}${element.style.fontSize}px ${element.style.fontFamily}`;
              ctx.fillStyle = element.style.color;
              ctx.textAlign = element.style.textAlign;
              ctx.textBaseline = 'middle';
              ctx.fillText(text, x, y);
            }
          }
        }

        // Small delay to ensure QR code is drawn
        setTimeout(() => {
          setPreviewImage(canvas.toDataURL('image/png'));
        }, 200);
      };
      img.src = template.imageUrl;
    };

    generatePreview();
  }, [template, currentParticipant, config]);

  const generateCertificatePDF = async (participant: typeof currentParticipant): Promise<Blob> => {
    return new Promise(async (resolve) => {
      if (!template) throw new Error('No template');

      const canvas = document.createElement('canvas');
      canvas.width = template.width;
      canvas.height = template.height;
      const ctx = canvas.getContext('2d')!;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        ctx.drawImage(img, 0, 0, template.width, template.height);

        // Draw elements
        for (const element of template.elements) {
          if (!element.visible) continue;

          const x = (element.position.x / 100) * template.width;
          const y = (element.position.y / 100) * template.height;

          if (element.type === 'qrcode') {
            const qrData = `${config.verificationBaseUrl}${participant.certificateId}`;
            const qrDataUrl = await QRCode.toDataURL(qrData, {
              width: element.size.width * 2,
              margin: 1,
              color: { dark: '#1e3a5f', light: '#ffffff' },
            });
            const qrImg = new Image();
            await new Promise<void>((res) => {
              qrImg.onload = () => {
                ctx.drawImage(qrImg, x - element.size.width / 2, y - element.size.width / 2, element.size.width, element.size.width);
                res();
              };
              qrImg.src = qrDataUrl;
            });
          } else {
            let text = '';
            switch (element.type) {
              case 'name': text = participant.name; break;
              case 'title': text = config.courseTitle; break;
              case 'sentence': text = config.fixedSentence; break;
              case 'certificateId': text = participant.certificateId; break;
            }

            if (element.style && text) {
              ctx.font = `${element.style.fontWeight === 'bold' ? 'bold ' : ''}${element.style.fontSize}px ${element.style.fontFamily}`;
              ctx.fillStyle = element.style.color;
              ctx.textAlign = element.style.textAlign;
              ctx.textBaseline = 'middle';
              ctx.fillText(text, x, y);
            }
          }
        }

        // Create PDF
        const isLandscape = template.width > template.height;
        const pdf = new jsPDF({
          orientation: isLandscape ? 'landscape' : 'portrait',
          unit: 'px',
          format: [template.width, template.height],
        });

        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imageData, 'JPEG', 0, 0, template.width, template.height);

        resolve(pdf.output('blob'));
      };
      img.src = template.imageUrl;
    });
  };

  const downloadSingle = async () => {
    if (!currentParticipant) return;

    setProgress({ status: 'processing', current: currentParticipant.name });
    try {
      const blob = await generateCertificatePDF(currentParticipant);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${currentParticipant.name.replace(/\s+/g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setProgress({ status: 'completed' });
    } catch (error) {
      setProgress({ status: 'error', error: 'Failed to generate certificate' });
    }
  };

  const downloadAll = async () => {
    setProgress({ status: 'processing', total: participants.length, completed: 0, current: '' });

    try {
      const zip = new JSZip();

      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        setProgress({ current: participant.name, completed: i });
        const blob = await generateCertificatePDF(participant);
        zip.file(`certificate-${participant.name.replace(/\s+/g, '-')}.pdf`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificates-${config.courseTitle.replace(/\s+/g, '-')}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setProgress({ status: 'completed', completed: participants.length });
    } catch (error) {
      setProgress({ status: 'error', error: 'Failed to generate certificates' });
    }
  };

  if (!template || participants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please complete previous steps first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-foreground mb-2">
          Preview & Generate
        </h2>
        <p className="text-muted-foreground">
          Preview certificates and download them individually or as a batch
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                Certificate Preview
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedParticipant(Math.max(0, selectedParticipant - 1))}
                  disabled={selectedParticipant === 0}
                  className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  ←
                </button>
                <span className="text-sm text-muted-foreground">
                  {selectedParticipant + 1} / {participants.length}
                </span>
                <button
                  onClick={() => setSelectedParticipant(Math.min(participants.length - 1, selectedParticipant + 1))}
                  disabled={selectedParticipant === participants.length - 1}
                  className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            <div className="certificate-canvas rounded-lg overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Certificate preview"
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[4/3] flex items-center justify-center bg-muted">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Current Certificate</h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground">{currentParticipant?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentParticipant?.certificateId}
              </p>
            </div>
            <button
              onClick={downloadSingle}
              disabled={progress.status === 'processing'}
              className="w-full gold-button flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download This Certificate
            </button>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Batch Download</h3>
            <p className="text-sm text-muted-foreground">
              Generate and download all {participants.length} certificates as a ZIP file.
            </p>

            {progress.status === 'processing' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating: {progress.current}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {progress.completed} / {progress.total}
                </p>
              </div>
            )}

            {progress.status === 'completed' && (
              <div className="flex items-center gap-2 text-sm text-accent">
                <CheckCircle className="w-4 h-4" />
                <span>All certificates generated!</span>
              </div>
            )}

            {progress.status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>{progress.error}</span>
              </div>
            )}

            <button
              onClick={downloadAll}
              disabled={progress.status === 'processing'}
              className="w-full navy-button flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Download All as ZIP
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Data
        </button>
      </div>
    </div>
  );
};
