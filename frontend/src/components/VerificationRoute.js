// src/components/VerificationRoute.js
import { Navigate } from "react-router-dom";

const VerificationRoute = ({ element }) => {
  const isPendingVerification =
    sessionStorage.getItem("pendingVerification") === "true";
  const verificationEmail = sessionStorage.getItem("verificationEmail");

  if (!isPendingVerification || !verificationEmail) {
    return <Navigate to="/register" />;
  }

  return element;
};

export default VerificationRoute;
