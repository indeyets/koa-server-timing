import { ExtendableContext, Next } from "koa";

import { ServerTimings } from "./server-timings";

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
