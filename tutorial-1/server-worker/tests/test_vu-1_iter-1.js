// 1 VU making 1 iteration

export { testCRUD } from "./common.js";

export const options = {
  scenarios: {
    testCRUD: {
      exec: "testCRUD",
      executor: "per-vu-iterations",
      vus: 1,
      iterations: 1,
    },
  },
};
