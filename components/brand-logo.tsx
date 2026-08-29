const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

const assets = {
  full: {
    src: `${base}/images/logo-sm.png`,
    srcSet: `${base}/images/logo-sm.png 480w, ${base}/images/logo.png 960w`,
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
  sizes = "(max-width: 640px) 140px, (max-width: 1024px) 200px, 240px",
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
