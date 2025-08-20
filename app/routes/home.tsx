import type { FC } from "react";
import type { Route } from "./+types/home";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader() {
  throw redirect("/start");
}

const Home: FC = () => {
  return null;
};

export default Home;
