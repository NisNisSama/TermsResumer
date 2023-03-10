
const API_TOKEN = process.env.HUGGING_FACE_API_KEY;

async function summarize(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/google/pegasus-large",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

const summarizeAction = async (req, res) => {
    try {
        summarize({inputs: req.body.userInput}).then((response) => {
            res.status(200).json({ output: response });
        });
    } catch (error) {
        alert(error);
    }
}

export default summarizeAction;