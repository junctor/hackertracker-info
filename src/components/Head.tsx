import React, { useEffect } from "react";

type HeadProps = {
  children: React.ReactNode;
};

type HeadTag = {
  type: "link" | "meta";
  attributes: Record<string, string>;
};

type HeadState = {
  title: string | null;
  tags: HeadTag[];
};

function getTextContent(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number" || typeof node === "bigint") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }
  return "";
}

function getHeadState(children: React.ReactNode): HeadState {
  const state: HeadState = { title: null, tags: [] };

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<Record<string, unknown>>(child)) return;

    if (child.type === "title") {
      state.title = getTextContent(child.props.children as React.ReactNode);
      return;
    }

    if (child.type !== "meta" && child.type !== "link") return;

    const attributes: Record<string, string> = {};
    for (const [key, value] of Object.entries(child.props)) {
      if (key === "children" || value == null || typeof value === "boolean") continue;
      attributes[key === "httpEquiv" ? "http-equiv" : key] = String(value);
    }
    state.tags.push({ type: child.type, attributes });
  });

  return state;
}

export default function Head({ children }: HeadProps) {
  const serializedHead = JSON.stringify(getHeadState(children));

  useEffect(() => {
    const state = JSON.parse(serializedHead) as HeadState;
    document.head.querySelectorAll("[data-router-head]").forEach((node) => node.remove());

    if (state.title !== null) document.title = state.title;

    for (const tag of state.tags) {
      const element = document.createElement(tag.type);
      element.dataset.routerHead = "true";
      for (const [key, value] of Object.entries(tag.attributes)) {
        element.setAttribute(key, value);
      }
      document.head.append(element);
    }
  }, [serializedHead]);

  return null;
}
