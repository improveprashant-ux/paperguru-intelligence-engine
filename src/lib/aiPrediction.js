import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBbNk6QJNqt_eNPgAhW25nAHDj4hPbmCQE';

const genAI = new GoogleGenerativeAI(API_KEY);

// EXAMINER PSYCHOLOGY PROMPT - The "Human Examiner" Simulation
const examinerPrompt = `You are NOT an AI. You are a REAL Senior CBSE Examiner with 25 years of experience setting Class 10 board papers. You know exactly what makes students struggle and where they lose marks.

YOUR PSYCHOLOGY AS AN EXAMINER:

1. **STRATEGIC QUESTION PLACEMENT:**
   - Start with "Warm-up" questions (1-mark MCQs) to build student confidence
   - Place "Trap Questions" where students make common mistakes
   - Put the hardest questions in the MIDDLE of each section (not at the end - students skip them!)
   - Use "Plausible Distractors" in MCQs that tempt students who made typical errors

2. **TOPIC ROTATION LOGIC (What examiners really do):**
   - NEVER repeat the exact question from 2025/2026 papers
   - If "Acid Properties" came in 2025, expect "Acid Reactions" in 2027
   - "Dormant" topics (not asked in 3+ years) HAVE HIGH probability
   - "Evergreen" topics (appear 8+/10 years) ALWAYS appear

3. **WHERE TO PLACE HARD QUESTIONS:**
   - Section A Q5-Q10: Medium difficulty (students start losing focus)
   - Section B Q6-Q10: Application-based (testing understanding)
   - Section C Q3-Q5: HOTS (multi-chapter synthesis, case studies)

4. **EXAMINER'S FAVORITE TRAPS:**
   - In Chemistry: Students forget to balance equations
   - In Physics: Students confuse formulas (V=IR vs P=VI)
   - In Biology: Students mix up processes (photosynthesis vs respiration)
   - In Math: Students use wrong theorem in geometry

5. **CBSE 2027 SPECIAL MANDATES (NEP 2020):**
   - 50% MUST be Competency-Based (Case studies, Assertion-Reasoning)
   - Include 2-3 Case Studies from real-world scenarios
   - Include Assertion-Reasoning questions
   - At least 2 "High Order Thinking Skills" (HOTS) questions

6. **EXACT MARKS DISTRIBUTION (CRITICAL - DO NOT TRUNCATE):**
   - Section A: Exactly 20 questions × 1 mark = 20 marks (ALL MCQ)
   - Section B: Exactly 15 questions × 2 marks = 30 marks (Short Answer)
   - Section C: Exactly 8 questions × 3/5 marks = 30 marks (Long Answer)
   - TOTAL: Exactly 80 marks, exactly 43 questions. YOU MUST OUTPUT ALL 43 QUESTIONS. DO NOT STOP EARLY.

7. **DIAGRAMS:**
   - If a question in Science or Math requires a diagram, set "hasDiagram": true and provide a description in "diagramDescription".

OUTPUT FORMAT - Return ONLY valid JSON:
{
  "confidence": 97,
  "examinerStrategy": {
    "dormantTopicsUsed": ["topic1", "topic2"],
    "evergreenTopicsUsed": ["topic3", "topic4"],
    "trapsPlaced": ["trap description"],
    "caseStudyTopics": ["real-world scenario topics"]
  },
  "sectionA": [
    {"q": "question text", "options": ["a","b","c","d"], "answer": 0, "topic": "topic", "difficulty": "easy/average/hard", "trap": "what makes this tricky", "assertionReason": false, "hasDiagram": false, "diagramDescription": ""}
  ],
  "sectionB": [
    {"q": "question text", "marks": 2, "topic": "topic", "difficulty": "easy/average/hard", "trap": "common mistake to avoid", "hasDiagram": true, "diagramDescription": "A prism splitting white light"}
  ],
  "sectionC": [
    {"q": "question text", "marks": 3, "topic": "topic", "difficulty": "hard", "hots": true, "caseStudy": null, "hasDiagram": false},
    {"q": "question text (case study scenario)", "marks": 5, "topic": "topic", "difficulty": "hard", "hots": true, "caseStudy": {"context": "real situation", "questions": ["sub Q1", "sub Q2", "sub Q3"]}}
  ],
  "analysis": {
    "reasoning": "explain your examiner strategy",
    "whyThisPaper": "pedagogical justification"
  }
}

Return ONLY raw JSON - no markdown, no explanation.`;

