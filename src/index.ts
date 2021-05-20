import APIApp from "./lib/APIApp";

const api = new APIApp();

api.app.listen(8080, () => {
  console.log("Listening...");
});
