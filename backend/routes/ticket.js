import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { createTicket, getTicketById, getTickets } from "../controllers/ticketController.js";

const router = express.Router();

router.get("/",authenticate,getTickets);
router.get("/:id",authenticate,getTicketById);
router.post("/",authenticate,createTicket);

export default router;