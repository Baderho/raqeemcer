import { create } from 'zustand';
import { CertificateTemplate, Participant, CertificateConfig, PositionedElement, GenerationProgress } from '@/types/certificate';

interface CertificateStore {
  // Template
  template: CertificateTemplate | null;
  setTemplate: (template: CertificateTemplate | null) => void;
  updateElement: (elementId: string, updates: Partial<PositionedElement>) => void;
  
  // Participants
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  
  // Config
  config: CertificateConfig;
  setConfig: (config: Partial<CertificateConfig>) => void;
  
  // Generation
  progress: GenerationProgress;
  setProgress: (progress: Partial<GenerationProgress>) => void;
  
  // Step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  // Reset
  reset: () => void;
}

// Arabic-friendly fonts with proper RTL support
export const availableFonts = [
  { name: 'Cairo', family: 'Cairo, sans-serif', arabic: true },
  { name: 'Tajawal', family: 'Tajawal, sans-serif', arabic: true },
  { name: 'Amiri', family: 'Amiri, serif', arabic: true },
  { name: 'Noto Kufi Arabic', family: '"Noto Kufi Arabic", sans-serif', arabic: true },
  { name: 'Noto Naskh Arabic', family: '"Noto Naskh Arabic", serif', arabic: true },
  { name: 'IBM Plex Sans Arabic', family: '"IBM Plex Sans Arabic", sans-serif', arabic: true },
  { name: 'Playfair Display', family: '"Playfair Display", serif', arabic: false },
  { name: 'Inter', family: 'Inter, sans-serif', arabic: false },
  { name: 'Georgia', family: 'Georgia, serif', arabic: false },
  { name: 'Times New Roman', family: '"Times New Roman", serif', arabic: false },
];

export const defaultColors = [
  '#1e3a5f', // Navy
  '#c5a572', // Gold
  '#000000', // Black
  '#2d3748', // Dark Gray
  '#4a5568', // Gray
  '#718096', // Light Gray
  '#991b1b', // Dark Red
  '#166534', // Dark Green
  '#1e40af', // Dark Blue
  '#7c2d12', // Brown
];

const defaultElements: PositionedElement[] = [
  {
    id: 'name',
    type: 'name',
    position: { x: 50, y: 45 },
    size: { width: 300, height: 40 },
    style: {
      fontSize: 32,
      fontFamily: 'Cairo, sans-serif',
      color: '#1e3a5f',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    visible: true,
  },
  {
    id: 'sentence',
    type: 'sentence',
    position: { x: 50, y: 55 },
    size: { width: 400, height: 30 },
    style: {
      fontSize: 16,
      fontFamily: 'Cairo, sans-serif',
      color: '#4a5568',
      fontWeight: 'normal',
      textAlign: 'center',
    },
    visible: true,
  },
  {
    id: 'title',
    type: 'title',
    position: { x: 50, y: 62 },
    size: { width: 350, height: 35 },
    style: {
      fontSize: 24,
      fontFamily: 'Cairo, sans-serif',
      color: '#1e3a5f',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    visible: true,
  },
  {
    id: 'certificateId',
    type: 'certificateId',
    position: { x: 85, y: 90 },
    size: { width: 120, height: 20 },
    style: {
      fontSize: 10,
      fontFamily: 'Cairo, sans-serif',
      color: '#718096',
      fontWeight: 'normal',
      textAlign: 'right',
    },
    visible: true,
  },
  {
    id: 'qrcode',
    type: 'qrcode',
    position: { x: 10, y: 85 },
    size: { width: 60, height: 60 },
    visible: true,
  },
];

const defaultConfig: CertificateConfig = {
  courseTitle: '',
  certificateIdPrefix: 'CERT',
  fixedSentence: 'has successfully attended a training workshop entitled',
  verificationBaseUrl: 'https://verify.example.com/certificate/',
};

const defaultProgress: GenerationProgress = {
  total: 0,
  completed: 0,
  current: '',
  status: 'idle',
};

export const useCertificateStore = create<CertificateStore>((set) => ({
  template: null,
  setTemplate: (template) => set({ template }),
  updateElement: (elementId, updates) =>
    set((state) => ({
      template: state.template
        ? {
            ...state.template,
            elements: state.template.elements.map((el) =>
              el.id === elementId ? { ...el, ...updates } : el
            ),
          }
        : null,
    })),

  participants: [],
  setParticipants: (participants) => set({ participants }),
  updateParticipant: (id, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  config: defaultConfig,
  setConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),

  progress: defaultProgress,
  setProgress: (progress) =>
    set((state) => ({
      progress: { ...state.progress, ...progress },
    })),

  currentStep: 1,
  setCurrentStep: (currentStep) => set({ currentStep }),

  reset: () =>
    set({
      template: null,
      participants: [],
      config: defaultConfig,
      progress: defaultProgress,
      currentStep: 1,
    }),
}));

export { defaultElements };
