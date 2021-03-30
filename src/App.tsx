import './App.css';
// eslint-disable-next-line import/no-unresolved
import CompareWorker from 'worker-loader!./workers/compare-worker';
import { useRef, useState } from 'react';
import imgFixed from './img/fixed.png';
import imgOriginal from './img/original.png';
import { canvasToUint8ClampedArray, imageToCanvas } from './utils';

const worker = new CompareWorker();

function App() {
  const [errorText, setErrorText] = useState<string | null>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const printResult = (diffContext: ImageData) => {
    if (!canvasRef.current) return setErrorText('no canvas element');
    const ctx = canvasRef.current.getContext('2d')!;

    canvasRef.current.width = diffContext.width;
    canvasRef.current.height = diffContext.height;
    ctx.putImageData(diffContext, 0, 0);
    return false;
  };

  const compareImages = (imageID1: string, imageID2: string) => {
    const canvas1 = imageToCanvas(
      document.getElementById(imageID1) as HTMLImageElement,
    );
    const canvas2 = imageToCanvas(
      document.getElementById(imageID2) as HTMLImageElement,
    );
    if (canvas1.width === canvas2.width && canvas1.height === canvas2.height) {
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
      worker.onmessage = ({
        data: { diffImageData, diffPixelsCount, type },
      }) => {
        if (type === 'compareImagesSuccess') {
          printResult(diffImageData);
          return diffPixelsCount === 0;
        }
      };
    } else {
      setErrorText('images sizes are different');
    }
    return false;
  };

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
        <canvas ref={canvasRef} />
        {errorText}
      </header>
    </div>
  );
}

export default App;
