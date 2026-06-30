import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  const allowedEmails = [
    "liulouis008@gmail.com",
    "reddragonsocialclub@gmail.com",
  ];

  if (!email || !allowedEmails.includes(email)) {
    redirect("/");
  }

  return <>{children}</>;
}
