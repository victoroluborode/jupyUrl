import express from "express";
import urlRoutes from "./routes/url.routes";

const app = express();

app.use(express.json());
app.use("/url", urlRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

