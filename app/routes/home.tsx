import type { FC } from "react";
import { Navigate } from "react-router";

const Home: FC = () => {
  return <Navigate to="/vanilla" />;
};

export default Home;
