import { createComponent } from "module/hono-components";

export type DictionaryProps = {
  infos: Record<string, string | number | undefined>;
};

export const Dictionary = createComponent<DictionaryProps>(() => {
  return ({ infos }) => {
    return (
      <ul>
        {Object.entries(infos).map(([key, value]) => {
          return (
            <li>
              {key}: {value}
            </li>
          );
        })}
      </ul>
    );
  };
});
