export function getRandomAlpha(banAlphaArray?: string[]): string {
  const res = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return banAlphaArray?.includes(res) ? getRandomAlpha(banAlphaArray) : res;
}
