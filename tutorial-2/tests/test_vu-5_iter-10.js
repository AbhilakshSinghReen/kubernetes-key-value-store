// 5 VU making 10 iterations each

export { testCRUD } from "./common.js";

export const options = {
  scenarios: {
    testCRUD: {
      exec: "testCRUD",
      executor: "per-vu-iterations",
      vus: 5,
      iterations: 10,
    },
  },
};
