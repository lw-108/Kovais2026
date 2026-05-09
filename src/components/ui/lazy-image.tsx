"use client";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage = ({ src, alt, className, style, ...props }: LazyImageProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "100px 0px", // Load slightly before it comes into view
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (inView && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
    }
  }, [inView, src]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {inView && imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`size-full object-cover transition-opacity duration-700 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;
