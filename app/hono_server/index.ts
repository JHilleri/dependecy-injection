import { Hono } from "hono";
import { inject, Injector } from "module/dependency-injection";
import { globalInjector, requestInjector } from "./injection-middleware";
import { TITLE, counterValue, requestId, SERVER_ID } from "./utils";
import { renderComponent } from "module/hono-components";
import { Info } from "./components/info.component";
import { Table } from "./components/table.component";
import { Dictionary } from "./components/dictionary.component";

const appInjector = new Injector([
  {
    provide: SERVER_ID,
    useFactory: () => `hono-server-${crypto.randomUUID()}`,
  },
]);

const app = new Hono();

app.use(globalInjector(appInjector));

app.use(
  requestInjector([
    {
      provide: TITLE,
      useValue: "test injection with hono",
    },
    requestId,
  ])
);

app.get("/", (c) => {
  return c.text(inject(TITLE));
});

app.get("api/info/:message?", (c) => {
  return c.json({
    requestId: inject(requestId),
    serverName: inject(SERVER_ID),
    message: c.req.param("message"),
    title: inject(TITLE),
    counter: inject(counterValue),
  });
});

app.get("info/list/:message?", ...renderComponent(Info, { title: "List" }));

app.get(
  "info/array/:message?",
  ...renderComponent(Info, {
    title: "Array",
    providers: [
      {
        provide: Dictionary,
        useFactory: Table,
      },
    ],
  })
);

export default app;
