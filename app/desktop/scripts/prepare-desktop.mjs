import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const target = resolve("desktop-dist/index.html");
const destination = process.env.REPSI_DESKTOP_URL || "https://repsi.app";

await mkdir(dirname(target), { recursive: true });
await writeFile(
  target,
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>REPSI</title>
    <meta http-equiv="refresh" content="0; url=${destination.replace(/"/g, "&quot;")}" />
  </head>
  <body>
    <p>Opening REPSI...</p>
    <script>window.location.replace(${JSON.stringify(destination)});</script>
  </body>
</html>
`,
);

console.log(`Prepared desktop launcher for ${destination}`);