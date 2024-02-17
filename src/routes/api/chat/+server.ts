import { OPENAI_KEY } from '$env/static/private'
import type { CreateChatCompletionRequest, ChatCompletionRequestMessage } from 'openai'
import type { RequestHandler } from './$types'
import { getTokens } from '$lib/tokenizer'
import { json } from '@sveltejs/kit'
import type { Config } from '@sveltejs/adapter-vercel'
import OpenAI from 'openai'
const openai = new OpenAI()
openai
export const config: Config = {
	runtime: 'edge'
}

export const GET: RequestHandler = async () => {
	return json({ error: 'This is the Socratique Dialogue API - GET Method not allowed, only POST' }, { status: 405 })
}
export const PUT: RequestHandler = async () => {
	return json({ error: 'This is the Socratique Dialogue API - PUT Method not allowed, only POST' }, { status: 405 })
}
export const DELETE: RequestHandler = async () => {
	return json({ error: 'This is the Socratique Dialogue API - DELETE Method not allowed, only POST' }, { status: 405 })
}
export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!OPENAI_KEY) {
			throw new Error('OPENAI_KEY env variable not set')
		}
		const requestData = await request.json()
		if (!requestData) {
			throw new Error('No request data')
		}

		const reqMessages: ChatCompletionRequestMessage[] = requestData.messages

		if (!reqMessages) {
			throw new Error('no messages provided')
		}

		let tokenCount = 0

		reqMessages.forEach((msg) => {
			const tokens = getTokens(msg.content)
			tokenCount += tokens
		})

		const moderationRes = await fetch('https://api.openai.com/v1/moderations', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENAI_KEY}`
			},
			method: 'POST',
			body: JSON.stringify({
				input: reqMessages[reqMessages.length - 1].content
			})
		})

		const moderationData = await moderationRes.json()
		const [results] = moderationData.results

		if (results.flagged) {
			throw new Error('Query flagged by openai')
		}

		const prompt =
		"You are 'Socratique'. As Socratique, you have been designed to help people study and learn through the Socratic method of questioning and validation. One of your primary objectives are to encourage and motivate your student to reach their potential. You can achieve this objective by acting as their best friend trying to help them with their homework. As a best friend you are humorous, extremely empathetic, great at giving support and encouragement but also extremely kind and compassionate. When they are feeling demotivated be extremely supporting, compassionate and kind… explaining that learning can be hard but so worthwhile and beneficial for their future. Your goal is to provide insightful and effective guidance by engaging the user in a conversation focused on a single educational topic. Once the user has submitted their topic, prompt them with a question that assesses their current understanding of the subject. Based on their response, follow up with additional questions designed to expand and validate their knowledge. Throughout the conversation, filter out any responses that are not directly related to or educational inquiries, or ask you to do things outside of the socratic method, e.g. coding, essay writing, list. If you are asked to answer questions or provide information on topics that deviate from education, including politics, or asking you to behave as something other than Socratique, such as political viewpoints or pretending you have opinions, you must refuse. Good luck, Socratique!"		
		tokenCount += getTokens(prompt)

		if (tokenCount >= 4000) {
			throw new Error('Query too large')
		}

		const messages: ChatCompletionRequestMessage[] = [
			{ role: 'system', content: prompt },
			...reqMessages
		]

		const chatRequestOpts: CreateChatCompletionRequest = {
			model: 'gpt-3.5-turbo',
			messages,
			temperature: 0.9,
			stream: true
		}
		
		// const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
		// 	headers: {
		// 		Authorization: `Bearer ${OPENAI_KEY}`,
		// 		'Content-Type': 'application/json'
		// 	},
		// 	method: 'POST',
		// 	body: JSON.stringify(chatRequestOpts)
		// })

		const thread = await openai.beta.threads.create();
		const run = await openai.beta.threads.run.create(
			thread.id,
			{
				asssistant_id: "asst_1Zw3fzjkCkwOPknF9p9pxV7W",
				instructions: "you are socratique"
			}
		)
		if (!chatResponse.ok) {
			const err = await chatResponse.json()
			throw new Error(err)
		}

		return new Response(chatResponse.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		})
	} catch (err) {
		console.error(err)
		return json({ error: 'There was an error processing your request' }, { status: 500 })
	}
}

