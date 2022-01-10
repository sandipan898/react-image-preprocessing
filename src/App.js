import React, { useState } from "react";
import OpenCVOperations from './components/OpenCVOperation'
import { OpenCvProvider, useOpenCv } from "opencv-react";

const App = () => {
  const onLoaded = (cv) => {
    console.log("opencv loaded, cv");
  };

  return (
    <OpenCvProvider onLoad={onLoaded} openCvPath="/opencv/opencv.js">
      <OpenCVOperations />
    </OpenCvProvider>
  );
};

export default App;
