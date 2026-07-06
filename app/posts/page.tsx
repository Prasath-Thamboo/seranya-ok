import type { Metadata } from "next";
import PostsClient from "./PostsClient";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Exploration de l'univers Seranya : tous nos articles sur le yoga, la méditation et la philosophie bouddhiste.",
  alternates: { canonical: "/posts" },
};

export default function Page() {
  return <PostsClient />;
}
