import app from "./lib/app.js";

const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  console.log(`started on ${PORT}`);
});
