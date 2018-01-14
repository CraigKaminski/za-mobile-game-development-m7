export function getGameLandscapeDimensions(maxW: number, maxH: number): {h: number, w: number} {
  const w = window.innerWidth * window.devicePixelRatio;
  const h = window.innerHeight * window.devicePixelRatio;

  let landW = Math.max(w, h);
  let landH = Math.min(w, h);

  if (landW > maxW) {
    const ratioW = maxW / landW;
    landW *= ratioW;
    landH *= ratioW;
  }

  if (landH > maxH) {
    const ratioH = maxW / landW;
    landW *= ratioH;
    landH *= ratioH;
  }

  return {
    h: landH,
    w: landW,
  };
}
