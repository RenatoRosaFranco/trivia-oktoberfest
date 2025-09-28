import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let currentQuestion = {};
let ranking = {};

async function generateQuestion() {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Você é um gerador de perguntas de trivia' },
      {
        role: 'user',
        content: `Gere uma pergunta de trivia sobre cultura alemã ou oktoberfest.
        Responda em JSON no formato {"q": "PERGUNTA", "a": "RESPOSTA" }.
        A resposta deve ser curta (max 2 palavras).`,
      },
    ],
    max_tokens: 80
  })

  try {
    return JSON.parse(completion.choices[0].message.content.trim());
  } catch(error) {
    return { q: "Qual bebida é típica da Oktoberfest?", a: "Cerveja" }
  }
}

function alexaResponse(text, endSession = false) {
  return {
    version: "1.0",
    response: {
      outputSpeech: { type: "PlainText", text: text },
      shouldEndSession: endSession,
    },
  };
}

export default async function handler(req, res) {
  const event  = req.body;
  const userId = event.session?.user?.userId || "anon";

  if (event.request.type === "LaunchRequest") {
    return res.json(
      alexaResponse("Bem vindo ao Trivia! Diga começar para iniciar o jogo.")
    )
  }

  if (event.request.type === "IntentRequest") {
    const intent = event.request.intent.name;

    if (intent === "StartGameIntent") {
      const question = await generateQuestion();
      currentQuestion[userId] = question;
      return res.json(alexaResponse(`Vamos lá! ${question.q}`));
    }

    if (intent === "AnswerIntent") {
      const userAnswer = event.request.intent.slots.answer.value;
      const actualQuestion = currentQuestion[userId];

      if (!actualQuestion) {
        return res.json(alexaResponse('Você ainda não começou o jogo. Diga começar para jogar.'));
      }

      const correctAnswer = actualQuestion.a;
      let feedback;

      if (userAnswer.toLowerCase().includes(correctAnswer.toLowerCase())) {
        ranking[userId] = (ranking[userId] || 0) + 1;
        feedback = `Correto! Você já tem ${ranking[userId]} ponto(s).`;
      } else {
        feedback = `Errado! A resposta certa é ${correctAnswer}`;
      }

      return res.json(alexaResponse(feedback + " Quer jogar outra?"));
    }
  }

  return res.json(alexaResponse('Não entendi. Tente novamente.'));
}
