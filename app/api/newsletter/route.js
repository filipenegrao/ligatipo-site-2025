// Rota API para inscrição na newsletter usando Resend
import { Resend } from "resend";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ ok: false, error: "E-mail inválido." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Enviar e-mail de confirmação para o usuário
    await resend.emails.send({
      from: "Ligatipo Newsletter <newsletter@news.ligatipo.xyz>",
      to: email,
      subject: "Bem-vindo à newsletter Ligatipo!",
      html: "<p>Obrigado por se inscrever na nossa newsletter!</p><p>Em breve você receberá novidades sobre tipografia, design e nossos projetos.</p>",
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ ok: false, error: "Erro ao inscrever." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
