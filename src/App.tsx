// @ts-nocheck
import './App.css';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import CompareWorker from 'worker-loader!./workers/compare-worker';
import pixelmatch from 'pixelmatch';
import imgFixed from './img/fixed.png';
import imgOriginal from './img/original.png';

const worker = new CompareWorker();

function App() {
  function imageToCanvas(imageID: string) {
    const image = document.getElementById(imageID);
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d')!.drawImage(image!, 0, 0);
    // image.style = "width: 400px";
    return canvas;
  }

  function canvasToUint8ClampedArray(canvas) {
    return canvas
      .getContext('2d')
      .getImageData(0, 0, canvas.width, canvas.height);
  }

  function printResult(diffContext) {
    const canvas = document.createElement('canvas');
    canvas.width = diffContext.width;
    canvas.height = diffContext.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(diffContext, 0, 0);
    const result = document.getElementById('result');
    result?.replaceWith(ctx.canvas);
  }

  function compareImages(imageID1, imageID2) {
    const canvas1 = imageToCanvas(imageID1);
    const canvas2 = imageToCanvas(imageID2);
    const imageData1 = canvasToUint8ClampedArray(canvas1).data;
    const imageData2 = canvasToUint8ClampedArray(canvas2).data;

    worker.postMessage(
      {
        type: 'compareImages',
        imageData1,
        imageData2,
        width: canvas1.width,
        height: canvas2.height,
      },
      [imageData1.buffer, imageData2.buffer],
    );
    worker.onmessage = ({ data }) => {
      printResult(data.diff);
    };
  }

  return (
    <div className="App">
      <header className="App-header">
        <img alt="original" id="original" src={imgOriginal} />
        <img alt="fixed" id="fixed" src={imgFixed} />
        <button
          type="button"
          onClick={() => compareImages('original', 'fixed')}
        >
          Compare
        </button>
        <p id="result" />
      </header>
    </div>
  );
}

export default App;
