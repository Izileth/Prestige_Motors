import type { Route } from "./+types/hero";
import { Hero } from "~/src/pages/Hero/heroPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prestige Motors" },
    { name: "description", content: "Novos Horizones São Erguidos" },
  ];
}

export default function Home() {
  return <Hero/>;
}
