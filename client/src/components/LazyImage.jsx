import { useState } from "react";

export function LazyImage({ src, alt, className = "", ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      {...props}
      className={`${className} ${isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"} transition-all duration-300`}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setIsLoaded(true)}
    />
  );
}
