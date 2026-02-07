export interface Position {
  x: number;
  y: number;
}

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
}

export interface PositionedElement {
  id: string;
  type: 'name' | 'title' | 'sentence' | 'qrcode' | 'certificateId';
  position: Position;
  size: { width: number; height: number };
  style?: TextStyle;
  visible: boolean;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  elements: PositionedElement[];
  createdAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  certificateId: string;
  generated: boolean;
  pdfUrl?: string;
}

export interface CertificateConfig {
  courseTitle: string;
  certificateIdPrefix: string;
  fixedSentence: string;
  verificationBaseUrl: string;
}

export interface GenerationProgress {
  total: number;
  completed: number;
  current: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  error?: string;
}
