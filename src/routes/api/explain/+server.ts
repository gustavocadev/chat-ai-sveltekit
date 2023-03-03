import { OPENAPI_TOKEN } from '$env/static/private';
import { type RequestHandler, error } from '@sveltejs/kit';
import { oneLine, stripIndent } from 'common-tags';
import type { CreateCompletionRequest } from 'openai';

export const POST = (async ({ request }) => {
	try {
		if (!OPENAPI_TOKEN) {
			throw new Error('OPENAPI_TOKEN is not set');
		}

		// request.json() is a function that returns a promise
		const msg = await request.json();

		if (!msg) {
			throw new Error('No openapi field');
		}
		// context is the text that the model will use to generate a response

		// prompt is the text that the model will use to generate a response
		const prompt = stripIndent`
      ${oneLine`
        You are a teacher that is kind and wanna be helpful for others, and you can speak Spanish or English!, please answer all the questions of your students.
      `}

      Context: """${msg.trim()}"""

      Answer:
    `;

		const completionsOpts = {
			// engine is the name of the model to use
			model: 'text-davinci-003',
			// prompt is the text that the model will use to generate a response
			prompt,
			// max_tokens is how many words the model will generate
			max_tokens: 256,
			// temperature means how much the model will deviate from the prompt
			temperature: 0.9,
			// stream true means the API will return results as available
			stream: true
		} satisfies CreateCompletionRequest;

		const resp = await fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${OPENAPI_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(completionsOpts)
		});

		if (!resp.ok) {
			throw new Error('OpenAI API error Token ERROR');
		}

		// return a response with the correct content type
		return new Response(resp.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (err) {
		console.log(err);
		throw error(500, 'OpenAI API error');
	}
}) satisfies RequestHandler;
