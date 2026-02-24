import { c as chain } from "./solid-primitives__utils.mjs";
function mergeRefs(...refs) {
  return chain(refs);
}
export {
  mergeRefs as m
};