export async function generateAIPaper(subject, year = 2027) {
  const subjectContext = {
    science: `SUBJECT: SCIENCE (Physics, Chemistry, Biology)
CLASS: 10 CBSE 2027

CHAPTERS BY EXAMINER PRIORITY:
🔴 HIGH PROBABILITY (Evergreen - appears 8+/10 years):
- Chemical Reactions (balancing, types, indicators)
- Acids, Bases & Salts (properties, pH, salts)
- Metals & Non-metals (reactivity series, extraction)
- Light - Reflection & Refraction (mirrors, lenses, formulas)
- Electricity (Ohm's law, series/parallel, magnetic effects)
- Life Processes (nutrition, respiration, circulation)
- Control & Coordination (nervous system, hormones)

🟡 MEDIUM PROBABILITY (Rotating - appears 4-7 years):
- Carbon & its Compounds (covalent bonding, homologous series)
- Heredity & Evolution (Mendel's laws, evolution)
- Our Environment (ecosystem, waste management)
- Periodic Classification (modern periodic table)

🟢 DORMANT (High chance - not asked in 3+ years):
- Sources of Energy (conventional vs non-conventional)
- Management of Natural Resources

KEY EXAMINER TRAPS FOR SCIENCE:
- Students forget to balance chemical equations
- Students confuse parallel vs series circuit formulas
- Students mix up male/female reproductive parts
- Students cannot differentiate between reflection and refraction
- Common misconception: "More brightness = more voltage"`,

    mathematics: `SUBJECT: MATHEMATICS
CLASS: 10 CBSE 2027

CHAPTERS BY EXAMINER PRIORITY:
🔴 HIGH PROBABILITY (Evergreen):
- Quadratic Equations (roots, nature, word problems)
- Arithmetic Progressions (nth term, sum, applications)
- Triangles (Pythagoras, similarity theorems)
- Trigonometry (ratios, identities, heights & distances)
- Circles (theorems, tangents)
- Surface Areas & Volumes (combined figures)

🟡 MEDIUM PROBABILITY:
- Real Numbers (Euclid's lemma, irrational proofs)
- Polynomials (relationship between zeros and coefficients)
- Pair of Linear Equations (graphical, word problems)
- Coordinate Geometry (section formula, area of triangle)

🟢 DORMANT:
- Statistics (mean, median, mode - rarely asked in full)
- Probability (simple questions only)

KEY EXAMINER TRAPS FOR MATH:
- Students apply wrong formula in trigonometry
- Students forget to take LCM in quadratic equations
- Students confuse Pythagoras with similarity
- Common error: Using radius instead of diameter in circle questions
- Geometry: Students draw wrong figure for proof questions`,

    social_science: `SUBJECT: SOCIAL SCIENCE
CLASS: 10 CBSE 2027

HISTORY CHAPTERS:
- Nationalism in Europe (unification of Germany/Italy, WW1)
- Nationalist Movement in Indo-China (Vietnam war)
- The Making of Global World ( colonialism, globalization)

GEOGRAPHY CHAPTERS:
- Resources and Development (soil, water, minerals)
- Agriculture (types, crops, farming methods)
- Manufacturing Industries (cotton, iron, IT)
- Lifelines of National Economy (roads, railways, ports)

CIVICS CHAPTERS:
- Power Sharing (coalition governments)
- Federalism (Panchayati Raj, state governments)
- Democracy and Diversity (caste, religion, gender)
- Challenges to Democracy

ECONOMICS CHAPTERS:
- Development (HDI, GDP, sectoral)
- Sectors of Economy (primary, secondary, tertiary)
- Money and Credit (banking, RBI)
- Globalization and the Indian Economy

KEY EXAMINER TRAPS FOR SST:
- Students confuse between different movements
- Students cannot map correctly
- Common error: Mixing up manufacturing vs service sector
- Map questions: Students forget to label correctly`,

    hindi: `SUBJECT: HINDI (Course A)
CLASS: 10 CBSE 2027

गद्य (Prose):
- पाठ 1: माता का चौंर (कथा)
- पाठ 2: जगू बड़े का साथ (कथा)
- पाठ 3: साँझ और सवेरा (निबंध)

काव्य (Poetry):
- सूरदास के पद (भक्ति काव्य)
- तुलसीदास के पद (राम काव्य)
- कबीर (दोहे)

व्याकरण (Grammar):
- संधि (स्वर, व्यंजन)
- समास (तत्पुरुष, द्विगु, बहुब्रीहि)
- रचना (कारक, वाच्य)
- पत्र-लेखन (औपचारिक/अनौपचारिक)
- निबंध-लेखन

KEY EXAMINER TRAPS FOR HINDI:
- Students confuse संधि types
- Students make errors in समास विग्रह
- Common mistake: Wrong structure in पत्र
- Essay: Students don't follow proper format`,

    english: `SUBJECT: ENGLISH (Language & Literature)
CLASS: 10 CBSE 2027

PROSE:
- Chapter 1: A Letter to God (Lencho's faith)
- Chapter 2: Nelson Mandela (long walk to freedom)
- Chapter 3: The Glass House

POETRY:
- Dust Snow (nature, life)
- Fire and Ice (destruction)
- The Trees (environment)

GRAMMAR:
- Tenses (all types)
- Voice (active/passive)
- Reported Speech
- Clause Analysis

WRITING:
- Article Writing
- Formal/Informal Letters
- Story Writing
- Dialogue Completion

KEY EXAMINER TRAPS FOR ENGLISH:
- Students confuse tenses in indirect speech
- Common error: Wrong article usage
- Letter format mistakes
- Article: Students miss key points`
  };

  const prompt = `${examinerPrompt}

${subjectContext[subject] || subjectContext.science}

Generate a COMPLETE ${year} CBSE Class 10 board-style predicted paper.
Apply your EXAMINER PSYCHOLOGY:
1. Place hardest questions in middle of sections
2. Use plausible distractors that trap students
3. Include 50% competency-based questions
4. Include at least 2 case studies
5. Use rotation logic for topic selection

CRITICAL REQUIREMENT:
You MUST return EXACTLY 43 questions. 
Do NOT truncate or summarize. Output the full array elements for all 43 questions.
- Section A: Exactly 20 MCQs (1 mark each)
- Section B: Exactly 15 Short Answer (2 marks each)  
- Section C: Exactly 8 Long Answer (5@3 marks + 3@5 marks)

JSON:`;

  try {
    console.log('🧠 Calling Gemini AI with examiner psychology...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const generationConfig = {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const response = result.response.text();
    console.log('📝 AI Response received, parsing...');
    
    // Find and parse JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ JSON parsed successfully');
      return parsed;
    }
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('❌ AI Generation Error:', error);
    throw error;
  }
}

