export function CircuitBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M120 120H320V220M320 120V320M320 220H520M520 220V420M520 420H720"
          stroke="#C7D2FE"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <path
          d="M900 80H1100V180M1100 80V280M1100 180H1300"
          stroke="#A5F3FC"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M80 520H280V620M280 520V720M280 620H480M480 620V820"
          stroke="#E0E7FF"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <path
          d="M760 360H960V460M960 360V560M960 460H1160M1160 460V660"
          stroke="#C7D2FE"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <circle cx="320" cy="220" r="4" fill="#C7D2FE" opacity="0.7" />
        <circle cx="520" cy="420" r="4" fill="#A5F3FC" opacity="0.7" />
        <circle cx="1100" cy="180" r="4" fill="#C7D2FE" opacity="0.7" />
        <circle cx="480" cy="620" r="4" fill="#E0E7FF" opacity="0.7" />
      </svg>
    </div>
  );
}
