// Simple mock API for projects and media items
// Later we'll replace with NestJS/Prisma backend; for now, Next.js route

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "example-1";

  const projects = {
    "example-1": {
      id: "example-1",
      title: "Jornal A Praça",
      designer: "Liga Tipo Studio",
      publishedAt: "Dez 2025",
      contactUrl: "https://instagram.com/ligatipo",
      contactLabel: "Instagram",
      items: [
        { type: "image", src: "/img/temp/img-test-1.png", alt: "Exemplo 1" },
        { type: "image", src: "/img/temp/img-test-2.png", alt: "Exemplo 2" },
        { type: "image", src: "/img/temp/img-test-3.png", alt: "Exemplo 3" },
        { type: "image", src: "/img/temp/img-test-4.png", alt: "Exemplo 4" },
      ],
    },
  };

  const data = projects[id];
  if (!data) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
