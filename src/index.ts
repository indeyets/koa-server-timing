/**
 * Based on https://github.com/tinovyatkin/koa-server-timing
 * created by Konstantin Vyatkin and Charles Vazac
 */

import assert from "assert";

import { ExtendableContext, Next } from "koa";

/**
 * Converts tuple of [seconds, nanoseconds] to floating
 * point number of milliseconds with 2 fractional digits
 */
function hrTimeToMs(hrtime: [number, number]): number {
  const [sec, nanosec] = hrtime;

  const secAsMs = sec * 1000;
  const nsAsMs = parseFloat((nanosec / 1000000).toFixed(2));

  return secAsMs + nsAsMs;
}

interface Span {
  start: [number, number];
  desc: string;
}

class ServerTimings {
  readonly #started: Map<string, Span>;
  readonly #stopped: Array<string>;

  constructor() {
    this.#started = new Map();
    this.#stopped = [];
  }

  start(spanName: string, spanDesc?: string): void {
    assert.ok(
      !this.#started.has(spanName),
      "This span is running already, name must be unique!"
    );
    assert.ok(spanName.length, "Either slug or description must be non-empty");

    this.#started.set(spanName, {
      start: process.hrtime(),
      desc: spanDesc || "",
    });
  }

  stop(spanName: string): void {
    const span = this.#started.get(spanName);

    assert.ok(span, `Span to stop (${spanName}) is not found!`);
    assert.ok("start" in span, "Span to stop were never started!");

    const stop = process.hrtime(span.start);
    const duration = `;dur=${hrTimeToMs(stop)}`;

    const { desc } = span;
    const description =
      desc.length && spanName !== desc ? `;desc="${desc}"` : "";

    this.#started.delete(spanName);
    this.#stopped.push(`${spanName}${duration}${description}`);
  }

  addTimelessMetric(spanName: string, desc?: string): void {
    const description =
      desc && desc.length && spanName !== desc ? `;desc="${desc}"` : "";
    this.#stopped.push(`${spanName}${description}`);
  }

  stopAll(): void {
    this.#started.forEach((span, spanName) => {
      this.stop(spanName);
    });
  }

  get metrics(): Array<string> {
    return this.#stopped;
  }
}

type ServerTimeContext = ExtendableContext & {
  serverTiming: ServerTimings;
};

const koaServerTiming = () => async (
  ctx: ServerTimeContext,
  next: Next
): Promise<void> => {
  // attaching timings object to state
  ctx.serverTiming = new ServerTimings();
  ctx.serverTiming.start("total", "Total execution time");

  // letting other things pass now
  await next();

  // Terminate all spans that wasn't explicitely terminated
  ctx.serverTiming.stopAll();

  // constructing headers array
  const { metrics } = ctx.serverTiming;

  // Adding our headers now
  if (metrics.length > 0) {
    ctx.append("Server-Timing", metrics);
  }
};

export { koaServerTiming, ServerTimings };
