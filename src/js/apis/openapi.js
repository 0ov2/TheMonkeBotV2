const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const getOpenAIAnswer = async (question) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
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