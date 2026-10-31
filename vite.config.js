import { defineConfig } from "vite";
export default defineConfig({
  plugins: [
    {
      name: "development-email-terminal-log",
      configureServer(server) {
        server.middlewares.use("/__email-log", (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end();
            return;
          }
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
            if (body.length > 20000) req.destroy();
          });
          req.on("end", () => {
            try {
              const item = JSON.parse(body);
              console.log(
                "\n[LaunchPad email preview — delivery status is in the app]\n" +
                  JSON.stringify(item, null, 2),
              );
              res.end("ok");
            } catch {
              res.statusCode = 400;
              res.end("Invalid JSON");
            }
          });
        });
      },
    },
  ],
});
