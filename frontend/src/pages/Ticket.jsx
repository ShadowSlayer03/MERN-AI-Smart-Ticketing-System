import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log("Data from ticket", data);
        if (res.ok) {
          setTicket(data);
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return <div className="text-center mt-10 text-primary">Loading ticket details...</div>;
  if (!ticket) return <div className="text-center mt-10 text-error">Ticket not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-primary mb-6">🎫 Ticket Details</h2>

      <div className="card bg-base-100 shadow-xl p-6 space-y-5">
        <div>
          <h3 className="text-2xl font-semibold text-primary">{ticket.title}</h3>
          <p className="text-base-content mt-2">{ticket.description}</p>
        </div>

        {/* Extra Metadata */}
        {ticket.status && (
          <div className="space-y-2">
            <div className="divider text-primary">Metadata</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-base-content">
              <p><strong>Status:</strong> {ticket.status}</p>
              {ticket.priority && <p><strong>Priority:</strong> {ticket.priority}</p>}
              {ticket.relatedSkills?.length > 0 && (
                <p><strong>Skills:</strong> {ticket.relatedSkills.join(", ")}</p>
              )}
              {ticket.assignedTo && (
                <p><strong>Assigned To:</strong> {ticket.assignedTo.email}</p>
              )}
              {ticket.createdAt && (
                <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
              )}
            </div>

            {ticket.helpfulNotes && (
              <div className="mt-4">
                <div className="font-semibold text-base-content">Helpful Notes:</div>
                <div className="prose prose-sm max-w-none bg-base-200 rounded p-3 mt-2">
                  <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
