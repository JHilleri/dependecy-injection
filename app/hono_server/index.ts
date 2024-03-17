import { Hono } from "hono";
import { inject, Injector } from "module/dependency-injection";
import { globalInjector, requestInjector } from "./injection-middleware";
import { info } from "./info";
import { appTitle, requestId, serverId } from "./utils";

const appInjector = new Injector([
  {
    provide: serverId,
    useFactory: () => `hono-server-${crypto.randomUUID()}`,
  },
]);

const app = new Hono();

app.use(globalInjector(appInjector));

app.use(
  requestInjector([
    {
      provide: appTitle,
      useValue: "test injection with hono",
    },
    requestId,
  ])
);

app.get("/", (c) => {
  return c.text(inject(appTitle));
});

app.get("/test", (c) => {
  return c.json({
    requestId: inject(requestId),
    serverName: inject(serverId),
  });
});

app.route("jsx", info);

export default app;
