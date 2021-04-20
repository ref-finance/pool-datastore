import app from "./lib/app.js";
import cron from "node-cron";

const PORT = process.env.PORT || 7890;

cron.schedule("0 * * * *", () => {
  storePools()
    .then(() => storeVolume())
    .then(() => console.log("sync"))
    .catch(console.error);
});

app.listen(PORT, () => {
  console.log(`started on ${PORT}`);
});
