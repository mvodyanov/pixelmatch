/* eslint-disable no-console */
import pixelmatch from 'pixelmatch';

/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;

type CompareData = {
  imageData1: Uint8ClampedArray;
  imageData2: Uint8ClampedArray;
  width: number;
  height: number;
};

const getCompareFromCache = async (data: CompareData) => {
  const { width, height } = data;
  try {
    const response = await caches.match(
      new Request(JSON.stringify(data).slice(-999999)),
    );
    const diff = await response?.arrayBuffer()!;
    const imageData = new ImageData(new Uint8ClampedArray(diff), width, height);
    console.info('getCompareFromCache');
    return imageData;
  } catch (error) {
    return false;
  }
};

const compareImagesData = (data: CompareData) => {
  console.info('compareImagesData');
  const {
    imageData1, imageData2, width, height,
  } = data;
  const diff = new Uint8Array(imageData1);
  const diffPixelsCount = pixelmatch(
    imageData1,
    imageData2,
    diff,
    width,
    height,
    {
      threshold: 0.1,
    },
  );
  const diffImageData = new ImageData(
    new Uint8ClampedArray(diff),
    width,
    height,
  );
  caches.open('v1').then((cache) => {
    cache.put(
      new Request(new Request(JSON.stringify(data).slice(-999999))),
      new Response(diff),
    );
  });
  return diffImageData;
};

ctx.addEventListener('message', async (event) => {
  const { data } = event;
  switch (data.type) {
    case 'compareImages':
      // eslint-disable-next-line no-case-declarations
      const diffImageData = (await getCompareFromCache(data)) || compareImagesData(data);
      ctx.postMessage(
        {
          type: 'compareImagesSuccess',
          diffImageData,
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
