import 'dotenv/config';
import express from "express";
import cors from "cors";
import signupRoute from './routes/signup.js';
import loginRoute from './routes/login.js';
import searchHistoryRoute from './routes/SearchHistory.js';  // Add the search history route
import { connectToDatabase } from "./db/sql.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => res.json({ message: "API is running 🚀" }));

app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);
app.use("/api/searchHistory", searchHistoryRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectToDatabase();
});
