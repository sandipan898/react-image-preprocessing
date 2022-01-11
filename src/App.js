import React, { useState } from "react";
import OpenCVOperations from './components/OpenCVOperation';
import ImageProOperations from './components/ImageProOperations';
import { OpenCvProvider, useOpenCv } from "opencv-react";

const App = () => {
  const onLoaded = (cv) => {
    console.log("opencv loaded, cv");
  };

  return (
    <OpenCvProvider onLoad={onLoaded} openCvPath="/opencv/opencv.js">
      {/* <ImageProOperations /> */}
      <OpenCVOperations />
    </OpenCvProvider>
  );
};

export default App;
