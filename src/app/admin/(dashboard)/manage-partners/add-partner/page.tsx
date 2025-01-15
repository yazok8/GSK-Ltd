import React from "react";
import PartnerForm from "../_components/PartnerForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function AddPartner() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role === "VIEW_ONLY") {
    return (
      <p className="text-center mt-10">
        You do not have permission to add or edit products.
      </p>
    );
  }
  return <PartnerForm />;
}
