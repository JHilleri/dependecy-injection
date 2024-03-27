import { inject } from "module/dependency-injection";
import { createComponent } from "module/hono-components";
import { TITLE, counterValue, requestId, SERVER_ID } from "../utils";
import { Dictionary } from "./dictionary.component";
import { Layout } from "./layout.component";

export const Info = createComponent<{ message?: string }>(() => {
  const infos = {
    serverName: inject(SERVER_ID),
    requestId: inject(requestId),
    counter: inject(counterValue),
  };
  const DictionaryComponent = inject(Dictionary);
  const LayoutComponent = inject(Layout);
  const title = inject(TITLE);

  return ({ message }) => (
    <LayoutComponent>
      <h1>{title}</h1>
      <DictionaryComponent infos={{ ...infos, message }} />
    </LayoutComponent>
  );
});
