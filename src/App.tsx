import './App.css';
// eslint-disable-next-line import/no-unresolved
import CompareWorker from 'worker-loader!./workers/compare-worker';
import { useRef, useState } from 'react';

import {
  getImageData,
  imageToUint8ClampedArray,
} from './utils';
import Drop from './Drop';

const worker = new CompareWorker();

function App() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [errorText, setErrorText] = useState<any>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const printResult = (diffContext: ImageData) => {
    if (!canvasRef.current) return setErrorText('no canvas element');
    const ctx = canvasRef.current.getContext('2d')!;

    canvasRef.current.width = diffContext.width;
    canvasRef.current.height = diffContext.height;
    ctx.putImageData(diffContext, 0, 0);
    return false;
  };

  const compareImages = (image1: HTMLImageElement, image2: HTMLImageElement) => {
    setErrorText('');
    if (!image1 || !image2) {
      setErrorText('2 images important');
      return false;
    }
    if (
      image1.width !== image2.width
      && image1.height !== image2.height
    ) {
      setErrorText('images sizes are different');
      return false;
    }

    const imageData1 = imageToUint8ClampedArray(image1);
    const imageData2 = imageToUint8ClampedArray(image2);
    worker.postMessage(
      {
        type: 'compareImages',
        imageData1,
        imageData2,
        width: image1.width,
        height: image1.height,
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
    return false;
  };

  const onDrop = async (file: File, index: number) => {
    const image = await getImageData(file);

    const newImages = [...images];
    newImages[index] = image;
    setImages(newImages);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img alt="original" id="original" src={imgOriginal} />
        <img alt="fixed" id="fixed" src={imgFixed} /> */}

        <div className="dropZone">
          <Drop onDrop={onDrop} images={images} index={0} />
          <Drop onDrop={onDrop} images={images} index={1} />
        </div>
        <button
          type="button"
          onClick={() => compareImages(images[0], images[1])}
        >
          Compare
        </button>
        {errorText}
        <canvas ref={canvasRef} />
      </header>
    </div>
  );
}

export default App;
