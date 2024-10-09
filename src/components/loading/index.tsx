import React from "react";
import Lottie from "lottie-react";
import cats from "@/assets/lottie/cats.json";

const Loading = () => {
  return <Lottie animationData={cats} className="loader lg:w-1/3 mx-auto" />;
};

export default Loading;
