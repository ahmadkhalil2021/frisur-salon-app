"use client";
import { useEffect, useState } from "react";
import { getSession, getUserRole } from "../_lib/data-service";
import { useRouter } from "next/navigation";
import DashboardAdmin from "./dashboardAdmin";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userIsCustomer, setUserIsCustomer] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      const userType = getUserRole(session?.user?.id);

      if (!session) {
        router.push("/login");
        return;
      }
      const userIsCustomer = (await userType) === "customer";
      if (session && userIsCustomer) {
        console.log("User is a customer, redirecting to home page.");
        router.push("/");
        setLoading(true);
        return;
      }
      setLoading(false);
    };
    fetchSession();
  }, []);
  if (loading && userIsCustomer) {
    return null;
  }

  return (
    <div>
      <DashboardAdmin />
    </div>
  );
}
