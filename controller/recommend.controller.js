// const { OpenAI } = require("openai");
const qdrant = require('../config/qdrant');
const Recommend = require('../models/recommend.model');
// const { pipeline } = require("@xenova/transformers");
const { v4: uuidv4 } = require('uuid');

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.getQuizzes = async (req, res) => {
    const { pipeline } = await import("@xenova/transformers");

    // let input;
    const input = await Recommend.getVectorDBDimension();
    // console.log('data for input', input)
    // Recommend.getVectorDBDimension((err, data) => {
    //     if (err) {
    //         if (err.kind === "not_found") {
    //             res.status(404).send({
    //                 message: `Not found questionset`
    //             });
    //         } else {
    //             res.status(500).send({
    //                 message: err.message || "Some error occurred while retrieving questionset."
    //             });
    //         }
    //     }
    //     input = data
    //     console.log('data for input',data)

    // })



    let embedder;


    async function embedQuizText(inputArray) {
        if (!embedder) {
            console.log("Loading embedding pipeline...");
            embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        }

        const vectors = [];
        const successfulItems = [];

        for (const [index, item] of inputArray.entries()) {
            const text = `${item.title || ""} ${item.description || ""} ${item.short_desc || ""} ${item.tags || ""}`.trim();

            if (!text) {
                console.warn(`⚠️ Skipping empty quiz at index ${index}`);
                continue;
            }

            try {
                const result = await embedder(text, { pooling: "mean", normalize: true });

                if (!result?.data || result.data.length === 0) {
                    console.warn(`⚠️ Empty embedding for index ${index}`);
                    continue;
                }

                vectors.push(Array.from(result.data));
                successfulItems.push(item); // ✅ Keep aligned
            } catch (err) {
                console.warn(`⚠️ Failed to embed index ${index}:`, err.message);
            }
        }

        return { vectors, successfulItems };
    }

    // console.log('Input for embedding:', input);
    const { vectors, successfulItems } = await embedQuizText(input);

    if (vectors.length === 0) {
        return res.status(500).json({ error: "Embedding failed for all quizzes." });
    }

    const points = successfulItems.map((quiz, index) => ({
        id: uuidv4(),
        vector: vectors[index],
        payload: {
            title: quiz.title,
            short_desc: quiz.short_desc,
            description: quiz.description,
            tags: quiz.tags,
        },
    }));

    try {
        await qdrant.deleteCollection("quizzes");
        await qdrant.createCollection("quizzes", {
            vectors: {
                size: 384,
                distance: "Cosine",
            },
        });
        console.log("✅ Qdrant collection created.");
    } catch (err) {
        if (err.status === 409) {
            console.log("ℹ️ Collection already exists.");
        } else {
            console.error("❌ Error creating collection:", err);
        }
    }
    await qdrant.upsert("quizzes", {
        points,
    });

    const response = await qdrant.scroll('quizzes', {
        limit: 100,
        with_vector: true,
        with_payload: true,
    });

    // console.log("🔍 Scroll response:", response);

    const recommendations = await recommendQuizzes(input);

    res.json(recommendations);



    async function recommendQuizzes(userInput) {
        // const response = await qdrant.search(COLLECTION_NAME, {
        //     vector,
        //     limit: 5,
        // });

        // return response;


    }

}

exports.getUsers = async (req, res) => {
    const { pipeline } = await import("@xenova/transformers");

    const {email} = req.query;

    async function recommendQuizzes(userInput) {
        const response = await qdrant.scroll("users", {
            filter: {
                must: [
                    {
                        key: "email",
                        match: {
                            value: userInput,
                        }
                    }
                ]
            },
            limit: 1, // since email is unique
            with_vector: true // make sure to return the vector too
        });

        const userVector = response.points[0]?.vector;

        const recommendations = await qdrant.search("quizzes", {
            vector: userVector,
            limit: 50,
            // filter: {
            //     must_not: [
            //         {
            //             key: "id",
            //             match: {
            //                 value: attemptedQuizIds  // Exclude already attempted quiz IDs
            //             }
            //         }
            //     ]
            // }
        });
        return recommendations.map(item => ({
            id: item.id,
            score: item.score,
            payload: item.payload
        }));

    }

    const recommendations = await recommendQuizzes(email);
    const uniqueRecommendations = [];
    const seenQuizIds = new Set();

    for (const item of recommendations) {
        const quizScore = item.score;

        if (!seenQuizIds.has(quizScore) && uniqueRecommendations.length < 20) {
            seenQuizIds.add(quizScore);
            uniqueRecommendations.push({
                id: item.id,
                score: item.score,
                payload: item.payload
            });
        }
    }
    console.log("Unique Recommendations:", uniqueRecommendations);
    // console.log("Recommendations with score:", recommendations);
    const recommendationResponse = uniqueRecommendations.map(item => ({
        ...item.payload,
    }));
    console.log("Recommendations:", recommendationResponse);

    res.json(recommendationResponse);


}

exports.updateUserCollection = async (req, res) => {
    const { pipeline } = await import("@xenova/transformers");

    try {

        await qdrant.deleteCollection("users");
        const userInput = await Recommend.getUsersVectorDBDimension();

        let embedder;


        async function embedQuizText(inputArray) {
            if (!embedder) {
                console.log("Loading embedding pipeline...");
                embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
            }

            const vectors = [];
            const successfulItems = [];

            for (const [index, item] of inputArray.entries()) {
                const text = `${item.first_name || ""} ${item.last_name || ""} ${item.email || ""} ${item.tags || ""}`.trim();

                if (!text) {
                    console.warn(`⚠️ Skipping empty quiz at index ${index}`);
                    continue;
                }

                try {
                    const result = await embedder(text, { pooling: "mean", normalize: true });

                    if (!result?.data || result.data.length === 0) {
                        console.warn(`⚠️ Empty embedding for index ${index}`);
                        continue;
                    }

                    vectors.push(Array.from(result.data));
                    successfulItems.push(item); // ✅ Keep aligned
                } catch (err) {
                    console.warn(`⚠️ Failed to embed index ${index}:`, err.message);
                }
            }

            return { vectors, successfulItems };
        }

        // console.log('Input for embedding:', userInput);
        const { vectors, successfulItems } = await embedQuizText(userInput);

        if (vectors.length === 0) {
            return res.status(500).json({ error: "Embedding failed for all quizzes." });
        }

        const points = successfulItems.map((user, index) => ({
            id: uuidv4(),
            vector: vectors[index],
            payload: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                tags: user.tags,
            },
        }));
        // await qdrant.deleteCollection("users");
        try {
            await qdrant.createCollection("users", {
                vectors: {
                    size: 384,
                    distance: "Cosine",
                },
            });
            await qdrant.createPayloadIndex("users", {
                field_name: "email",
                field_schema: "keyword"
            });
          
            
        } catch (err) {
            if (err.status === 409) {
                console.log("ℹ️ users Collection already exists.");
            } else {
                console.error("❌ Error creating users collection:", err);
            }
        }
        await qdrant.upsert("users", {
            points,
        });

        const response = await qdrant.scroll('users', {
            limit: 100,
            with_vector: true,
            with_payload: true,
        });

        // console.log("🔍 Scroll response:", response);

        res.status(200).json({ message: "Collections updated successfully." });
    } catch (error) {
        console.error("Error updating collections:", error);
        res.status(500).json({ error: "Failed to update collections." });
    }
};

