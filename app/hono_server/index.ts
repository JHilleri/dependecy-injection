import { Hono } from "hono";
import { inject, injectionToken, Injector } from "module/dependency-injection";
import { globalInjector, requestInjector } from "./injection-middleware";

const messageToken = injectionToken<string>("message");
const serverNameToken = injectionToken<string>("serverName");

let nextServerNumber = 1;
const appInjector = new Injector([
  {
    provide: serverNameToken,
    useFactory: () => `hono-server-${nextServerNumber++}`,
  },
]);

function requestId() {
  return crypto.randomUUID();
}

const app = new Hono();

app.use(globalInjector(appInjector));

app.use(
  requestInjector([
    {
      provide: messageToken,
      useValue: "Hello world",
    },
    requestId,
  ])
);

app.get("/", (c) => {
  return c.text(inject(messageToken));
});

app.get("/test", (c) => {
  return c.json({
    requestId: inject(requestId),
    serverName: inject(serverNameToken),
  });
});

export default app;
