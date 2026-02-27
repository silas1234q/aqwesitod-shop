const transform = "f_auto,q_auto:good,w_800,e_sharpen:50";
export function cld(url: string) {
  return url.replace("/upload/", `/upload/${transform}/`);
}