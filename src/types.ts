export interface PrecisionPart {
  id: string;
  title: string;
  description: string;
  material: string;
  tolerance: string;
  machine: string;
  image?: string;
  dimensions: string;
  finish: string;
  applications: string[];
}

export interface FaiReport {
  partName: string;
  faiId: string;
  inspector: string;
  measuredDimensions: {
    feature: string;
    nominal: string;
    tolerance: string;
    actual: string;
    status: 'OK' | 'GODKENDT';
    instrument: string;
  }[];
}

export interface CompletedProject {
  id: string;
  title: string;
  description: string;
  material: string;
  machine: string;
  dimensions: string;
  tolerance: string;
  finish: string;
  process: string;
  date: string;
  notes: string;
  websiteUrl?: string;
  has3dRendering?: boolean;
  renderingUrl?: string;
  renderLabel?: string;
  faiReports?: FaiReport[];
}

export interface ReferenceCase {
  id: string;
  company: string;
  field: string;
  challenge: string;
  solution: string;
  quote: string;
  author: string;
  role: string;
  image: string;
  stats: { label: string; value: string }[];
}

export interface Datasheet {
  id: string;
  title: string;
  type: string;
  description: string;
  sections: {
    header: string;
    items: { label: string; value: string }[];
  }[];
  lastUpdated: string;
}

export interface QuoteRequest {
  process: string;
  material: string;
  length: number;
  width: number;
  height: number;
  diameter: number;
  tolerance: string;
  quantity: number;
  description: string;
  email: string;
  phone: string;
  name: string;
  hasDrawing: boolean;
  drawingName?: string;
}

export interface QuoteEstimate {
  estimatedCost: number;
  machineTimeMinutes: number;
  unitCost: number;
  setupCost: number;
  recommendation: string;
  feasible: boolean;
  feedback: string;
}
