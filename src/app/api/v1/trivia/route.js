import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

let currentQuestion = {};
let ranking = {};

async function getRandomQuestion() {
  const { data, error } = await supabase
    .from('questions')
    .select('*');

  if (error || !data?.length) {
    console.log("[DEBUG]: Erro buscando pergunta:", error);
    return { q: "Qual é a bebida típica da Oktoberfest?", a: "Cerveja" };
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  return { q: data[randomIndex].question, a: data[randomIndex].answer };
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
      const question = await getRandomQuestion();
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

    if (intent === "AMAZON.YesIntent") {
      const question = await getRandomQuestion();
      currentQuestion[userId] = question;
      return Response.json(alexaResponse(`Beleza! ${question.q}`));
    }

    if (intent === "AMAZON.NoIntent") {
      return Response.json(
        alexaResponse("Ok, obrigado por jogar! Até a próxima.", true)
      );
    }
  }

  return Response.json(alexaResponse("Não entendi. Tente novamente."));
}
