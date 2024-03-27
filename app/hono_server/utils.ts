import { injectionToken } from "module/dependency-injection";

export const TITLE = injectionToken<string>("title");
export const SERVER_ID = injectionToken<string>("serverName");

export function requestId() {
  return crypto.randomUUID();
}

let _counter = 0;

export function counterValue() {
  return _counter++;
}
