/* eslint-disable jsx-a11y/alt-text */
//@ts-nocheck
import logo from "./logo.svg";
import imgOriginal from "./img/original.png";
import imgFixed from "./img/fixed.png";
import "./App.css";
import pixelmatch from "pixelmatch";
import { useEffect, useState } from "react";

const WIDTH = 300;
const HEIGHT = 173;

function App() {
  const [imagesData, setImagesData] = useState([]);

  function onLoad(e) {
    const id = e.target.id;
    const canvas = convertImageToCanvas(id);
    setImagesData([
      ...imagesData,
      canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height),
    ]);
    // wrimteResultToPage();
  }

  useEffect(() => {
    if (imagesData.length === 2) {
      compareImagesData(imagesData[0], imagesData[1]);
    }
  }, [imagesData]);

  function convertImageToCanvas(imageID: string) {
    var image = document.getElementById(imageID) as HTMLImageElement;
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d")!.drawImage(image!, 0, 0);
    // image.style = "width: 400px";
    return canvas;
  }

  function compareImagesData(before, after) {
    var diff = new ImageData(before.width, before.height);

    pixelmatch(
      before.data,
      after.data,
      diff.data,
      before.width,
      before.height,
      {
        threshold: 0.1,
      }
    );

    writeResultToPage(diff);
  }

  function writeResultToPage(diffContext) {
    var canvas = document.createElement("canvas"); //  new HTMLCanvasElement();
    // canvas.width = convertImageToCanvas("img").width;
    // canvas.height = convertImageToCanvas("img").height;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    var ctx = canvas.getContext("2d");
    ctx.putImageData(diffContext, 0, 0);
    var result = document.getElementById("result");
    result.appendChild(ctx.canvas);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img id="original" src={imgOriginal} onLoad={onLoad} />
        <img id="fixed" src={imgFixed} onLoad={onLoad} />
        button
        <p id="result">diff:</p>
      </header>
    </div>
  );
}

export default App;
