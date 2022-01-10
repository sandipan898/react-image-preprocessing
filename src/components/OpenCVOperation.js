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
    const [brightnessValue, setBrightnessValue] = useState(0);
    const [sharpnessValue, setSharpnessValue] = useState(0);

    const onImageChange = (e) => {
        console.log("e >> ", e.target.files[0]);
        let imgElement = document.getElementById("imageSrc");
        imgElement.src = URL.createObjectURL(e.target.files[0]);
        setImageStatus(imgElement);
        //imgElement.onload = function () {
        //};
    };

    const onGrayScaleChange = () => {
        setGrayScale(!grayScale);
        console.log("onGrayScaleChange", grayScale, imageStatus)
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
            let src = cv.imread(imageStatus);
            let dst = new cv.Mat();
            let dsize = new cv.Size(src.rows, src.cols);
            let center = new cv.Point(src.cols / 2, src.rows / 2);
            // You can try more different parameters
            let M = cv.getRotationMatrix2D(center, 45, 1);
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

    const handleBrightnessChange = (event, newValue) => {
        setBrightnessValue(newValue);
    };

    const handleSharpnessChange = (event, newValue) => {
        setSharpnessValue(newValue);
    };


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={0}>
                {loaded ?
                    <Grid container spacing={0}>
                        <Grid item md={5} className="inputoutput">
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
                        <Grid item md={2} className="inputoutput" style={{padding: "10px"}}>
                            <h4>Filter Options</h4>
                            <div className="processing">
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
                                <Checkbox
                                    type="checkbox"
                                    id="dilation"
                                    name="dilation"
                                    value="Image Dilation"
                                    onChange={onDilationChange}
                                    disabled={!imageStatus}
                                />
                                Image Dilation
                                <Grid item xs>
                                    <Slider
                                        value={typeof brightnessValue === 'number' ? brightnessValue : 0}
                                        onChange={handleBrightnessChange}
                                        aria-labelledby="input-slider"
                                        valueLabelDisplay="auto"
                                        disabled={!imageStatus}
                                    />
                                    Brightness: <span>{brightnessValue}</span>
                                </Grid>
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
                            </div>
                            <br/>
                            <Button primary variant="contained" disabled={!imageStatus}>Apply</Button>
                        </Grid>
                        <Grid item md={5} className="inputoutput">
                            <h4>Processed Image</h4>
                            <canvas height="500" width="500" id="canvasOutput"></canvas>
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