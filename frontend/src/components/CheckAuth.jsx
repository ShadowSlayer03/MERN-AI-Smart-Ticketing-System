import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const isTokenValid = token && token !== "null" && token !== "undefined";

    if (protectedRoute) {
      if (!isTokenValid) {
        navigate("/login", { replace: true });
      } else {
        setLoading(false);
      }
    } else {
      if (isTokenValid) {
        navigate("/", { replace: true });
      } else {
        setLoading(false);
      }
    }
  }, [navigate, protectedRoute]);

  if (loading) {
    return <div>Authenticating...</div>; // or a Spinner
  }

  return children;
}

export default CheckAuth;
