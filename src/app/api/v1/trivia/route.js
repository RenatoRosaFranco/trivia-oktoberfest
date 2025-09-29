import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let currentQuestion = {};
let ranking = {};

async function generateQuestion() {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Você é um gerador de perguntas de trivia" },
      {
        role: "user",
        content: `Gere uma pergunta de trivia sobre cultura alemã ou Oktoberfest.
        Responda apenas em JSON puro no formato {"q": "PERGUNTA", "a": "RESPOSTA"}.
        A resposta deve ser curta (máx 2 palavras). Não adicione explicações, nem markdown.`,
      },
    ],
    max_tokens: 80,
    temperature: 0.7,
  });

  try {
    let raw = completion.choices[0].message?.content?.trim() || "";
    console.log("Resposta crua do GPT:", raw);

    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }

    throw new Error("Nenhum JSON válido encontrado");
  } catch (error) {
    console.error("[ERROR] Falha ao parsear JSON:", error);
    const fallbacks = [
      { q: "Qual cidade é considerada o berço da Oktoberfest?", a: "Munique" },
      { q: "Qual traje típico masculino é usado na Oktoberfest?", a: "Lederhosen" },
      { q: "Qual traje típico feminino é usado na Oktoberfest?", a: "Dirndl" },
      { q: "Qual é a bebida mais associada à Oktoberfest?", a: "Cerveja" },
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

function alexaResponse(text, endSession = false) {
  return {
    version: "1.0",
    response: {
      outputSpeech: { type: "PlainText", text },
      shouldEndSession: endSession,
    },
  };
}

export async function POST(req) {
  const event = await req.json();
  const userId = event.session?.user?.userId || "anon";

  if (event.request.type === "LaunchRequest") {
    return Response.json(
      alexaResponse("Bem vindo ao Trivia! Diga começar para iniciar o jogo.")
    );
  }

  if (event.request.type === "IntentRequest") {
    const intent = event.request.intent.name;

    if (intent === "StartGameIntent") {
      const question = await generateQuestion();
      currentQuestion[userId] = question;
      return Response.json(alexaResponse(`Vamos lá! ${question.q}`));
    }

    if (intent === "AnswerIntent") {
      const userAnswer = event.request.intent.slots.answer.value;
      const actualQuestion = currentQuestion[userId];

      if (!actualQuestion) {
        return Response.json(
          alexaResponse("Você ainda não começou o jogo. Diga começar para jogar.")
        );
      }

      const correctAnswer = actualQuestion.a;
      let feedback;

      if (userAnswer.toLowerCase().includes(correctAnswer.toLowerCase())) {
        ranking[userId] = (ranking[userId] || 0) + 1;
        feedback = `Correto! Você já tem ${ranking[userId]} ponto(s).`;
      } else {
        feedback = `Errado! A resposta certa é ${correctAnswer}.`;
      }

      return Response.json(alexaResponse(feedback + " Quer jogar outra?"));
    }
  }

  return Response.json(alexaResponse("Não entendi. Tente novamente."));
}
