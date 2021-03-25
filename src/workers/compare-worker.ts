import pixelmatch from 'pixelmatch';

/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;

const compareImagesData = ({
  imageData1,
  imageData2,
  width,
  height,
}: {
  imageData1: Uint8ClampedArray;
  imageData2: Uint8ClampedArray;
  width: number;
  height: number;
}) => {
  const diff = new Uint8Array(imageData1);
  const diffPixelsCount = pixelmatch(imageData1, imageData2, diff, width, height, {
    threshold: 0.1,
  });
  const diffImageData = new ImageData(new Uint8ClampedArray(diff), width, height);
  return { diffImageData, diffPixelsCount };
};

ctx.addEventListener('message', (event) => {
  const { data } = event;
  switch (data.type) {
    case 'compareImages':
      // eslint-disable-next-line no-case-declarations
      const { diffImageData, diffPixelsCount } = compareImagesData(data);
      ctx.postMessage(
        {
          type: 'compareImagesSuccess',
          diffImageData,
          diffPixelsCount,
        },
        [diffImageData.data.buffer],
      );
      break;
    default:
      ctx.postMessage({
        type: 'error',
        response: `Unknown command: ${data.msg}`,
      });
  }
});

export {};
