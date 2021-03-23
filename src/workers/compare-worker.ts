// @ts-nocheck
import pixelmatch from 'pixelmatch';

/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;

function compareImagesData({
  imageData1, imageData2, width, height,
}) {
  const diff = new ImageData(width, height);
  pixelmatch(imageData1, imageData2, diff.data, width, height, {
    threshold: 0.1,
  });
  return diff;
}

ctx.addEventListener('message', (event) => {
  const { data } = event;
  switch (data.type) {
    case 'compareImages':
      // eslint-disable-next-line no-case-declarations
      const diff = compareImagesData(data);
      ctx.postMessage(
        {
          type: 'compareImagesSuccess',
          diff,
        },
        [diff.data.buffer],
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
