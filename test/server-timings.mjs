import expect from 'unexpected';

import { ServerTimings } from '../dist/index.mjs';

describe("server-timings", () => {
  it("should return empty list by default", () => {
    const st = new ServerTimings();
    expect(st.metrics, "to be empty");
  });

  it('should generate proper strings for timeless metrics', () => {
    const st = new ServerTimings();
    st.addTimelessMetric('hello', 'Hello, world!');
    st.addTimelessMetric('hi');

    expect(st.metrics[0], 'to equal', 'hello;desc="Hello, world!"');
    expect(st.metrics[1], 'to equal', 'hi');
  });

  it('should allow quotes and slashes in descriptions', () => {
    const st = new ServerTimings();
    st.addTimelessMetric('hello', 'Hel"lo", world!');
    st.addTimelessMetric('hello', 'Hel\\lo, world!');

    expect(st.metrics[0], 'to equal', 'hello;desc="Hel\\"lo\\", world!"');
    expect(st.metrics[1], 'to equal', 'hello;desc="Hel\\\\lo, world!"');
  });
});
