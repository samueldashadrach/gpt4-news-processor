const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const gpt4 = async (messages) => {
	// defaults:
	temperature = 1
	top_p = 1
	presence_penalty = 0
	frequency_penalty = 0

	const completion = await openai.createChatCompletion({
		model: "gpt-4",
		messages: messages,
		temperature: temperature,
		top_p: top_p,
		presence_penalty: presence_penalty,
		frequency_penalty: frequency_penalty
	});

	messageLatest = completion.data.choices[0].message
	// Important: this appends to messages array in-place
	messages.push(messageLatest)

	return messageLatest

}

module.exports = { gpt4 };