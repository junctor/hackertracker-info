import { readFile } from "node:fs/promises";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

const staticPageNames = ["apps", "merch", "tv"] as const;
const devStaticPageHtml = new Map(
  staticPageNames.map((name) => [
    name,
    fileURLToPath(new URL(`./public/${name}/index.html`, import.meta.url)),
  ]),
);
const previewStaticPageHtml = new Map(
  staticPageNames.map((name) => [
    name,
    fileURLToPath(new URL(`./dist/${name}/index.html`, import.meta.url)),
  ]),
);
type MiddlewareNext = (error?: unknown) => void;

function getStaticPageName(url: string | undefined) {
  const { pathname } = new URL(url ?? "/", "http://localhost");

  return staticPageNames.find((name) => pathname === `/${name}` || pathname === `/${name}/`);
}

function serveStaticPage(pathnames: ReadonlyMap<string, string>) {
  return async (request: IncomingMessage, response: ServerResponse, next: MiddlewareNext) => {
    const pageName = getStaticPageName(request.url);
    const pathname = pageName ? pathnames.get(pageName) : undefined;

    if (!pathname) {
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
      name: "static-pages",
      configureServer(server) {
        server.middlewares.use(serveStaticPage(devStaticPageHtml));
      },
      configurePreviewServer(server) {
        server.middlewares.use(serveStaticPage(previewStaticPageHtml));
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
