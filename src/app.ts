import express from "express";
import urlRoutes from "./routes/url.routes";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use("/url", urlRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

