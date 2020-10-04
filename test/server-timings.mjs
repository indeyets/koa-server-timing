import expect from 'unexpected';

import { ServerTimings } from '../dist/index.mjs';

describe("server-timings", () => {
  it("should return empty list by default", () => {
    const st = new ServerTimings();
    expect(st.metrics, "to be empty");
  });
});
