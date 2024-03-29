import React from "react";

import ConfettisEffect from "../confetti/Index";
import EditCertificate from "./CertificateUI";

const Completion = () => {
  return (
    <div className="flex w-full p-12">
      <div style={{ width: "40%" }} className="w-100">
        <ConfettisEffect />
      </div>

      <div style={{ width: "60%" }} className="flex justify-center">
        <EditCertificate width={1008} maxWidth={400} />
      </div>
    </div>
  );
};

export default Completion;
