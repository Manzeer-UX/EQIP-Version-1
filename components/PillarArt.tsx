/* Small animated system diagrams for the four "What EQIP makes visible" pillars.
   Wordless, drawn in the brand's systems-map language: nodes, straight connectors, square terminals. */

const NETWORK = "M28 44 L72 92 L118 34 L136 100 L176 62 L214 30 M72 92 L136 100 M176 62 L206 112 M118 34 L176 62 M28 44 L62 22";
const NODES: Array<[number, number]> = [
  [28, 44], [72, 92], [118, 34], [136, 100], [176, 62], [214, 30], [206, 112], [62, 22],
];

/** Understand what you own — a scan reveals hidden relationships */
export function ArtUnderstand() {
  return (
    <svg className="pillar__art" viewBox="0 0 240 140" aria-hidden="true">
      <defs>
        <clipPath id="art-scan-clip">
          <rect x="-70" y="0" width="70" height="140">
            <animate attributeName="x" values="-70;240" dur="4.5s" repeatCount="indefinite" />
          </rect>
        </clipPath>
      </defs>
      <g className="art-dim">
        <path d={NETWORK} />
        {NODES.map(([x, y]) => <circle key={`d${x}`} cx={x} cy={y} r="3.5" />)}
      </g>
      <g className="art-lit" clipPath="url(#art-scan-clip)">
        <path d={NETWORK} />
        {NODES.map(([x, y]) => <circle key={`l${x}`} cx={x} cy={y} r="4.5" />)}
      </g>
      <line className="art-scan" x1="0" y1="6" x2="0" y2="134">
        <animate attributeName="x1" values="0;310" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="0;310" dur="4.5s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

/** Preserve what matters — a protected core inside slow orbits */
export function ArtPreserve() {
  return (
    <svg className="pillar__art" viewBox="0 0 240 140" aria-hidden="true">
      <g transform="translate(120 70)">
        <circle className="art-ring" r="58" strokeDasharray="2 7">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="40s" repeatCount="indefinite" />
        </circle>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="16s" repeatCount="indefinite" />
          <circle className="art-ring" r="42" strokeDasharray="26 10" />
          <circle className="art-node" cx="42" cy="0" r="4" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite" />
          <circle className="art-ring art-ring--lit" r="26" strokeDasharray="40 124" />
          <circle className="art-node art-node--lit" cx="0" cy="-26" r="3.5" />
        </g>
        <rect className="art-core" x="-9" y="-9" width="18" height="18" transform="rotate(45)" />
      </g>
    </svg>
  );
}

/** Validate what changes — focus moves to where confidence is needed */
export function ArtValidate() {
  const cols = [22, 48, 74, 100, 126, 152, 178, 204];
  const rows = [20, 46, 72, 98];
  const hits: Array<{ x: number; y: number; values: string; keyTimes: string }> = [
    { x: 74, y: 46, values: "0;0;1;1;0;0;0;0;0;0", keyTimes: "0;.12;.2;.3;.36;.45;.6;.75;.9;1" },
    { x: 178, y: 20, values: "0;0;0;0;0;1;1;0;0;0", keyTimes: "0;.12;.2;.3;.36;.45;.55;.62;.9;1" },
    { x: 126, y: 98, values: "0;0;0;0;0;0;0;1;1;0", keyTimes: "0;.12;.2;.3;.36;.45;.6;.75;.9;1" },
  ];
  return (
    <svg className="pillar__art" viewBox="0 0 240 140" aria-hidden="true">
      <g className="art-cells">
        {rows.map((y) => cols.map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="16" height="16" />))}
      </g>
      {hits.map((h) => (
        <rect key={`${h.x}-${h.y}`} className="art-hit" x={h.x} y={h.y} width="16" height="16" opacity="0">
          <animate attributeName="opacity" values={h.values} keyTimes={h.keyTimes} dur="6s" repeatCount="indefinite" />
        </rect>
      ))}
      <g className="art-bracket">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="82 54; 82 54; 186 28; 186 28; 134 106; 134 106; 82 54"
          keyTimes="0;.28;.4;.58;.7;.92;1"
          calcMode="spline"
          keySplines="0 0 1 1; .7 0 .3 1; 0 0 1 1; .7 0 .3 1; 0 0 1 1; .7 0 .3 1"
          dur="6s"
          repeatCount="indefinite"
        />
        <path d="M-16 -8 V-16 H-8 M8 -16 H16 V-8 M16 8 V16 H8 M-8 16 H-16 V8" />
      </g>
    </svg>
  );
}

/** Evolve without blind spots — a living path that keeps moving forward */
export function ArtEvolve() {
  const path = "M14 116 H72 L102 86 H146 L176 56 H226";
  return (
    <svg className="pillar__art" viewBox="0 0 240 140" aria-hidden="true">
      <g className="art-grid">
        <path d="M0 30 H240 M0 60 H240 M0 90 H240 M0 120 H240" />
      </g>
      <path className="art-trace" d={path} />
      <path className="art-trace art-trace--lit" d={path} pathLength={100} strokeDasharray="18 82">
        <animate attributeName="stroke-dashoffset" values="100;0" dur="3.2s" repeatCount="indefinite" />
      </path>
      <rect className="art-term" x="6" y="110" width="12" height="12" />
      <rect className="art-term art-term--lit" x="222" y="50" width="12" height="12" />
      <circle className="art-node" cx="102" cy="86" r="3.5" />
      <circle className="art-node" cx="176" cy="56" r="3.5" />
    </svg>
  );
}

export const PILLAR_ART = [ArtUnderstand, ArtPreserve, ArtValidate, ArtEvolve];
