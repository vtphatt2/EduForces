import React, { useEffect, useState } from "react";
import Contest from "./Contest";
import ContestCoordinator from "../ContestCoordinator/ContestCoordinator";

import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:8080/api/v1";

const ContestPage: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const getUserRole = async () => {
    try {
      const response = await fetch(`${baseUrl}/accounts/account-details`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("session_id") || "",
        },
      });

      if (localStorage.getItem("session_id") === null) {
        throw new Error("Please log in first");
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setRole(data.role);
    } catch (error) {
      alert(`Error: ${error}`);
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserRole();
  }, []);

  if (role === null) {
    return <div>Loading...</div>;
  }

  return role === "Coordinator" ? <ContestCoordinator /> : <Contest />;
};

export default ContestPage;