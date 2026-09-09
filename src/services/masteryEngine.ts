import { MasteryMap, MasteryStatus, QuestionItem, SifirFactor, SifirFactRecord } from '../types/sifir';

export const calculateNewMasteryStatus = (
  attempts: number,
  correctCount: number,
  streak: number,
  avgLatencyMs: number
): MasteryStatus => {
  if (attempts === 0) return 'UNTOUCHED';
  const accuracy = correctCount / attempts;

  if (streak >= 5 && accuracy >= 0.85 && avgLatencyMs <= 3000) {
    return 'MASTERED';
  }
  if (attempts >= 3 && accuracy >= 0.7) {
    return 'PRACTICING';
  }
  return 'LEARNING';
};

export const updateFactRecord = (
  prev: SifirFactRecord,
  isCorrect: boolean,
  latencyMs: number
): SifirFactRecord => {
  const attempts = prev.attempts + 1;
  const correctCount = prev.correctCount + (isCorrect ? 1 : 0);
  const consecutiveStreak = isCorrect ? prev.consecutiveStreak + 1 : 0;
  const averageLatencyMs =
    prev.attempts === 0
      ? latencyMs
      : Math.round((prev.averageLatencyMs * prev.attempts + latencyMs) / attempts);

  const status = calculateNewMasteryStatus(
    attempts,
    correctCount,
    consecutiveStreak,
    averageLatencyMs
  );

  return {
    ...prev,
    attempts,
    correctCount,
    consecutiveStreak,
    averageLatencyMs,
    lastPracticedAt: Date.now(),
    status,
  };
};

export const generateDistractorOptions = (factorA: number, factorB: number): number[] => {
  const correct = factorA * factorB;
  const options = new Set<number>([correct]);

  const plausibleOffsets = [
    factorA,
    -factorA,
    factorB,
    -factorB,
    10,
    -10,
    1,
    -1,
    factorA * (factorB + 1),
    factorA * (factorB - 1),
  ];

  for (const offset of plausibleOffsets) {
    const val = typeof offset === 'number' ? correct + offset : offset;
    if (val > 0 && val !== correct && val <= 144) {
      options.add(val);
    }
    if (options.size >= 4) break;
  }

  while (options.size < 4) {
    const randomDelta = Math.floor(Math.random() * 9) - 4;
    const candidate = correct + randomDelta;
    if (candidate > 0 && candidate !== correct) {
      options.add(candidate);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
};

export interface FactDecomposition {
  readonly fixedFactor: number;
  readonly decomposedFactor: number;
  readonly part1: number;
  readonly part2: number;
  readonly subProduct1: number;
  readonly subProduct2: number;
  readonly totalProduct: number;
}

export const decomposeFact = (factorA: number, factorB: number): FactDecomposition => {
  let fixed = factorA;
  let split = factorB;

  if (factorB > 5) {
    fixed = factorA;
    split = factorB;
  } else if (factorA > 5) {
    fixed = factorB;
    split = factorA;
  }

  const part1 = split > 5 ? 5 : Math.max(1, Math.floor(split / 2));
  const part2 = split - part1;

  return {
    fixedFactor: fixed,
    decomposedFactor: split,
    part1,
    part2,
    subProduct1: fixed * part1,
    subProduct2: fixed * part2,
    totalProduct: factorA * factorB,
  };
};

function getDiagnosticReason(record: SifirFactRecord | undefined): string {
  if (!record || record.status === 'UNTOUCHED') {
    return 'Unexplored Territory';
  }
  if (record.averageLatencyMs > 3000) {
    return `High Latency (${(record.averageLatencyMs / 1000).toFixed(1)}s avg)`;
  }
  if (record.status === 'LEARNING') {
    return 'Struggling Fact (Needs Reinforcement)';
  }
  if (record.status === 'PRACTICING') {
    return 'Leveling up to Mastered';
  }
  return 'Fluency Refresher';
}

export const generateSmartQuestion = (
  masteryMap: MasteryMap,
  targetTable?: SifirFactor
): QuestionItem => {
  const allKeys = Object.keys(masteryMap);
  const eligibleKeys = targetTable
    ? allKeys.filter((k) => k.startsWith(`${targetTable}x`) || k.endsWith(`x${targetTable}`))
    : allKeys;

  // Calculate weights: Struggling/Untouched facts get higher weight
  const weightedList: { key: string; weight: number }[] = eligibleKeys.map((key) => {
    const fact = masteryMap[key];
    let weight = 1;
    if (!fact || fact.status === 'UNTOUCHED') weight = 4;
    else if (fact.status === 'LEARNING') weight = 6;
    else if (fact.status === 'PRACTICING') weight = 3;
    else if (fact.status === 'MASTERED') weight = 1;

    // Boost if slow
    if (fact && fact.averageLatencyMs > 3500) weight += 3;
    return { key, weight };
  });

  const totalWeight = weightedList.reduce((sum, item) => sum + item.weight, 0);
  let randomChoice = Math.random() * totalWeight;

  let selectedKey = eligibleKeys[0];
  for (const item of weightedList) {
    if (randomChoice < item.weight) {
      selectedKey = item.key;
      break;
    }
    randomChoice -= item.weight;
  }

  const [aStr, bStr] = selectedKey.split('x');
  const factorA = parseInt(aStr, 10) as SifirFactor;
  const factorB = parseInt(bStr, 10) as SifirFactor;
  const product = factorA * factorB;
  const record = masteryMap[selectedKey];

  return {
    factorA,
    factorB,
    product,
    options: generateDistractorOptions(factorA, factorB),
    diagnosticReason: getDiagnosticReason(record),
  };
};
