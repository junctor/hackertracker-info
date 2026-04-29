import React, { useEffect } from "react";

type HeadProps = {
  children: React.ReactNode;
};

function setAttributes(element: HTMLElement, props: Record<string, unknown>) {
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || value == null || typeof value === "boolean") continue;
    const attr = key === "httpEquiv" ? "http-equiv" : key;
    element.setAttribute(attr, String(value));
  }
}

export default function Head({ children }: HeadProps) {
  useEffect(() => {
    document.head.querySelectorAll("[data-router-head]").forEach((node) => node.remove());

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement<Record<string, unknown>>(child)) return;

      if (child.type === "title") {
        document.title = String(child.props.children ?? "");
        return;
      }

      if (child.type !== "meta" && child.type !== "link") return;

      const element = document.createElement(child.type);
      element.dataset.routerHead = "true";
      setAttributes(element, child.props);
      document.head.append(element);
    });
  }, [children]);

  return null;
}
