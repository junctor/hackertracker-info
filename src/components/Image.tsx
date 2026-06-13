import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "style"> & {
  src: string;
  fillContainer?: boolean;
};

export default function Image({
  className,
  decoding = "async",
  fillContainer,
  loading = "lazy",
  ...props
}: ImageProps) {
  const resolvedClassName = [fillContainer ? "ui-image-fill" : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <img
      {...props}
      decoding={decoding}
      loading={loading}
      className={resolvedClassName || undefined}
    />
  );
}
