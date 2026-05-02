export type ToneKey = "primary" | "secondary" | "teal" | "warning" | "critical" | "muted";

type Rgb = {
  r: number;
  g: number;
  b: number;
};

const TONE_RGB: Record<Exclude<ToneKey, "muted">, Rgb> = {
  primary: { r: 0x01, g: 0x7f, b: 0xa4 },
  secondary: { r: 0x6c, g: 0xcd, b: 0xb8 },
  teal: { r: 0x10, g: 0x5f, b: 0x68 },
  warning: { r: 0xf1, g: 0xb4, b: 0x35 },
  critical: { r: 0xe0, g: 0x00, b: 0x4e },
};

function parseHexColor(value: unknown): Rgb | null {
  if (typeof value !== "string") return null;

  const raw = value.trim().replace(/^#/, "").toLowerCase();

  if (/^[\da-f]{3}$/.test(raw)) {
    return {
      r: Number.parseInt(raw[0] + raw[0], 16),
      g: Number.parseInt(raw[1] + raw[1], 16),
      b: Number.parseInt(raw[2] + raw[2], 16),
    };
  }

  if (/^[\da-f]{6}$/.test(raw)) {
    return {
      r: Number.parseInt(raw.slice(0, 2), 16),
      g: Number.parseInt(raw.slice(2, 4), 16),
      b: Number.parseInt(raw.slice(4, 6), 16),
    };
  }

  return null;
}

function colorDistance(a: Rgb, b: Rgb): number {
  const r = a.r - b.r;
  const g = a.g - b.g;
  const bDelta = a.b - b.b;
  return r * r + g * g + bDelta * bDelta;
}

export function getToneFromColor(value: unknown): ToneKey {
  const color = parseHexColor(value);
  if (!color) return "muted";

  let bestTone: Exclude<ToneKey, "muted"> = "primary";
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const [tone, rgb] of Object.entries(TONE_RGB) as Array<[Exclude<ToneKey, "muted">, Rgb]>) {
    const distance = colorDistance(color, rgb);
    if (distance < bestDistance) {
      bestTone = tone;
      bestDistance = distance;
    }
  }

  return bestTone;
}
