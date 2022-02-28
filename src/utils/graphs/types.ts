export type Reference = 'specimen' | 'geographic' | 'stratigraphic';

export type Projection = 'W, UP' | 'N, UP' | 'N, N';

export type StatisticsModePCA = 'pca' | 'pca0' | 'gc' | 'gcn' | null;

export type PCALines = {
  horX: [number, number], horY: [number, number],
  verX: [number, number], verY: [number, number]
} | null;

export type ConfidenceCircle = {xyData: Array<[number, number]>, color: string};
 
export type MeanDirection = {
  dirData: [number, number], 
  xyData: [number, number],
  confidenceCircle: ConfidenceCircle,
  tooltip: TooltipDot,
} | null;

export type TooltipDot = {
  posX?: number;
  posY?: number;
  title?: string;
  step?: string;
  id?: number;
  x?: number;
  y?: number;
  z?: number;
  dec?: number;
  inc?: number;
  mag?: string;
  meanType?: StatisticsModePCA;
  mad?: number;
  a95?: number;
  k?: number;
  comment?: string;
};

export type DotType = 'h' | 'v'| 'all' | 'mean';

export type TMenuItem = {
  label: string;
  state: boolean;
  onClick?: () => void;
  divider?: boolean;
};

export type DotSettings = {
  annotations: boolean;
  tooltips: boolean;
  id?: boolean;
  label?: boolean;
};

export type GraphAreaSettings = {
  ticks: boolean;
};

export type GraphSettings = {
  area: GraphAreaSettings;
  dots: DotSettings;
};