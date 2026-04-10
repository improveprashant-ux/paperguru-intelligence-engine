export const DIFFICULTY = {
  EASY: 'easy',
  AVERAGE: 'average',
  HARD: 'hard',
};

export const BLOOM_LEVEL = {
  REMEMBER: 'remember',
  UNDERSTAND: 'understand',
  APPLICATION: 'application',
  ANALYSIS: 'analysis',
  EVALUATION: 'evaluate',
  CREATE: 'create',
};

export const QUESTION_TYPE = {
  MCQ: 'mcq',
  ASSERTION_REASON: 'assertion_reason',
  CASE_STUDY: 'case_study',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
};

export function calculateTopicProbability(topic, history) {
  const currentYear = 2027;
  const last15Years = Array.from({ length: 15 }, (_, i) => currentYear - i - 1);
  
  const appearancesInLast15 = history.filter(y => last15Years.includes(y)).length;
  const evergreenThreshold = 0.8;
  
  const isEvergreen = appearancesIn15 >= 12;
  const lastSeen = Math.min(...history.filter(y => y < currentYear));
  const cyclesSinceSeen = currentYear - lastSeen;
  const isDormant = cyclesSinceSeen >= 3;
  
  let probability = 0.3;
  
  if (isEvergreen) {
    probability += 0.4;
  }
  
  if (isDormant) {
    probability += 0.3;
  }
  
  const recentFrequency = history.filter(y => [2024, 2025, 2026].includes(y)).length;
  if (recentFrequency === 0) {
    probability += 0.2;
  } else if (recentFrequency === 1) {
    probability += 0.1;
  }
  
  return Math.min(probability, 1);
}

export function generatePaperRules(totalScore = 80) {
  return {
    easy: {
      count: Math.round(totalScore * 0.3 / 1),
      scorePerQuestion: 1,
      bloomLevel: [BLOOM_LEVEL.REMEMBER, BLOOM_LEVEL.UNDERSTAND],
      description: 'Direct questions from NCERT',
    },
    average: {
      count: Math.round(totalScore * 0.5 / 2),
      scorePerQuestion: 2,
      bloomLevel: [BLOOM_LEVEL.APPLICATION],
      description: 'Conceptual understanding required',
    },
    hard: {
      count: Math.round(totalScore * 0.2 / 3),
      scorePerQuestion: 3,
      bloomLevel: [BLOOM_LEVEL.ANALYSIS, BLOOM_LEVEL.EVALUATION],
      description: 'HOTS + multi-chapter synthesis',
    },
  };
}

export function apply30_50_20Rule(questions, rules) {
  const easyQuestions = questions.filter(q => 
    rules.easy.bloomLevel.includes(q.bloomLevel)
  ).slice(0, rules.easy.count);
  
  const averageQuestions = questions.filter(q => 
    rules.average.bloomLevel.includes(q.bloomLevel)
  ).slice(0, rules.average.count);
  
  const hardQuestions = questions.filter(q => 
    rules.hard.bloomLevel.includes(q.bloomLevel)
  ).slice(0, rules.hard.count);
  
  return [
    ...easyQuestions,
    ...averageQuestions,
    ...hardQuestions,
  ];
}

export function identifyHighEntropyTopics(questions, history, currentYear = 2027) {
  const topicEntropy = {};
  
  questions.forEach(q => {
    const topicHistory = history[q.topicId] || [];
    const appearances = topicHistory.filter(y => y >= currentYear - 15 && y < currentYear).length;
    const weightage = q.weightage || 1;
    
    let entropy = 0;
    
    if (appearances === 0) {
      entropy = 0.9;
    } else if (appearances <= 2) {
      entropy = 0.7;
    } else if (appearances <= 5) {
      entropy = 0.4;
    } else {
      entropy = 0.2;
    }
    
    const lastSeen = Math.max(...topicHistory.filter(y => y < currentYear), 0);
    if (currentYear - lastSeen > 3) {
      entropy += 0.3;
    }
    
    entropy *= weightage;
    
    topicEntropy[q.topicId] = entropy;
  });
  
  return Object.entries(topicEntropy)
    .sort(([, a], [, b]) => b - a)
    .map(([topicId]) => topicId);
}

export function analyzeGaps(questions, history, currentYear = 2027) {
  const gapAnalysis = [];
  
  const topicCounts = {};
  questions.forEach(q => {
    const historyYears = history[q.topicId] || [];
    const last3Years = historyYears.filter(y => currentYear - y <= 3);
    
    topicCounts[q.topicId] = {
      count: last3Years.length,
      lastSeen: Math.max(...historyYears.filter(y => y < currentYear), 0),
      weightage: q.weightage || 1,
    };
  });
  
  Object.entries(topicCounts).forEach(([topicId, data]) => {
    if (data.count === 0) {
      gapAnalysis.push({
        topicId,
        reason: 'Not asked in last 3 years',
        priority: 'high',
        potentialScore: data.weightage * 3,
      });
    } else if (data.count === 1 && data.lastSeen === currentYear - 1) {
      gapAnalysis.push({
        topicId,
        reason: 'Only asked once recently (possible rotation)',
        priority: 'medium',
        potentialScore: data.weightage * 2,
      });
    }
  });
  
  return gapAnalysis.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function filterCompetencyBased(questions, targetPercentage = 0.5) {
  const cbqTypes = [QUESTION_TYPE.ASSERTION_REASON, QUESTION_TYPE.CASE_STUDY];
  
  const cbqQuestions = questions.filter(q => cbqTypes.includes(q.type));
  const nonCbqQuestions = questions.filter(q => !cbqTypes.includes(q.type));
  
  const targetCbqCount = Math.round(questions.length * targetPercentage);
  
  if (cbqQuestions.length >= targetCbqCount) {
    return [
      ...cbqQuestions.slice(0, targetCbqCount),
      ...nonCbqQuestions.slice(0, questions.length - targetCbqCount),
    ];
  }
  
  return questions;
}

export function applyBlackSwan(questions, isEnabled) {
  if (!isEnabled) return questions;
  
  return questions.map(q => {
    if (q.difficulty === DIFFICULTY.HARD) {
      return {
        ...q,
        complexity: 'topper-level',
        isMultiChapter: true,
        hasPlausibleDistractors: true,
      };
    }
    return q;
  });
}

export function calculateConfidenceScore(questions, history) {
  let score = 50;
  
  const topicCoverage = new Set(questions.map(q => q.topicId)).size;
  score += Math.min(topicCoverage * 2, 20);
  
  const hasEasy = questions.some(q => q.difficulty === DIFFICULTY.EASY);
  const hasAverage = questions.some(q => q.difficulty === DIFFICULTY.AVERAGE);
  const hasHard = questions.some(q => q.difficulty === DIFFICULTY.HARD);
  
  if (hasEasy && hasAverage && hasHard) score += 15;
  
  const hasCBQ = questions.some(q => 
    [QUESTION_TYPE.CASE_STUDY, QUESTION_TYPE.ASSERTION_REASON].includes(q.type)
  );
  if (hasCBQ) score += 10;
  
  const recentlySeen = questions.filter(q => {
    const historyYears = history[q.topicId] || [];
    return historyYears.some(y => y >= 2024);
  }).length;
  score += Math.min(recentlySeen * 1, 5);
  
  return Math.min(score, 100);
}