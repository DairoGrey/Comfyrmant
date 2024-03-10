import { ImageOutputResponse } from '../api/types';

export const imageToStr = (image: ImageOutputResponse) => `${image.type}:${image.subfolder}:${image.filename}`;
