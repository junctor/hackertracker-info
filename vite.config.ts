import { readFile } from "node:fs/promises";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

const devAppsHtml = fileURLToPath(new URL("./public/apps/index.html", import.meta.url));
const previewAppsHtml = fileURLToPath(new URL("./dist/apps/index.html", import.meta.url));
type MiddlewareNext = (error?: unknown) => void;

function isAppsPath(url: string | undefined) {
  const { pathname } = new URL(url ?? "/", "http://localhost");

  return pathname === "/apps" || pathname === "/apps/";
}

function serveAppsPage(pathname: string) {
  return async (request: IncomingMessage, response: ServerResponse, next: MiddlewareNext) => {
    if (!isAppsPath(request.url)) {
      next();
      return;
    }

    try {
      const html = await readFile(pathname, "utf8");

      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.setHeader("Cache-Control", "no-cache");
      response.end(html);
    } catch {
      next();
    }
  };
}

export default defineConfig({
  plugins: [
    {
      name: "static-apps-page",
      configureServer(server) {
        server.middlewares.use(serveAppsPage(devAppsHtml));
      },
      configurePreviewServer(server) {
        server.middlewares.use(serveAppsPage(previewAppsHtml));
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    sortImports: {
      groups: [
        "type-import",
        ["value-builtin", "value-external"],
        "type-internal",
        "value-internal",
        ["type-parent", "type-sibling", "type-index"],
        ["value-parent", "value-sibling", "value-index"],
        "unknown",
      ],
    },
  },
  lint: {
    ignorePatterns: ["node_modules/**", "coverage/**", "dist/**"],
    plugins: ["react", "typescript", "unicorn", "oxc"],
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
    env: {
      browser: true,
      node: true,
    },
    options: {},
  },
});
