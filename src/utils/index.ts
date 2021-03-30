export const imageToCanvas = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  return canvas;
};

export const canvasToUint8ClampedArray = (
  canvas: HTMLCanvasElement,
) => canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);

export const imageToUint8ClampedArray = (
  image: HTMLImageElement,
) => canvasToUint8ClampedArray(imageToCanvas(image)).data;

export const getImageData = (file: File) => new Promise<HTMLImageElement>((resolve) => {
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.src = reader.result as string;

    image.onload = () => {
      resolve(image);
    };
  };
  reader.readAsDataURL(file);
});

export const getImageArrayBuffer = (file: File) => new Promise<ArrayBuffer>((resolve) => {
  const reader = new FileReader();
  reader.onload = () => {
    if (reader.result) {
      resolve(reader.result as ArrayBuffer);
    }
  };
  reader.readAsArrayBuffer(file);
});

export const uniqueKey = () => new Date().getTime().toString();
