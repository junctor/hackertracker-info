import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../components/misc/Loading";

function Info({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const routeLoading = () => {
    setLoading(true);
  };

  const routeDone = () => {
    setLoading(false);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", routeLoading);
    router.events.on("routeChangeComplete", routeDone);
    router.events.on("routeChangeError", routeDone);

    return () => {
      router.events.off("routeChangeStart", routeLoading);
      router.events.off("routeChangeComplete", routeDone);
      router.events.off("routeChangeError", routeDone);
    };
  }, [router.events]);

  if (loading) {
    return <Loading />;
  }

  return <Component {...pageProps} />;
}

export default Info;
