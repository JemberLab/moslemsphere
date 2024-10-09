import React from "react";
import Lottie from "lottie-react";
import construction_1 from "@/assets/lottie/construction_1.json";

function ComingSoon() {
  return (
    <div className="coming-soon text-center">
      <Lottie animationData={construction_1} className="loader lg:w-[80%] mx-auto mb-12" />
      <p className="mx-auto text-xl lg:text-[32px] text-slate-500 font-semibold">Coming Soon</p>
    </div>
  );
}

export default ComingSoon;
