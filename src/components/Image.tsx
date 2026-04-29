import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "style"> & {
  src: string;
  fill?: boolean;
  priority?: boolean;
};

export default function Image({ className, fill, priority, loading, ...props }: ImageProps) {
  const resolvedClassName = [fill ? "ui-image-fill" : null, className].filter(Boolean).join(" ");

  return (
    <img
      {...props}
      loading={loading ?? (priority ? "eager" : "lazy")}
      className={resolvedClassName || undefined}
    />
  );
}
