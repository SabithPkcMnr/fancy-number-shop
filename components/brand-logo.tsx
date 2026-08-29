const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

const assets = {
  full: {
    src: `${base}/images/logo.png`,
    srcSet: `${base}/images/logo-sm.png 800w, ${base}/images/logo.png 972w`,
    alt: "FancyNumberShop",
  },
  mark: {
    src: `${base}/images/logo-mark.png`,
    srcSet: undefined,
    alt: "FancyNumberShop",
  },
};

export function BrandLogo({
  variant = "full",
  className = "h-8 w-auto",
  sizes = "(max-width: 640px) 210px, (max-width: 1024px) 220px, 250px",
}: {
  variant?: "full" | "mark";
  className?: string;
  sizes?: string;
}) {
  const asset = assets[variant];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.src}
      srcSet={asset.srcSet}
      sizes={asset.srcSet ? sizes : undefined}
      alt={asset.alt}
      className={className}
    />
  );
}
