import { createComponent } from "module/hono-components";

export const Layout = createComponent(() => {
  return (props) => {
    return (
      <html>
        <head>
          <style>
            {`
            body {
              font-family: system-ui, sans-serif;
              margin: 0;
              padding: 0;
            }

            nav {
              display: flex;
              justify-content: center;
              gap: 1rem;
              background-color: #f0f0f0;
              }
  
              a {
              text-decoration: none;
              color: blue;
              }
          `}
          </style>
        </head>
        <body>
          <nav>
            <a href="/info/list">List</a>
            <a href="/info/array">Array</a>
          </nav>

          {props.children}
        </body>
      </html>
    );
  };
});
