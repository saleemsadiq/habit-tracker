"use client"; //a directive that is needed when usestate or useeffect is used for browsers

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { getSession } from "@/lib/storage";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  // tracker for checking if the session has been checked
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const session = getSession();
    // if no session, send to login page
    if (!session) {
      router.push("/login");
    } else {
      // session exist so stop showing loading state
      setIsChecking(false);
    }
  }, []); //an empty array that runs when the component first loads

  // while the check is going on , render nothing
  if (isChecking) {
    return null;
  }
  return <>{children}</>;
}
