import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import inngest from "./inngest/client.js";
import { serve } from "inngest/express";
import { onUserSignUp } from "./inngest/functions/on-signup.js";
import { onTicketCreate } from "./inngest/functions/on-ticket-create.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

const inngestHandler = serve({
  client: inngest,
  functions: [onUserSignUp, onTicketCreate],
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/inngest", inngestHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.error("MongoDB Error:", err));

app.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});
