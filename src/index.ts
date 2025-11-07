import { readConfig, setUser } from "./config.js";
function main() {
  setUser("Marcelo");
  console.log(readConfig());
}

main();