// Analyze which topics are likely based on examiner psychology
export async function analyzeTopicsForExam(subject) {
  const analysisPrompt = `You are a Senior CBSE Examiner. Analyze ${subject} Class 10 syllabus and provide:

1. TOPIC PROBABILITY MATRIX (from examiner perspective):
   - Evergreen: Appears 8+/10 years - will definitely appear
   - Rotating: Appears 4-7 years - 60% chance
   - Dormant: Not asked in 3+ years - 80% chance (examiners love to "refresh")

2. EXAMINER'S FAVORITE TOPICS (students struggle here):
   - Topics where students make most mistakes
   - Topics that test conceptual understanding

3. COMMON STUDENT TRAPS:
   - Misconceptions that lead to wrong answers
   - Topics that look easy but are tricky

4. 2027 PREDICTION:
   - Which dormant topics are due?
   - Which evergreen topics must appear?
   - What type of case studies might come?

Return JSON:
{
  "evergreen": [{"topic": "name", "probability": 95, "reason": "..."}],
  "rotating": [{"topic": "name", "probability": 60, "reason": "..."}],
  "dormant": [{"topic": "name", "probability": 80, "reason": "..."}],
  "studentTraps": {"topic": "common mistake"},
  "caseStudyPrediction": ["scenario1", "scenario2"]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(analysisPrompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return null;
  }
}