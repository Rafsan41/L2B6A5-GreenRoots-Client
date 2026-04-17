import Image from "next/image";
import HomePage from "./home/page";
import { authClient } from "@/lib/auth-client";

export default async function Home() {
  const session = await authClient.getSession()
  console.log(session)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HomePage />
    </div>
  );
}
