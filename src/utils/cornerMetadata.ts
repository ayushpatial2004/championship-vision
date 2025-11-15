// COTA Track Corner Metadata
export interface CornerData {
  id: number;
  name: string;
  position: [number, number, number]; // x, y, z coordinates
  type: 'slow' | 'medium' | 'fast';
  braking: { position: [number, number, number]; intensity: number };
  apex: { position: [number, number, number] };
  exit: { position: [number, number, number] };
  difficulty: number; // 1-10
  overtakingZone: boolean;
}

// COTA Track has 20 turns
export const cotaCorners: CornerData[] = [
  {
    id: 1,
    name: 'Turn 1 (Uphill Left)',
    position: [0, 2, 10],
    type: 'slow',
    braking: { position: [0, 2, 15], intensity: 0.95 },
    apex: { position: [0, 2, 10] },
    exit: { position: [0, 2, 5] },
    difficulty: 8,
    overtakingZone: true,
  },
  {
    id: 2,
    name: 'Turn 2',
    position: [5, 3, 5],
    type: 'medium',
    braking: { position: [3, 2.5, 7], intensity: 0.6 },
    apex: { position: [5, 3, 5] },
    exit: { position: [7, 3, 3] },
    difficulty: 6,
    overtakingZone: false,
  },
  {
    id: 3,
    name: 'Turn 3-4-5 (Maggots)',
    position: [10, 2, 0],
    type: 'fast',
    braking: { position: [8, 2.5, 2], intensity: 0.3 },
    apex: { position: [10, 2, 0] },
    exit: { position: [12, 1.5, -2] },
    difficulty: 9,
    overtakingZone: false,
  },
  {
    id: 6,
    name: 'Turn 6',
    position: [15, 1, -5],
    type: 'medium',
    braking: { position: [13, 1.5, -3], intensity: 0.7 },
    apex: { position: [15, 1, -5] },
    exit: { position: [17, 0.5, -7] },
    difficulty: 7,
    overtakingZone: false,
  },
  {
    id: 7,
    name: 'Turn 7',
    position: [20, 0, -10],
    type: 'medium',
    braking: { position: [18, 0.5, -8], intensity: 0.6 },
    apex: { position: [20, 0, -10] },
    exit: { position: [22, -0.5, -12] },
    difficulty: 6,
    overtakingZone: false,
  },
  {
    id: 8,
    name: 'Turn 8',
    position: [25, -1, -15],
    type: 'medium',
    braking: { position: [23, -0.5, -13], intensity: 0.65 },
    apex: { position: [25, -1, -15] },
    exit: { position: [27, -1.5, -17] },
    difficulty: 7,
    overtakingZone: false,
  },
  {
    id: 9,
    name: 'Turn 9',
    position: [30, -2, -20],
    type: 'medium',
    braking: { position: [28, -1.5, -18], intensity: 0.6 },
    apex: { position: [30, -2, -20] },
    exit: { position: [32, -2, -22] },
    difficulty: 6,
    overtakingZone: false,
  },
  {
    id: 10,
    name: 'Turn 10',
    position: [35, -2, -25],
    type: 'medium',
    braking: { position: [33, -2, -23], intensity: 0.7 },
    apex: { position: [35, -2, -25] },
    exit: { position: [37, -1.5, -27] },
    difficulty: 7,
    overtakingZone: false,
  },
  {
    id: 11,
    name: 'Turn 11 (Hairpin)',
    position: [40, -1, -30],
    type: 'slow',
    braking: { position: [38, -1.5, -28], intensity: 0.95 },
    apex: { position: [40, -1, -30] },
    exit: { position: [42, -0.5, -32] },
    difficulty: 8,
    overtakingZone: true,
  },
  {
    id: 12,
    name: 'Turn 12 (Back Straight)',
    position: [35, 0, -35],
    type: 'fast',
    braking: { position: [37, -0.5, -33], intensity: 0.2 },
    apex: { position: [35, 0, -35] },
    exit: { position: [33, 0, -37] },
    difficulty: 5,
    overtakingZone: false,
  },
  {
    id: 13,
    name: 'Turn 13',
    position: [30, 0, -40],
    type: 'medium',
    braking: { position: [32, 0, -38], intensity: 0.65 },
    apex: { position: [30, 0, -40] },
    exit: { position: [28, 0, -42] },
    difficulty: 6,
    overtakingZone: false,
  },
  {
    id: 14,
    name: 'Turn 14',
    position: [25, 0, -45],
    type: 'medium',
    braking: { position: [27, 0, -43], intensity: 0.6 },
    apex: { position: [25, 0, -45] },
    exit: { position: [23, 0, -47] },
    difficulty: 6,
    overtakingZone: false,
  },
  {
    id: 15,
    name: 'Turn 15 (Stadium)',
    position: [20, 0, -50],
    type: 'slow',
    braking: { position: [22, 0, -48], intensity: 0.9 },
    apex: { position: [20, 0, -50] },
    exit: { position: [18, 0.5, -52] },
    difficulty: 9,
    overtakingZone: true,
  },
  {
    id: 16,
    name: 'Turn 16',
    position: [15, 1, -55],
    type: 'medium',
    braking: { position: [17, 0.5, -53], intensity: 0.7 },
    apex: { position: [15, 1, -55] },
    exit: { position: [13, 1.5, -57] },
    difficulty: 7,
    overtakingZone: false,
  },
  {
    id: 17,
    name: 'Turn 17',
    position: [10, 1.5, -60],
    type: 'medium',
    braking: { position: [12, 1.5, -58], intensity: 0.65 },
    apex: { position: [10, 1.5, -60] },
    exit: { position: [8, 2, -62] },
    difficulty: 6,
    overtakingZone: false,
  },
  {
    id: 18,
    name: 'Turn 18',
    position: [5, 2, -65],
    type: 'medium',
    braking: { position: [7, 2, -63], intensity: 0.7 },
    apex: { position: [5, 2, -65] },
    exit: { position: [3, 2, -67] },
    difficulty: 7,
    overtakingZone: false,
  },
  {
    id: 19,
    name: 'Turn 19 (Final Corner)',
    position: [0, 2, -70],
    type: 'slow',
    braking: { position: [2, 2, -68], intensity: 0.85 },
    apex: { position: [0, 2, -70] },
    exit: { position: [-2, 2, -72] },
    difficulty: 8,
    overtakingZone: false,
  },
  {
    id: 20,
    name: 'Turn 20 (Start/Finish)',
    position: [-5, 2, -5],
    type: 'fast',
    braking: { position: [-3, 2, -71], intensity: 0.4 },
    apex: { position: [-5, 2, -5] },
    exit: { position: [-2, 2, 0] },
    difficulty: 5,
    overtakingZone: false,
  },
];

export const getCornerById = (id: number): CornerData | undefined => {
  return cotaCorners.find(corner => corner.id === id);
};

export const getOvertakingZones = (): CornerData[] => {
  return cotaCorners.filter(corner => corner.overtakingZone);
};

export const getCornersByDifficulty = (minDifficulty: number): CornerData[] => {
  return cotaCorners.filter(corner => corner.difficulty >= minDifficulty);
};
