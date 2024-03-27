import { createComponent } from "module/hono-components";
import type { DictionaryProps } from "./dictionary.component";

export const Table = createComponent<DictionaryProps>(() => {
  return ({ infos }) => (
    <>
      <style>
        {`
        table {
          border-collapse: collapse;
          width: 100%;
        }
        
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        
        tr:nth-child(even) {
          background-color: #eee;
        }
      `}
      </style>
      <table>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
        {Object.entries(infos).map(([key, value]) => {
          return (
            <tr>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          );
        })}
      </table>
    </>
  );
});
