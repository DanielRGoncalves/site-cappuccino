// O comando `node --test testes/` resolve este índice no Windows.
const { readdirSync } = require("node:fs");

Promise.all(
  readdirSync(__dirname)
    .filter((name) => name.endsWith(".test.mjs"))
    .map((name) => import(`./${name}`)),
).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
