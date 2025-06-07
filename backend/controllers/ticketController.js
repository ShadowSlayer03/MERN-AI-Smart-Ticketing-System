import Ticket from "../models/ticket.js";
import inngest from "../inngest/client.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description)
      return res
        .status(400)
        .json({ message: "Title and description are required!" });

    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: "ticket/create",
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });

    return res.status(201).json({
      message: "Ticket created and processing started!",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Creating a ticket failed due to some error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];

    if (user.role !== "User") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Getting all tickets failed due to some error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTicketById = async (req, res) => {
    try {
      const user = req.user;
      const ticketId = req.params.id; 

      let ticket = null;
  
      if (user.role !== "User") {
       ticket = await Ticket.findById(ticketId).populate("assignedTo",["email","_id"])
      } else {
        ticket = await Ticket.findOne({_id: ticketId, createdBy: user._id}).select("title description status createdAt")
      }

      if(!ticket){
        return res.status(404).json({message: "Ticket Not Found!"})
      }
  
      return res.status(200).json(ticket);
    } catch (error) {
      console.error("Getting ticket by Id failed due to some error:", error);
      res.status(500).json({ error: error.message });
    }
  };
