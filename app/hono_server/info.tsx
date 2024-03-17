import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { appTitle, requestId, serverId } from "./utils";
import { inject } from "module/dependency-injection";

export const info = new Hono();

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  );
};

const Top: FC<{ message: string; infos: Record<string, string> }> = (props: {
  message: string;
  infos: Record<string, string>;
}) => {
  return (
    <Layout>
      <h1>{props.message}</h1>
      <ul>
        {Object.entries(props.infos).map(([key, value]) => {
          return (
            <li>
              {key}: {value}
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

info.get("/", (c) => {
  const infos = {
    serverName: inject(serverId),
    requestId: inject(requestId),
  };
  return c.html(<Top message={inject(appTitle)} infos={infos} />);
});
