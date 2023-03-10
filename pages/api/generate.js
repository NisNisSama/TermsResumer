import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
    const basePromptPrefix =
`
Request : Make a short resumed story about the title below with a very interesting plot about betrayal.

Title: ${req.body.userInput}

Resume:
`;

  console.log(basePromptPrefix)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: basePromptPrefix,
    temperature: 0.2,
    max_tokens: 200,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
Request: Develop a full adventure story in a style of Victor Hugo with beginning, middle and ending using the title and the resume below. Add an unexpected twist at the end of the story.

Title: ${req.body.userInput}

Resume: ${basePromptOutput.text}

Story:
`;

    console.log(secondPrompt);

    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        // I set a higher temperature for this one. Up to you!
        temperature: 0.8,
            // I also increase max_tokens.
        max_tokens: 650,
    });

    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;