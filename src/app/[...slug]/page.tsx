"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Forbidden from "../403/page";

const CatchAll: React.FC = () => {
  const router = useRouter();

  // Implement logic to check if the page exists
  // This could involve checking against a list of valid routes or querying a database

  const pageExists = false; // Replace with actual existence check

  if (!pageExists) {
    return <Forbidden />
  }

  // Render the actual page if it exists
  return <div>Actual Page Content</div>;
};

export default CatchAll;
