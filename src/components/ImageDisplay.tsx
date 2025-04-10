import React from 'react';

type ImageDisplayProps = {
  src: string;
  alt: string;
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, alt }) => (
  <div style={{ margin: '20px auto', textAlign: 'center' }}>
    <img src={src} alt={alt} style={{ width: '300px', borderRadius: '10px' }} />
  </div>
);

export default ImageDisplay;
