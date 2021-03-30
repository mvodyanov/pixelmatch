export const imageToCanvas = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  return canvas;
};

export const canvasToUint8ClampedArray = (canvas: HTMLCanvasElement) => canvas
  .getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
