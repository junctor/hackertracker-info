import "../styles/globals.css";
import type { AppProps } from "next/app";

function Info({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default Info;
