const expect = require("unexpected");

const { ServerTimings } = require("../dist/index");

describe("server-timings", () => {
  it("should return empty list by default", () => {
    const st = new ServerTimings();
    expect(st.metrics, "to be empty");
  });
});
