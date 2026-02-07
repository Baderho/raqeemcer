import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, Users, X, Check } from 'lucide-react';
import { useCertificateStore } from '@/hooks/useCertificateStore';
import { Participant } from '@/types/certificate';
import * as XLSX from 'xlsx';

export const DataUploader: React.FC = () => {
  const { participants, setParticipants, config, setConfig, setCurrentStep } = useCertificateStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const generateCertificateId = (index: number): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const sequence = (index + 1).toString().padStart(4, '0');
    return `${config.certificateIdPrefix}-${timestamp}-${sequence}`;
  };

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<{ [key: string]: string }>(firstSheet, { header: 1 });

        // Skip header row and extract names
        const names = jsonData
          .slice(1)
          .map((row: any) => (Array.isArray(row) ? row[0] : Object.values(row)[0]))
          .filter((name): name is string => typeof name === 'string' && name.trim() !== '');

        const newParticipants: Participant[] = names.map((name, index) => ({
          id: crypto.randomUUID(),
          name: name.trim(),
          certificateId: generateCertificateId(index),
          generated: false,
        }));

        setParticipants(newParticipants);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error reading Excel file. Please ensure it\'s a valid Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  }, [config.certificateIdPrefix, setParticipants]);

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

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-foreground mb-2">
          Upload Participant Data
        </h2>
        <p className="text-muted-foreground">
          Upload an Excel file with participant names and configure certificate details
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Config Panel */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-accent" />
            Certificate Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Course / Workshop Title *
              </label>
              <input
                type="text"
                value={config.courseTitle}
                onChange={(e) => setConfig({ courseTitle: e.target.value })}
                placeholder="e.g., Advanced Web Development"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Certificate ID Prefix
              </label>
              <input
                type="text"
                value={config.certificateIdPrefix}
                onChange={(e) => setConfig({ certificateIdPrefix: e.target.value.toUpperCase() })}
                placeholder="e.g., CERT"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Fixed Sentence
              </label>
              <textarea
                value={config.fixedSentence}
                onChange={(e) => setConfig({ fixedSentence: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Verification Base URL
              </label>
              <input
                type="text"
                value={config.verificationBaseUrl}
                onChange={(e) => setConfig({ verificationBaseUrl: e.target.value })}
                placeholder="https://verify.example.com/certificate/"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Upload Panel */}
        <div className="space-y-4">
          <label
            className={`upload-zone flex flex-col items-center justify-center p-8 cursor-pointer ${
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
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {fileName ? fileName : 'Drop Excel file here'}
            </p>
            <p className="text-xs text-muted-foreground">
              .xlsx or .xls with names in first column
            </p>
          </label>

          {/* Participants List */}
          {participants.length > 0 && (
            <div className="glass-panel p-4 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  Participants ({participants.length})
                </h4>
              </div>
              <ul className="space-y-2">
                {participants.map((participant) => (
                  <li
                    key={participant.id}
                    className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {participant.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.certificateId}
                      </p>
                    </div>
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Positioning
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          disabled={!config.courseTitle || participants.length === 0}
          className="gold-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Preview
        </button>
      </div>
    </div>
  );
};
