import React, { useState, useRef } from "react";
import { OpenCvProvider, useOpenCv } from "opencv-react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography, Button, Checkbox } from '@mui/material'
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';


/**
 * 
 * Brightness
 * Sharpen
 * 
 */

const Input = styled(MuiInput)`
 width: 42px;
`;

export default function OpenCVOperations() {
    const { loaded, cv } = useOpenCv();
    console.log("loaded >> ", loaded);
    console.log("opencv details >> ", cv);

    const imageRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageStatus, setImageStatus] = useState(null);
    const [outputImageStatus, setOutputImageStatus] = useState(null);
    const [grayScaleRotate, setGrayScaleRotate] = useState(true);
    const [grayScale, setGrayScale] = useState(true);
    const [edge, setEdge] = useState(true);
    const [rotate, setRotate] = useState(true);
    const [erosion, setErosion] = useState(true);
    const [dilation, setDialation] = useState(true);
    const [src, setSrc] = useState(null);
    const [dst, setDst] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [brightnessValue, setBrightnessValue] = useState(10);
    const [contrastValue, setContrastValue] = useState(1);
    const [sharpnessValue, setSharpnessValue] = useState(0);
    const [adaptiveThreshold, setAdaptiveThreshold] = useState(0);
    const [imageThreshold, setImageThreshold] = useState(0);
    const [brightImage, setBrightImage] = useState(null);
    const [smoothValue1, setSmoothValue1] = useState(0);
    const [smoothValue2, setSmoothValue2] = useState(0);

    const onImageChange = (e) => {
        console.log("e >> ", e.target.files[0]);
        let imgElement = document.getElementById("imageSrc");
        imgElement.src = URL.createObjectURL(e.target.files[0]);
        setImageStatus(imgElement);
        setBrightImage(imgElement);
        //imgElement.onload = function () {
        //};
    };

    const resetFilter = () => {
        let imgElement = document.getElementById("imageSrc");
        setImageStatus(imgElement);
        setBrightImage(imgElement);
        let src = cv.imread(imgElement);
        let dst = new cv.Mat();
        cv.imshow("canvasOutput", dst);
        setBrightnessValue(10);
        setContrastValue(1);
        setSharpnessValue(0);
        setAdaptiveThreshold(0);
        src.delete();
        dst.delete();
    }

    const onGrayScaleChange = () => {
        setGrayScale(!grayScale);
        if (grayScale) {
            let src = cv.imread(imageStatus);
            let dst = new cv.Mat();
            // You can try more different parameters
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
            cv.imshow("canvasOutput", dst);
            let imgElement = document.getElementById("canvasOutput")
            setImageStatus(imgElement);
            src.delete();
            dst.delete();
        }
    };

    const onEdgeChange = () => {
        setEdge(!edge);
        if (edge) {
            let src = cv.imread(imageStatus);
            let dst = new cv.Mat();
            cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
            // You can try more different parameters
            cv.Canny(src, dst, 50, 100, 3, false);
            cv.imshow("canvasOutput", dst);
            let imgElement = document.getElementById("canvasOutput")
            setImageStatus(imgElement);
            src.delete();
            dst.delete();
        }
    };

    const onRotateChange = () => {
        setRotate(!rotate);
        if (rotate) {
            let src = cv.imread(imageStatus, 0);
            let dst = new cv.Mat();
            let dsize = new cv.Size(src.rows, src.cols);
            let center = new cv.Point((src.cols - 1) / 2.0, (src.rows - 1) / 2.0);
            // You can try more different parameters
            let M = cv.getRotationMatrix2D(center, 90, 1);
            cv.warpAffine(
                src,
                dst,
                M,
                dsize,
                cv.INTER_LINEAR,
                cv.BORDER_CONSTANT,
                new cv.Scalar()
            );
            cv.imshow("canvasOutput", dst);
            let imgElement = document.getElementById("canvasOutput")
            setImageStatus(imgElement);
            src.delete();
            dst.delete();
            M.delete();
        }
    };

    const onErosionChange = () => {
        setErosion(!erosion);
        if (erosion) {
            let src = cv.imread(imageStatus);
            let dst = new cv.Mat();
            let M = cv.Mat.ones(5, 5, cv.CV_8U);
            let anchor = new cv.Point(-1, -1);
            // You can try more different parameters
            cv.erode(
                src,
                dst,
                M,
                anchor,
                1,
                cv.BORDER_CONSTANT,
                cv.morphologyDefaultBorderValue()
            );
            cv.imshow("canvasOutput", dst);
            let imgElement = document.getElementById("canvasOutput")
            setImageStatus(imgElement);
            src.delete();
            dst.delete();
            M.delete();
        }
    };

    const onDilationChange = () => {
        setDialation(!dilation);
        if (dilation) {
            let src = cv.imread(imageStatus);
            let dst = new cv.Mat();
            let M = cv.Mat.ones(5, 5, cv.CV_8U);
            let anchor = new cv.Point(-1, -1);
            // You can try more different parameters
            cv.dilate(
                src,
                dst,
                M,
                anchor,
                1,
                cv.BORDER_CONSTANT,
                cv.morphologyDefaultBorderValue()
            );
            cv.imshow("canvasOutput", dst);
            let imgElement = document.getElementById("canvasOutput")
            setImageStatus(imgElement);
            src.delete();
            dst.delete();
            M.delete();
        }
    };

    const onAdaptiveThresholdChange = (e, new_value) => {
        setAdaptiveThreshold(new_value);
        let src = cv.imread(imageStatus);
        let dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.adaptiveThreshold(src, dst, parseInt(new_value) + 50, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 3, 2);
        cv.imshow('canvasOutput', dst);
        src.delete();
        dst.delete();
    }

    const autoAdjustBrightness = (e) => {
    }

    const onApplyBrightChange = (e, new_value) => {
        // let imgElement = document.getElementById("canvasOutput")
        setImageStatus(brightImage);
    }

    const onReverseContrast = (e) => {
        let src = cv.imread(imageStatus);
        let dst = new cv.Mat();
        // cv.bitwise_not(src, dst)

        cv.imshow("canvasOutput", ~dst);
        let imgElement = document.getElementById("canvasOutput")
        setImageStatus(imgElement);
        src.delete();
        dst.delete();
    }

    const handleBrightnessChange = (event, status, newValue) => {
        status === 'brightness' ? setBrightnessValue(newValue) : setContrastValue(newValue);
        // let src = cv.imread(imageStatus);
        let src = cv.imread('imageSrc');
        let dst = new cv.Mat();
        let alpha = status === 'brightness' ? contrastValue : newValue; // Contrast control (1.0-3.0)
        let beta = status === 'contrast' ? brightnessValue : newValue // Brightness control (0-100)
        cv.convertScaleAbs(src, dst, alpha, beta)
        cv.imshow("canvasOutput", dst);
        let imgElement = document.getElementById("canvasOutput")
        setBrightImage(imgElement);
        src.delete();
        dst.delete();
    };

    const handleSharpnessChange = (event, newValue) => {
        setSharpnessValue(newValue);
    };

    const onSmoothingChange = (event, status, newValue) => {
        status === 'first' ? setSmoothValue1(newValue) : setSmoothValue2(newValue);
        let src = cv.imread('imageSrc');
        let dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
        let firstValue = status === 'first' ? newValue : smoothValue1;
        let secondValue = status === 'second' ? newValue : smoothValue2;
        let thirdValue = 75;
        // cv.bilateralFilter(src, dst, firstValue, 75, thirdValue, cv.BORDER_DEFAULT);
        cv.medianBlur(src, dst, firstValue);
        cv.imshow('canvasOutput', dst);
        let imgElement = document.getElementById("canvasOutput")
        setImageStatus(imgElement);
        src.delete();
        dst.delete();
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={0}>
                {loaded ?
                    <Grid container spacing={0}>
                        <Grid item md={4} className="inputoutput">
                            <h4>Original Image</h4>
                            <img id="imageSrc" height="500" width="500" alt="No Image" />
                            <div className="caption">
                                <input
                                    type="file"
                                    id="fileInput"
                                    name="file"
                                    onChange={(e) => onImageChange(e)}
                                />
                            </div>
                        </Grid>
                        <Grid item md={3} className="inputoutput" style={{ padding: "10px" }}>
                            <h4>Filter Options</h4>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Checkbox
                                        type="checkbox"
                                        id="RGB2Gray"
                                        name="RGB2Gray"
                                        value="Grayscale Conversion"
                                        onChange={onGrayScaleChange}
                                        disabled={!imageStatus}
                                    />
                                    Apply Grayscale
                                    <br></br>
                                    <Checkbox
                                        type="checkbox"
                                        id="edgeDetection"
                                        name="edgeDetection"
                                        value="Edge Detection"
                                        onChange={onEdgeChange}
                                        disabled={!imageStatus}
                                    />
                                    Detect Edges
                                    <br></br>
                                    <Checkbox
                                        type="checkbox"
                                        id="rotateImage"
                                        name="rotateImage"
                                        value="Rotate Image"
                                        onChange={onRotateChange}
                                        disabled={!imageStatus}
                                    />
                                    Rotate Image
                                    <br></br>
                                    <Checkbox
                                        type="checkbox"
                                        id="erosion"
                                        name="erosion"
                                        value="Image Erosion"
                                        onChange={onErosionChange}
                                        disabled={!imageStatus}
                                    />
                                    Image Erosion
                                    <br></br>
                                </Grid>
                                <Grid item xs={6}>
                                    <Checkbox
                                        type="checkbox"
                                        id="dilation"
                                        name="dilation"
                                        value="Image Dilation"
                                        onChange={onDilationChange}
                                        disabled={!imageStatus}
                                    />
                                    Image Dilation
                                    <br></br>
                                    <Checkbox
                                        type="checkbox"
                                        id="rotateImage"
                                        name="rotateImage"
                                        value="Rotate Image"
                                        onChange={onReverseContrast}
                                        disabled={!imageStatus}
                                    />
                                    Reverse Contrast
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Slider
                                        value={typeof brightnessValue === 'number' ? brightnessValue : 0}
                                        onChange={(e, value) => handleBrightnessChange(e, 'brightness', value)}
                                        aria-labelledby="input-slider"
                                        valueLabelDisplay="auto"
                                        disabled={!imageStatus}
                                        max={100}
                                        min={0}
                                    />
                                    Brightness: <span>{brightnessValue}</span>
                                </Grid>
                                <Grid item xs={6}>
                                    <Slider
                                        value={typeof contrastValue === 'number' ? contrastValue : 0}
                                        onChange={(e, value) => handleBrightnessChange(e, 'contrast', value)}
                                        aria-labelledby="input-slider"
                                        valueLabelDisplay="auto"
                                        disabled={!imageStatus}
                                        max={3}
                                        min={0}
                                        step={0.05}
                                    />
                                    Contrast: <span>{contrastValue}</span>
                                </Grid>
                            </Grid>
                            <Button onClick={onApplyBrightChange} size="small" primary variant="contained" disabled={!imageStatus}>Apply</Button>
                            <Grid item xs>
                                <Slider
                                    value={typeof sharpnessValue === 'number' ? sharpnessValue : 0}
                                    onChange={handleSharpnessChange}
                                    aria-labelledby="input-slider"
                                    valueLabelDisplay="auto"
                                    disabled={!imageStatus}
                                />
                                Sharpness: <span>{sharpnessValue}</span>
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    value={typeof adaptiveThreshold === 'number' ? adaptiveThreshold : 0}
                                    onChange={onAdaptiveThresholdChange}
                                    aria-labelledby="input-slider"
                                    valueLabelDisplay="auto"
                                    disabled={!imageStatus}
                                    max={500}
                                />
                                AdaptiveThreshlod: <span>{adaptiveThreshold}</span>
                            </Grid>
                            {/* denoising and smoothing */}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Slider
                                        value={typeof smoothValue1 === 'number' ? smoothValue1 : 0}
                                        onChange={(e, value) => onSmoothingChange(e, 'first', value)}
                                        aria-labelledby="input-slider"
                                        valueLabelDisplay="auto"
                                        disabled={!imageStatus}
                                        max={20}
                                        step={0.05}
                                    />
                                    Denoising and Smoothing: <span>{smoothValue1}</span>
                                    {/* <br />Denoising and Smoothing */}
                                </Grid>
                                {/* <Grid item xs={6}>
                                    <Slider
                                        value={typeof smoothValue2 === 'number' ? smoothValue2 : 0}
                                        onChange={(e, value) => onSmoothingChange(e, 'second', value)}
                                        aria-labelledby="input-slider"
                                        valueLabelDisplay="auto"
                                        disabled={!imageStatus}
                                        max={500}
                                    />
                                    <span>{smoothValue2}</span>
                                </Grid> */}
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button primary variant="contained" disabled={!imageStatus}>Apply</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button onClick={resetFilter} primary variant="contained" disabled={!imageStatus}>Reset</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={4} className="inputoutput">
                            <h4>Processed Image</h4>
                            <canvas height={400} width={400} id="canvasOutput"></canvas>
                        </Grid>
                    </Grid>
                    :
                    <div>
                        <h1>Loading Opencv-React</h1>
                        {selectedImage && (
                            <div>
                                <img
                                    alt="not found"
                                    width={"250px"}
                                    src={URL.createObjectURL(selectedImage)}
                                    id="img"
                                />
                                <br />
                                <button onClick={() => setSelectedImage(null)}>Remove</button>
                                <canvas id="output"></canvas>
                            </div>
                        )}
                        <br />
                        <br />
                        <input
                            type="file"
                            name="myImage"
                            onChange={(event) => {
                                console.log(event.target.files[0]);
                                setSelectedImage(event.target.files[0]);
                            }}
                        />
                    </div>
                }
            </Grid>
        </Box>
    );
}