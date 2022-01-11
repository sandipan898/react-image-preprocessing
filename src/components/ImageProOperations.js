import React, { useState, useRef } from "react";
import { OpenCvProvider, useOpenCv } from "opencv-react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Container, Tooltip, Button, Checkbox } from '@mui/material'
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import ProcessImage from "react-imgpro";
import { makeStyles } from '@mui/styles';

/**
 * 
 * Brightness
 * Sharpen
 * 
 */

// const Input = styled(MuiInput)`
//  width: 42px;
// `;
// const useStyles = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1
//     },
//     paper: {
//         padding: theme.spacing(2),
//         height: 110,
//         textAlign: "center",
//         color: theme.palette.text.secondary
//     }
// }));

export default function ImageProOperations() {
    const { loaded, cv } = useOpenCv();
    console.log("loaded >> ", loaded);
    console.log("opencv details >> ", cv);

    const imageRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageStatus, setImageStatus] = useState(false);
    const [outputImageStatus, setOutputImageStatus] = useState(null);
    const [grayScaleRotate, setGrayScaleRotate] = useState(true);
    const [grayScale, setGrayScale] = useState(true);
    const [edge, setEdge] = useState(true);
    const [erosion, setErosion] = useState(true);
    const [dilation, setDialation] = useState(true);
    const [src, setSrc] = useState(null);
    const [dst, setDst] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [brightnessValue, setBrightnessValue] = useState(0);
    const [sharpnessValue, setSharpnessValue] = useState(0);

    const [processedSrc, setProcessedSrc] = useState("");
    const [err, setErr] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [imageDist, setImageDist] = useState(null);
    const [quality, setQuality] = useState(100);
    const [posterize, setPosterize] = useState(100);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [fade, setFade] = useState(0);
    const [grayChecked, setGrayChecked] = React.useState(false);
    const [sepiaChecked, setSepiaChecked] = React.useState(false);
    const [opaqueChecked, setOpaqueChecked] = React.useState(false);
    const [invertChecked, setInvertChecked] = React.useState(false);
    const [dither565Checked, setDither565Checked] = React.useState(false);
    const [normalizeChecked, setNormalizeChecked] = React.useState(false);
    // const classes = useStyles();

    const onGrayScaleChange = () => {
        setGrayScale(!grayScale);
        console.log("onGrayScaleChange", grayScale, imageStatus)
        if (grayScale) {
            let src = cv.imread(imageStatus);
            let dst = new cv.Mat();
            // You can try more different parameters
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
            cv.imshow("canvasOutput", dst);
            // let imgElement = document.getElementById("canvasOutput")
            // setImageStatus(imgElement);
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

    const handleChange = (event, functionName) => {
        functionName(event.target.checked);
    };

    const [finalProps, setFinalProps] = useState({});

    const ApplyTransformation = (e) => {
        let link = document.createElement("a");
        link.href = processedSrc;
        link.download =
            fileName.split(".")[0] + "_processed." + fileName.split(".")[1];
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [fileName, setFileName] = useState("");

    const onImageChange = (event) => {
        console.log("event >> ", event.target.files[0]);
        if (event.target.files && event.target.files.length > 1) {
            alert("Please upload a single image file!");
            return;
        }
        const fileD = event.target.files[0].name.split(".");
        const extension = fileD[1];
        if (extension !== "png" && extension !== "jpg" && extension !== "jpeg") {
            alert("File should be an image!");
            return;
        }
        // let imgElement = document.getElementById("imageSrc");
        // imgElement.src = URL.createObjectURL(event.target.files[0]);
        setImageStatus(true);
        setFileName(event.target.files[0].name);
        setSelectedImage(event.target.files[0]);
        const urlValue = URL.createObjectURL(event.target.files[0]);
        console.log("urlValue >> ", urlValue);
        setImageSrc(URL.createObjectURL(event.target.files[0]));
    };


    return (
        <div className="">
            <div>
                <h2 style={{ color: "black", fontWeight: 600, textAlign: "center" }}>
                    Image Preprocessing
                </h2>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Paper className="">
                            <div style={{ marginBottom: 10, color: "black", fontWeight: 600 }}>
                                Upload Image
                            </div>
                            <input
                                type="file"
                                name="myImage"
                                onChange={(e) => onImageChange(e)}
                            />
                        </Paper>
                        <Button variant="contained" color="secondary" style={{ marginLeft: 20, marginTop: 10 }} onClick={{ ApplyTransformation }}>
                            Reset
                        </Button>
                    </Grid>
                    <Grid item xs={10}>
                        <Paper className="">
                            <div style={{ marginBottom: 20, color: "black", fontWeight: 600 }}>
                                Preprocessing Params
                            </div>

                            <div className="preprocessParams" style={{ display: "table" }}>
                                {/* <Slider
                                defaultValue={0}
                                aria-label="Small"
                                valueLabelDisplay="auto"
                                /> */}
                                <span style={{ marginLeft: 20, fontWeight: 600 }}>Gray Scale :{" "}</span>
                                <Checkbox
                                    checked={grayChecked}
                                    onChange={(e) => handleChange(e, setGrayChecked)}
                                    inputProps={{ "aria-label": "primary checkbox" }}
                                />
                                <span style={{ marginLeft: 20, fontWeight: 600 }}>Normalize :{" "}</span>
                                <Checkbox
                                    checked={normalizeChecked}
                                    onChange={(e) => handleChange(e, setNormalizeChecked)}
                                    inputProps={{ "aria-label": "primary checkbox" }}
                                />
                                <span style={{ marginLeft: 20, fontWeight: 600 }}>
                                    Invert :{" "}
                                </span>
                                <Checkbox
                                    checked={invertChecked}
                                    onChange={(e) => handleChange(e, setInvertChecked)}
                                    inputProps={{ "aria-label": "primary checkbox" }}
                                />
                                <Tooltip
                                    title="This sets the alpha channel to opaque for every pixel."
                                    arrow
                                    placement="top"
                                >
                                    <span style={{ marginLeft: 20, fontWeight: 600 }}>Opaque :{" "}</span>
                                </Tooltip>
                                <Checkbox
                                    checked={opaqueChecked}
                                    onChange={(e) => handleChange(e, setOpaqueChecked)}
                                    inputProps={{ "aria-label": "primary checkbox" }}
                                />
                                <span style={{ marginLeft: 20, fontWeight: 600 }}>Sepia :{" "}</span>
                                <Checkbox
                                    checked={sepiaChecked}
                                    onChange={(e) => handleChange(e, setSepiaChecked)}
                                    inputProps={{ "aria-label": "primary checkbox" }}
                                />
                                <span style={{ marginLeft: 20, fontWeight: 600 }}>Dither565 :{" "}</span>
                                <Checkbox
                                    checked={dither565Checked}
                                    onChange={(e) => handleChange(e, setDither565Checked)}
                                    inputProps={{ "aria-label": "primary checkbox" }}
                                />
                                <span style={{ fontWeight: 600 }}>Scale : </span>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={scale}
                                    onChange={(e) => setScale(parseInt(e.target.value))}
                                />
                                <span style={{ marginLeft: 20, fontWeight: 600 }}>Rotate :{" "}</span>
                                <input
                                    type="number"
                                    min="-360"
                                    max="360"
                                    step="0.5"
                                    value={rotate}
                                    onChange={(e) => setRotate(parseFloat(e.target.value))}
                                />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Slider
                                            value={brightness}
                                            onChange={(e) => setBrightness(parseFloat(e.target.value))}
                                            aria-labelledby="input-slider"
                                            valueLabelDisplay="auto"
                                            disabled={!imageStatus}
                                        />
                                        Brightness: <span>{brightness}</span>
                                    </Grid>
                                    <Grid item item xs={3}>
                                        <Slider
                                            value={typeof sharpnessValue === 'number' ? sharpnessValue : 0}
                                            onChange={handleSharpnessChange}
                                            aria-labelledby="input-slider"
                                            valueLabelDisplay="auto"
                                            disabled={!imageStatus}
                                        />
                                        Sharpness: <span>{sharpnessValue}</span>
                                    </Grid>
                                    <Grid item item xs={3}>
                                        <Slider
                                            value={contrast}
                                            onChange={(e) => setContrast(parseFloat(e.target.value))}
                                            aria-labelledby="input-slider"
                                            valueLabelDisplay="auto"
                                            disabled={!imageStatus}
                                        />
                                        Contrast: <span>{contrast}</span>
                                    </Grid>
                                    <Grid item item xs={3}>
                                        <Slider
                                            value={fade}
                                            onChange={(e) => setFade(parseInt(e.target.value))}
                                            aria-labelledby="input-slider"
                                            valueLabelDisplay="auto"
                                            disabled={!imageStatus}
                                        />
                                        Fade: <span>{fade}</span>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={4}>
                                    <Grid item item xs={3}>
                                        <Slider
                                            value={posterize}
                                            onChange={(e) => setPosterize(parseInt(e.target.value))}
                                            aria-labelledby="input-slider"
                                            valueLabelDisplay="auto"
                                            disabled={!imageStatus}
                                        />
                                        Posterize: <span>{posterize}</span>
                                    </Grid>
                                    <Grid item item xs={3}>
                                        <Slider
                                            value={quality}
                                            onChange={(e) => setQuality(parseInt(e.target.value))}
                                            aria-labelledby="input-slider"
                                            valueLabelDisplay="auto"
                                            disabled={!imageStatus}
                                        />
                                        Quality: <span>{quality}</span>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>

            <Grid container spacing={2} style={{ marginLeft: 20 }}>
                {imageSrc && (
                    <Grid item xs={6}>
                        <h3>Original Image</h3>
                        <ProcessImage
                            image={imageSrc}
                            style={{ border: "1px solid black" }}
                            resize={{ width: 500, height: 500 }}
                            id="imageSrc"
                        />
                    </Grid>
                )}
                {imageSrc && (
                    <Grid item xs={6}>
                        <h3>Pre Processed Image</h3>
                        <ProcessImage
                            image={imageSrc}
                            resize={{ width: 500, height: 500 }}
                            quality={quality}
                            greyscale={grayChecked ? grayChecked : false}
                            normalize={normalizeChecked ? normalizeChecked : false}
                            invert={invertChecked ? invertChecked : false}
                            opaque={opaqueChecked ? opaqueChecked : false}
                            sepia={sepiaChecked ? sepiaChecked : false}
                            dither565={dither565Checked ? dither565Checked : false}
                            scale={scale ? scale : 1}
                            rotate={{ degree: rotate ? rotate : 1, mode: "bilinear" }}
                            brightness={brightness ? brightness : 0}
                            contrast={contrast ? contrast : 0}
                            fade={fade ? fade : 0}
                            posterize={posterize ? posterize : 100}
                            id="imageSrc"
                            // {...finalProps}
                            // colors={{
                            //   mix: {
                            //     color: "mistyrose",
                            //     amount: 20
                            //   }
                            // }}
                            processedImage={(src, err) => {
                                setProcessedSrc(src);
                                setErr(err);
                            }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ marginLeft: 20, float: "right" }}
                            onClick={ApplyTransformation}
                        >
                            Download
                        </Button>
                    </Grid>
                )}
            </Grid>
        </div>
    );
}