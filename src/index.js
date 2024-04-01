const http = require("http");
const PORT = 3000;

const handler = (requeste, response) => {
  const { url, method } = requeste;

  console.log({
    url,
    method,
  });

  response.end();
};

http.createServer(handler).listen(PORT, () => {
  console.log(`Rodando no porta ${PORT}`);
});
