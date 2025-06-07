import { useEffect, useState } from "react";
import { UserIcon, PencilIcon } from "lucide-react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", "),
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: editingUser,
          role: formData.role,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Failed to update user");
        return;
      }

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query))
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
        <UserIcon className="w-6 h-6" />
        Admin Panel - Manage Users
      </h1>

      <input
        type="text"
        className="input input-bordered w-full mb-6"
        placeholder="Search by email..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500">No users found.</div>
      )}

      {filteredUsers.map((user) => (
        <div
          key={user._id}
          className="card bg-base-100 shadow-md border border-base-200 p-5 mb-5 transition duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <p className="text-lg font-semibold">{user.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-base-content">
                <span className="badge badge-outline">Role: {user.role}</span>
                {user.skills?.map((skill, idx) => (
                  <span key={idx} className="badge badge-accent">
                    {skill}
                  </span>
                ))}
                {(!user.skills || user.skills.length === 0) && (
                  <span className="text-gray-500 italic">No skills listed</span>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-0">
              {editingUser === user.email ? (
                <div className="space-y-2">
                  <select
                    className="select select-bordered w-full sm:w-52"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="User">User</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Comma-separated skills"
                    className="input input-bordered w-full sm:w-64"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                  />

                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-primary btn-sm" onClick={handleUpdate}>
                      Save
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEditClick(user)}
                >
                  <PencilIcon className="w-4 h-4 mr-1" /> Edit
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
