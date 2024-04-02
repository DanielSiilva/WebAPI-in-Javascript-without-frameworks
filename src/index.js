const http = require("http");
const PORT = 4000;
const DEFAULT_HEADER = { "Content-Type": "application/json" };

const HeroFactory = require("./factories/heroFactory");
const heroService = HeroFactory.generateInstance();
const Hero = require("./entities/hero");

const routes = {
  "/heroes:get": async (request, response) => {
    const { id } = request.queryString;
    const heroes = await heroService.find(id);
    if (!response.headersSent) {
      response.writeHead(200, DEFAULT_HEADER);
    }
    response.write(JSON.stringify({ results: heroes }));
    return response.end();
  },
  "/heroes:post": async (request, response) => {
    let data = "";
    for await (const chunk of request) {
      console.log("Chuck", chunk);
      data += chunk;
    }

    try {
      const item = JSON.parse(data);
      const hero = new Hero(item);
      const { error, valid } = hero.isValid();

      if (!valid) {
        if (!response.headersSent) {
          response.writeHead(400, DEFAULT_HEADER);
        }
        response.write(JSON.stringify({ error: error.join(",") }));
        return response.end();
      }

      const id = await heroService.create(hero);
      if (!response.headersSent) {
        response.writeHead(201, DEFAULT_HEADER);
      }
      response.write(
        JSON.stringify({ success: "User Created with success!!", id })
      );
      return response.end();
    } catch (error) {
      handleError(response)(error);
    }
  },

  default: (request, response) => {
    if (!response.headersSent) {
      response.writeHead(200, DEFAULT_HEADER);
    }
    response.write("Hello!");
    response.end();
  },
};

const handleError = (response) => {
  return (error) => {
    console.error("Deu Ruim!***", error);
    if (!response.headersSent) {
      response.writeHead(500, DEFAULT_HEADER);
    }
    if (!response.writableEnded) {
      response.write(JSON.stringify({ error: "Internal Server Error!!" }));
      response.end();
    }
  };
};

const handler = (request, response) => {
  const { url, method } = request;
  const [first, route, id] = url.split("/");
  request.queryString = { id: isNaN(id) ? id : Number(id) };

  const key = `/${route}:${method.toLowerCase()}`;

  const chosen = routes[key] || routes.default;
  return chosen(request, response).catch(handleError(response));
};

http
  .createServer(handler)
  .listen(PORT, () => console.log("server running at", PORT));
