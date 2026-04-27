/**
 * Global SVG filters: feTurbulence, feColorMatrix, feBlend
 * Rendered once in the DOM, referenced via CSS filter: url(#id)
 */
export default function SVGFilters() {
  return (
    <svg
      className="absolute w-0 h-0 overflow-hidden"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Grain filter using feTurbulence + feColorMatrix */}
        <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="desaturated"
          />
          <feBlend
            in="SourceGraphic"
            in2="desaturated"
            mode="overlay"
            result="blended"
          />
        </filter>

        {/* Gold color overlay filter */}
        <filter id="gold-tint" x="0%" y="0%" width="100%" height="100%">
          <feColorMatrix
            type="matrix"
            values="1.2 0.1 0 0 0
                    0.05 1.0 0 0 0
                    0 0 0.7 0 0
                    0 0 0 1 0"
          />
        </filter>

        {/* Turbulence displacement for luxury effects */}
        <filter id="liquid-distort" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.015"
            numOctaves="3"
            seed="42"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
