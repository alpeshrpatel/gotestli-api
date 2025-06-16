const GROQ_API_KEY = process.env.GROQ_API_KEY; 
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Controller for handling Groq API requests
const GroqApiController = {
    
    // Main controller method that handles all topic analysis functionality
    analyzeQuestionTopics: async (req, res) => {
        try {
            const { questions, batchSize = 20, enableBatching = false } = req.body;

            // Validate input
            if (!questions || !Array.isArray(questions) || questions.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Questions array is required and must not be empty'
                });
            }

            // Validate questions format
            const invalidQuestions = questions.filter(q => !q.question || typeof q.question !== 'string');
            if (invalidQuestions.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'All questions must have a "question" property with string value'
                });
            }

            let result;

            // Choose analysis method based on question count and user preference
            if (enableBatching && questions.length > batchSize) {
                // Use batch processing for large datasets
                result = await analyzeBatchQuestionsAsync(questions, batchSize);
            } else {
                // Use single analysis for smaller datasets
                result = await analyzeQuestionTopicsAsync(questions);
            }

            // Return success response
            res.status(200).json({
                success: true,
                data: result,
                metadata: {
                    totalQuestions: questions.length,
                    analysisType: enableBatching && questions.length > batchSize ? 'batch' : 'single',
                    timestamp: new Date().toISOString()
                }
            });

        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error during topic analysis',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

// Async wrapper for single analysis
async function analyzeQuestionTopicsAsync(questions) {
    return new Promise((resolve, reject) => {
        analyzeQuestionTopicsCore(questions, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

// Async wrapper for batch analysis
async function analyzeBatchQuestionsAsync(questions, batchSize) {
    return new Promise((resolve, reject) => {
        analyzeBatchQuestionsCore(questions, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        }, batchSize);
    });
}

// Core single analysis function
async function analyzeQuestionTopicsCore(questions, callback) {
    try {
        const questionsText = questions.map((q, index) =>
            `${index + 1}. ${q.question}`
        ).join('\n');

        const prompt = createAnalysisPrompt(questionsText);

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert educational content analyzer. Analyze questions and identify their topics precisely."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "llama3-8b-8192",
                temperature: 0.1,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const analysis = parseTopicAnalysis(data.choices[0].message.content);
        
        callback(null, analysis);

    } catch (error) {
        console.error('Error analyzing topics:', error);
        callback(new Error('Topic analysis failed'), null);
    }
}

// Core batch analysis function
async function analyzeBatchQuestionsCore(questions, callback, batchSize = 20) {
    try {
        const batches = [];
        for (let i = 0; i < questions.length; i += batchSize) {
            batches.push(questions.slice(i, i + batchSize));
        }

        const batchResults = [];

        for (const batch of batches) {
            await new Promise((resolve, reject) => {
                analyzeQuestionTopicsCore(batch, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        batchResults.push(result);
                        resolve();
                    }
                });
            });
        }

        const mergedResults = mergeBatchResults(batchResults);
        callback(null, mergedResults);

    } catch (error) {
        console.error('Error in batch analysis:', error);
        callback(error, null);
    }
}

// Create structured prompt for topic analysis
function createAnalysisPrompt(questionsText) {
    return `
Analyze the following quiz questions and identify the main topics covered.

QUESTIONS:
${questionsText}

Please provide your analysis in the following JSON format:
{
    "topics": [
        {
            "name": "Topic Name",
            "questions": [1, 2, 3],
            "description": "Brief description of what this topic covers"
        }
    ],
    "totalTopics": 3,
    "hasThreeOrMoreTopics": true,
    "topicDistribution": {
        "balanced": true,
        "dominantTopic": "Topic Name (if any)"
    },
    "recommendations": ["suggestion1", "suggestion2"]
}

Rules for analysis:
1. Group questions by their primary academic/subject topic
2. Be specific but not overly granular (e.g., "Mathematics - Algebra" not just "Mathematics")
3. A topic should have at least 2 questions to be considered significant
4. Consider semantic similarity, not just keyword matching
5. Identify if topics are balanced or if one dominates
6. Provide Detailed recommendations for improving topic coverage if fewer than 3 topics are found


Return only the JSON, no additional text.`;
}

// Parse the AI response
function parseTopicAnalysis(response) {
    try {
        // Clean the response to extract JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }

        const analysis = JSON.parse(jsonMatch[0]);

        // Add validation and enhancement
        return {
            ...analysis,
            isValid: validateTopicAnalysis(analysis),
            summary: generateSummary(analysis)
        };
    } catch (error) {
        console.error('Error parsing analysis:', error);
        return createFallbackAnalysis();
    }
}

// Validate the analysis results
function validateTopicAnalysis(analysis) {
    return analysis.topics &&
        analysis.topics.length >= 3 &&
        analysis.totalTopics >= 3 &&
        analysis.hasThreeOrMoreTopics === true;
}

// Generate human-readable summary
function generateSummary(analysis) {
    const topicNames = analysis.topics.map(t => t.name);
    const totalQuestions = analysis.topics.reduce((sum, topic) => sum + topic.questions.length, 0);

    return {
        message: analysis.hasThreeOrMoreTopics
            ? `✅ Quiz covers ${analysis.totalTopics} different topics: ${topicNames.join(', ')}`
            : `❌ Quiz only covers ${analysis.totalTopics} topics. Need at least 3 different topics.`,
        topicBreakdown: analysis.topics.map(topic => ({
            topic: topic.name,
            questionCount: topic.questions.length,
            percentage: Math.round((topic.questions.length / totalQuestions) * 100)
        }))
    };
}

// Fallback analysis if AI parsing fails
function createFallbackAnalysis() {
    return {
        topics: [],
        totalTopics: 0,
        hasThreeOrMoreTopics: false,
        isValid: false,
        error: 'Failed to analyze topics properly',
        summary: {
            message: '❌ Unable to analyze question topics. Please review manually.',
            topicBreakdown: []
        }
    };
}

// Merge results from multiple batches
function mergeBatchResults(batchResults) {
    const allTopics = [];
    const allRecommendations = [];

    batchResults.forEach(result => {
        if (result.topics) {
            allTopics.push(...result.topics);
        }
        if (result.recommendations) {
            allRecommendations.push(...result.recommendations);
        }
    });

    // Merge similar topics
    const mergedTopics = mergeTopics(allTopics);

    return {
        topics: mergedTopics,
        totalTopics: mergedTopics.length,
        hasThreeOrMoreTopics: mergedTopics.length >= 3,
        isValid: mergedTopics.length >= 3,
        recommendations: [...new Set(allRecommendations)],
        summary: generateSummary({
            topics: mergedTopics,
            totalTopics: mergedTopics.length,
            hasThreeOrMoreTopics: mergedTopics.length >= 3
        })
    };
}

// Helper to merge similar topics from different batches
function mergeTopics(topics) {
    const topicMap = new Map();

    topics.forEach(topic => {
        const key = topic.name.toLowerCase().trim();
        if (topicMap.has(key)) {
            const existing = topicMap.get(key);
            existing.questions.push(...topic.questions);
        } else {
            topicMap.set(key, { ...topic });
        }
    });

    return Array.from(topicMap.values());
}

module.exports = GroqApiController;