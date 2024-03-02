declare class ImageCapture {
  constructor(track: MediaStreamTrack);
  grabFrame(): ImageBitmap;
}

export const takeScreenshot = async () => {
  const displayMediaOptions: DisplayMediaStreamOptions = {
    video: {
      displaySurface: 'window',
    },
    audio: {
      suppressLocalAudioPlayback: true,
    },
    preferCurrentTab: true,
    selfBrowserSurface: 'include',
    systemAudio: 'exclude',
    surfaceSwitching: 'exclude',
    monitorTypeSurfaces: 'exclude',
  } as any;

  let track: MediaStreamTrack | undefined;

  try {
    const captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    track = captureStream.getTracks()[0];

    const ic = new ImageCapture(track);
    const bitmap = await ic.grabFrame();

    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    context?.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);

    return canvas.toDataURL();
  } catch (err) {
    console.error(`Error: ${err}`);
  } finally {
    track?.stop();
  }
};
