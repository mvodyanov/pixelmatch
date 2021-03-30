import Dropzone from 'react-dropzone';
import { uniqueKey } from './utils';

type DropTypes = {
  onDrop: (file: File, index: number) => void;
  images: HTMLImageElement[];
  index: number;
};

export default ({ onDrop, images, index }: DropTypes) => {
  const image = images[index];
  return (
    <Dropzone onDrop={(files: File[]) => onDrop(files[0], index)}>
      {({ getRootProps, getInputProps }) => (
        <section {...getRootProps()}>
          <input {...getInputProps()} />
          {image ? (
            <img
              alt=""
              key={uniqueKey()}
              src={image.src}
              width={image.width}
              height={image.height}
            />
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </section>
      )}
    </Dropzone>
  );
};
