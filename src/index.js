const http = require("http");
const PORT = 3000;

const HeroFactory = require("./factories/heroFactory");
const heroService = require("./services/heroService");
const Hero = require("./entities/hero");

const DEFAULT_HEADER = { "Content-Type": "application/json" };

const routes = {
  "/heroes:get": async (request, response) => {
    const { id } = request.queryString;
    const heroes = await heroService.find(id);
    response.write(JSON.stringify({ results: heroes }));

    return response.end();
  },
  "/heroes:post": async (request, response) => {},
  default: (request, response) => {
    response.write("Hello!");
    response.end();
  },
};

const handleError = (response) => {
  return (error) => {
    console.error("Deu Ruim!***", error);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: "Internal Server Error!!" }));

    return response.end();
  };
};

const handler = (request, response) => {
  const { url, method } = request;
  const [first, route, id] = url.split("/");
  request.queryString = { id: isNaN(id) ? id : Number(id) };

  const key = `/${route}:${method.toLowerCase()}`;

  response.writeHead(200, DEFAULT_HEADER);

  const chosen = routes[key] || routes.default;
  return chosen(request, response);
};

http
  .createServer(handler)
  .listen(PORT, () => console.log("server running at", PORT));
