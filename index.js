export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const routes = {
      "/": "index",
      "/consulting": "consulting",
      "/contact": "contact",
      "/projects": "projects",
      "/resume": "resume"
    };

    const page = routes[path];

    if (page) {
      return new Response(await renderPage(page), {
        headers: { "Content-Type": "text/html;charset=UTF-8" },
      });
    }

    return new Response("404 Not Found", { status: 404 });
  },
};

async function renderPage(view) {
  const response = await fetch(`https://danielwait-pages.pages.dev/${view}.html`);
  return await response.text();
}