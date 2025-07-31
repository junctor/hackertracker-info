import { useEffect } from "react";

export default function MerchPage() {
  useEffect(() => {
    window.location.replace(
      "https://junctor.github.io/defcon-microsites/merch/"
    );
  }, []);

  return null;
}
