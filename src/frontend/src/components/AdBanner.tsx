import { useEffect, useRef } from "react";

interface AdBannerProps {
  adKey: string;
  width: number;
  height: number;
}

export function AdBanner({ adKey, width, height }: AdBannerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const script1 = document.createElement("script");
    script1.innerHTML = `
      atOptions = {
        'key': '${adKey}',
        'format': 'iframe',
        'height': ${height},
        'width': ${width},
        'params': {}
      };
    `;

    const script2 = document.createElement("script");
    script2.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    script2.async = true;

    ref.current.appendChild(script1);
    ref.current.appendChild(script2);
  }, [adKey, width, height]);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center overflow-hidden"
      style={{ width, height, maxWidth: "100%" }}
    />
  );
}
