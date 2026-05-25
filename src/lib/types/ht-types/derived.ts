export type DerivedTagIdsByLabel = {
  version: 1;
  byLabel: Record<string, number>;
  collisions?: Record<string, number[]>;
};
