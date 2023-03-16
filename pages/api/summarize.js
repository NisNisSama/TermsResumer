
const API_TOKEN = process.env.HUGGING_FACE_API_KEY;

async function summarize(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result1 = await response.json();

    //pszemraj/long-t5-tglobal-base-16384-book-summary
    /* const response2 = await fetch(
        "https://api-inference.huggingface.co/models/tuner007/pegasus_summarizer",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result2 = await response2.json(); */
    //\n${result2[0].summary_text}
    const result = `${result1[0].summary_text}`;

    return result;
}

const summarizeAction = async (req, res) => {
    try {
        summarize({inputs: req.body.userInput}).then((response) => {
            res.status(200).json({ output: response });
        });
    } catch (error) {
        console.log(error);
    }
}

export default summarizeAction;