const app = require("./app");

const PORT = process.env.PORT || 9002;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
