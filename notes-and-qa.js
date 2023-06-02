const { gpt4 } = require("./openai-config");

const generateNotes = async (urlObjects) => {

	for (var urlObject of urlObjects) {

		if (!Object.hasOwn(urlObject, "notes")) {

			messages = []

			prompt = "\n This is a news article. Please highlight some of the more important information in this article: "
			+ "\n\"\"\"\n "
			+ urlObject.pageBody
			+ "\n\"\"\"";

			messages.push({role: "user", content: prompt})
			messageLatest = await gpt4(messages);

			prompt = "\n Now please generate notes of this information in bullet points for a student studying current affairs: "
			
			messages.push({role: "user", content: prompt})
			messageLatest = await gpt4(messages);
			
			urlObject.notes = messageLatest.content;

		}
	}
}

module.exports = { generateNotes };