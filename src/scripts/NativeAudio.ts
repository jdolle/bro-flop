/**
 * Cordova native audio
 */
interface INativeAudio {
  preloadSimple(
    id: string,
    assetPath: string,
    successCallback?: () => void,
    errorCallback?: () => void,
  ): void,
  preloadComplex(
    id: string,
    assetPath: string,
    volume: number,
    voices: number,
    delay?: number,
    successCallback?: () => void,
    errorCallback?: () => void,
  ): void,
  play(
    id: string,
    successCallback?: () => void,
    errorCallback?: () => void,
    completeCallback?: () => void,
  ): void,
  loop(
    id: string,
    successCallback?: () => void,
    errorCallback?: () => void,
  ): void,
  stop(
    id: string,
    successCallback?: () => void,
    errorCallback?: () => void,
  ): void,
  setVolumeForComplexAsset(
    id: string,
    volume: () => void,
    successCallback?: () => void,
    errorCallback?: () => void,
  ): void,
}

const NativeAudio = (): INativeAudio => {
  const plugins: any = (window as any).plugins

  return plugins && plugins.NativeAudio
}

export { NativeAudio }
