/**
 * Stub service for AI Evaluation.
 * Replace the internals of this function with an actual OpenAI / Anthropic API call.
 */

const evaluateAnswer = async (questionText, sampleAnswer, evaluationKeywords, userAnswer) => {
    // In a real scenario, you'd send a prompt like:
    // "Evaluate the following user answer against the standard sample answer and these keywords. Return JSON with score 0-10, strength, weakness, improvementSuggestion."

    // ----------------------------------------------------
    // MOCK LOGIC: basic keyword matching for demonstration
    // ----------------------------------------------------
    const answerLower = userAnswer.toLowerCase();

    let keywordMatchCount = 0;
    evaluationKeywords.forEach(kw => {
        if (answerLower.includes(kw.toLowerCase())) {
            keywordMatchCount++;
        }
    });

    const matchRatio = keywordMatchCount / evaluationKeywords.length;

    // Base score on answer length and keyword matches
    let score = 0;
    if (userAnswer.trim().length > 10) score += 3;
    if (userAnswer.trim().length > 50) score += 2;

    score += Math.round(matchRatio * 5); // up to 5 points for keywords
    if (score > 10) score = 10;

    // Generate generic feedback based on score
    let strength = 'Good effort attempting the question.';
    let weakness = 'Missed key technical terms.';
    let improvementSuggestion = 'Review core concepts and include more specific terminology.';

    if (score >= 8) {
        strength = 'Excellent grasp of the core concepts, hit the key keywords.';
        weakness = 'Minor edge cases could be explored further.';
        improvementSuggestion = 'Try to elaborate on practical use cases of this concept.';
    } else if (score >= 5) {
        strength = 'Understand the basic premise.';
        weakness = 'Lacking depth and specific key terms.';
        improvementSuggestion = `Make sure to brush up on concepts like: ${evaluationKeywords.join(', ')}.`;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        score,
        feedback: {
            strength,
            weakness,
            improvementSuggestion
        }
    };
};

module.exports = {
    evaluateAnswer
};
