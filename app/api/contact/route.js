import nodemailer from "nodemailer";

// API Route for contact form (Next.js 13+ App Router)
export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, message } = data;

    // Configuração do transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Monta o e-mail
    const mailOptions = {
      from: `Contato Ligatipo <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Nova mensagem de contato - Ligatipo`,
      replyTo: email,
      text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`,
      html: `<p><b>Nome:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Mensagem:</b><br/>${message.replace(
        /\n/g,
        "<br/>"
      )}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ ok: false, error: "Erro ao enviar e-mail." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
