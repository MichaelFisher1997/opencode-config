export interface ModelCost {
  input?: number;
  output?: number;
}

export interface ModelLimits {
  context?: number;
  output?: number;
}

export interface ModelModalities {
  input: string[];
  output: string[];
}

export interface Model {
  id: string;
  name: string;
  family?: string;
  attachment?: boolean;
  reasoning?: boolean;
  tool_call?: boolean;
  temperature?: boolean;
  knowledge?: string;
  release_date?: string;
  last_updated?: string;
  modalities: ModelModalities;
  open_weights?: boolean;
  cost?: ModelCost;
  limit?: ModelLimits;
}

export interface Provider {
  id: string;
  name: string;
  env?: string[];
  npm?: string;
  api?: string;
  doc?: string;
  models: Record<string, Model>;
}

export type ApiData = Record<string, Provider>;

export interface FlatModel extends Model {
  provider: string;
  providerName: string;
}
