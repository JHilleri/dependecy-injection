import { injectionToken } from "module/dependency-injection";

export const appTitle = injectionToken<string>("message");
export const serverId = injectionToken<string>("serverName");

export function requestId() {
  return crypto.randomUUID();
}
