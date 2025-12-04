// Mock API for showcases (formerly projects)
// TODO: replace with dedicated backend service later

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Number(url.searchParams.get("pageSize") ?? 12);

  const showcases = {
    "example-1": {
      id: "example-1",
      title: "Jornal A Praça",
      designer: "Liga Tipo Studio",
      publishedAt: "Dez 2025",
      contactUrl: "https://instagram.com/ligatipo",
      contactLabel: "Instagram",
      items: [
        { type: "image", src: "/showcases/img-test-1.png", alt: "Exemplo 1" },
        { type: "image", src: "/showcases/img-test-2.png", alt: "Exemplo 2" },
        { type: "image", src: "/showcases/img-test-3.png", alt: "Exemplo 3" },
        { type: "image", src: "/showcases/img-test-4.png", alt: "Exemplo 4" },
      ],
    },
    "example-2": {
      id: "example-2",
      title: "Revista Tipos",
      designer: "Equipe Ligatipo",
      publishedAt: "Nov 2025",
      contactUrl: "https://linkedin.com/company/ligatipo",
      contactLabel: "LinkedIn",
      items: [
        { type: "image", src: "/showcases/img-test-2.png", alt: "Exemplo A" },
        { type: "image", src: "/showcases/img-test-3.png", alt: "Exemplo B" },
      ],
    },
  };

  // Detail by id
  if (id) {
    const data = showcases[id];
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

  // List with simple pagination
  const all = Object.values(showcases);
  const start = (page - 1) * pageSize;
  const items = all.slice(start, start + pageSize);
  const payload = {
    data: items,
    meta: {
      total: all.length,
      page,
      pageSize,
      totalPages: Math.ceil(all.length / pageSize),
    },
  };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
