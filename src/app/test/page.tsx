import SolFAIProvider from "@/context/solfai/SolFAIProvider";
import React from "react";
import TestClient from "@/app/test/client";

const TestPage = () => {
  return (
    <SolFAIProvider>
      <TestClient />
    </SolFAIProvider>
  );
};

export default TestPage;
