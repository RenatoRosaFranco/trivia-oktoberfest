import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ranking')
      .select('name, score')
      .order("score", { ascending: false })
      .limit(10);

    if (error) {
      console.log("[ERROR]: Erro ao buscar ranking:", error);

      return Response.json(
        { error: "Erro ao buscar ranking" },
        { status: 500 }
      )
    }

    return Response.json(data);
  } catch(error) {
    console.log("[ERROR]: Erro buscando ranking:", error);
  }
}
