import { Navigate } from "react-router-dom";

const PublicRoute = ({ element, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return element;
};

export default PublicRoute;
