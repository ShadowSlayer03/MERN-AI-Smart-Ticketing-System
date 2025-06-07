import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "TODO",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    priority: String,
    deadline: Date,
    helpfulNotes: String,
    relatedSkills: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ticket", ticketSchema);
