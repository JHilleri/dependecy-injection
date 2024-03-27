import { type Context } from "hono";
import type { FC } from "hono/jsx";
import { runOutsideInjectionContext } from "../dependency-injection/injector";

export function renderComponent<RouteContext extends Context>(
  component: () => FC
) {
  return (context: RouteContext) => {
    const Component = component();

    return runOutsideInjectionContext(() =>
      context.html(
        Component({
          ...context.req.param(),
        })
      )
    );
  };
}
