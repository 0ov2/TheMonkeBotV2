const { Configuration, OpenAIApi } = require('openai');

const getOpenAIAnswer = async (question, apiKey) => {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 4000,
      temperature: 0,
    });

    console.log(response.data.choices);
    return response.data.choices[0].text;
  } catch (error) {
    console.error(error);
    return "Error: Could not get an answer from OpenAI.";
  }
}

module.exports = {getOpenAIAnswer}