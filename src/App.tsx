// @ts-nocheck
import './App.css';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import CompareWorker from 'worker-loader!./workers/compare-worker';
import pixelmatch from 'pixelmatch';
import imgFixed from './img/fixed.png';
import imgOriginal from './img/original.png';

const worker = new CompareWorker();

const WIDTH = 300;
const HEIGHT = 173;

function App() {
  const [imagesData, setImagesData] = useState([]);

  function convertImageToCanvas(imageID: string) {
    const image = document.getElementById(imageID) as HTMLImageElement;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d')!.drawImage(image!, 0, 0);
    // image.style = "width: 400px";
    return canvas;
  }

  function writeResultToPage(diffContext) {
    const canvas = document.createElement('canvas'); //  new HTMLCanvasElement();
    // canvas.width = convertImageToCanvas("img").width;
    // canvas.height = convertImageToCanvas("img").height;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(diffContext, 0, 0);
    const result = document.getElementById('result');
    result.appendChild(ctx.canvas);
  }

  function compareImagesData(before, after) {
    const diff = new ImageData(before.width, before.height);

    pixelmatch(
      before.data,
      after.data,
      diff.data,
      before.width,
      before.height,
      {
        threshold: 0.1,
      },
    );

    return diff;
  }

  function onLoad(e) {
    const { id } = e.target;
    const canvas = convertImageToCanvas(id);
    setImagesData([
      ...imagesData,
      canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height),
    ]);
  }

  useEffect(() => {
    if (imagesData.length === 2) {
      const diff = compareImagesData(imagesData[0], imagesData[1]);
      writeResultToPage(diff);
      worker.postMessage('cinsss');
      worker.onmessage = ((event) => {
        console.info(event.data);
      });
    }
  }, [imagesData]);

  return (
    <div className="App">
      <header className="App-header">
        <img alt="original" id="original" src={imgOriginal} onLoad={onLoad} />
        <img alt="fixed" id="fixed" src={imgFixed} onLoad={onLoad} />
        button
        <p id="result">diff:</p>
      </header>
    </div>
  );
}

export default App;
