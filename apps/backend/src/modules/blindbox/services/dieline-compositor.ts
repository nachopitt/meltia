export interface DielineDimensions {
  width: number
  height: number
  depth: number
  glueTabWidth: number
  tuckFlapHeight: number
  dustFlapHeight: number
  margin: number
}

export interface FigureRosterItem {
  name: string
  isMystery?: boolean
  renderUrl?: string
  clothingColor?: string
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  cardParchment: string
}

export interface DielineCustomSpec {
  collectionTitle: string
  subtitle?: string
  backPanelMode: "roster_grid" | "dual_showcase"
  themeSlug?: string
  themeName?: string
  themeColors?: Partial<ThemeColors>
  aiIllustrationUrl?: string
  dedicationHeadline?: string
  dedicationBody?: string
  dedicationSignature?: string
  partnerName?: string
  partnerRenderUrl?: string
  rosterFigures?: FigureRosterItem[]
  mainCharacterName?: string
  mainCharacterRenderUrl?: string
  dimensions?: Partial<DielineDimensions>
}

export const DEFAULT_DIMENSIONS: DielineDimensions = {
  width: 80,
  height: 120,
  depth: 60,
  glueTabWidth: 15,
  tuckFlapHeight: 20,
  dustFlapHeight: 35,
  margin: 10
}

export const THEME_PALETTES: Record<string, ThemeColors> = {
  "celestial-night-gold": {
    primary: "#0b132b",
    secondary: "#1c2541",
    accent: "#d4af37",
    background: "#080d1a",
    text: "#f3e5ab",
    cardParchment: "#fbf5ed"
  },
  "pastel-dream-clouds": {
    primary: "#5c4d7d",
    secondary: "#9d8189",
    accent: "#ffdab9",
    background: "#3d315b",
    text: "#ffffff",
    cardParchment: "#fcf8f2"
  },
  "vintage-rose-garden": {
    primary: "#582f37",
    secondary: "#8b4f58",
    accent: "#c5a059",
    background: "#3e1f26",
    text: "#fbf5ed",
    cardParchment: "#f7eee1"
  },
  "cyber-neon-arcade": {
    primary: "#0d1117",
    secondary: "#161b22",
    accent: "#00f5d4",
    background: "#05070a",
    text: "#f72585",
    cardParchment: "#1a202c"
  },
  "terracotta-sunset": {
    primary: "#5c2c16",
    secondary: "#b85d38",
    accent: "#e7a977",
    background: "#421e0e",
    text: "#f4ede4",
    cardParchment: "#faefe3"
  },
  "enchanted-forest-emerald": {
    primary: "#07221b",
    secondary: "#0e3b2e",
    accent: "#e5b869",
    background: "#041410",
    text: "#e8f5e9",
    cardParchment: "#f2f7f4"
  },
  "monochrome-noir-minimal": {
    primary: "#121212",
    secondary: "#242424",
    accent: "#e0e0e0",
    background: "#0a0a0a",
    text: "#ffffff",
    cardParchment: "#f0f0f0"
  },
  "festive-confetti-party": {
    primary: "#4a0510",
    secondary: "#6a040f",
    accent: "#ffb703",
    background: "#32020a",
    text: "#fffbf0",
    cardParchment: "#fff9eb"
  }
}

export function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function wrapText(text: string, maxCharsPerLine: number = 30): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

export class DielineCompositor {
  private dims: DielineDimensions

  constructor(dims?: Partial<DielineDimensions>) {
    this.dims = { ...DEFAULT_DIMENSIONS, ...dims }
  }

  getDimensions(): DielineDimensions {
    return { ...this.dims }
  }

  calculateGeometry() {
    const { width: W, height: H, depth: D, glueTabWidth: G, tuckFlapHeight: T, dustFlapHeight: H_flap, margin: M } = this.dims

    const xLeft = M
    const xFront = xLeft + D
    const xRight = xFront + W
    const xBack = xRight + D
    const xGlue = xBack + W
    const xEnd = xGlue + G
    const totalWidth = xEnd + M

    const yTopTuck = M
    const yTopLid = yTopTuck + T
    const yBeltTop = yTopLid + D
    const yBeltBottom = yBeltTop + H
    const yBottomLid = yBeltBottom + D
    const yBottomTuck = yBottomLid + T
    const totalHeight = yBottomTuck + M

    const flapBevelDx = parseFloat((H_flap * Math.tan((15 * Math.PI) / 180)).toFixed(2))
    const glueBevelDy = parseFloat((G * Math.tan((15 * Math.PI) / 180)).toFixed(2))

    return {
      W,
      H,
      D,
      G,
      T,
      H_flap,
      M,
      xLeft,
      xFront,
      xRight,
      xBack,
      xGlue,
      xEnd,
      totalWidth,
      yTopTuck,
      yTopLid,
      yBeltTop,
      yBeltBottom,
      yBottomLid,
      yBottomTuck,
      totalHeight,
      flapBevelDx,
      glueBevelDy
    }
  }

  compose(spec: DielineCustomSpec): string {
    const geom = this.calculateGeometry()
    const theme = THEME_PALETTES[spec.themeSlug ?? "celestial-night-gold"] ?? THEME_PALETTES["celestial-night-gold"]
    const colors: ThemeColors = { ...theme, ...spec.themeColors }

    const defs = this.renderDefs(colors)
    const artwork = this.renderArtwork(spec, geom, colors)
    const creases = this.renderCreases(geom)
    const cuts = this.renderCuts(geom)
    const legend = this.renderLegend(geom)

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${geom.totalWidth} ${geom.totalHeight}" width="${geom.totalWidth}mm" height="${geom.totalHeight}mm">
  ${defs}
  <g id="packaging-artwork">
    ${artwork}
  </g>
  <g id="fold-creases">
    ${creases}
  </g>
  <g id="die-cuts">
    ${cuts}
  </g>
  <g id="print-legend">
    ${legend}
  </g>
</svg>`
  }

  private renderDefs(colors: ThemeColors): string {
    return `<defs>
    <linearGradient id="theme-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}" />
      <stop offset="60%" stop-color="${colors.secondary}" />
      <stop offset="100%" stop-color="${colors.background}" />
    </linearGradient>
    <linearGradient id="gold-banner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b8860b" />
      <stop offset="35%" stop-color="#f3e5ab" />
      <stop offset="65%" stop-color="${colors.accent}" />
      <stop offset="100%" stop-color="#b8860b" />
    </linearGradient>
    <radialGradient id="celestial-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${colors.primary}" stop-opacity="0" />
    </radialGradient>
    <pattern id="glue-hatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="4" stroke="#888888" stroke-width="0.8" />
    </pattern>
  </defs>`
  }

  private renderCreases(g: ReturnType<typeof this.calculateGeometry>): string {
    const lines = [
      // Top Tuck Flap hinge
      `<line x1="${g.xFront}" y1="${g.yTopLid}" x2="${g.xRight}" y2="${g.yTopLid}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      // Belt Top hinges: Left dust flap, Top lid, Right dust flap
      `<line x1="${g.xLeft}" y1="${g.yBeltTop}" x2="${g.xFront}" y2="${g.yBeltTop}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      `<line x1="${g.xFront}" y1="${g.yBeltTop}" x2="${g.xRight}" y2="${g.yBeltTop}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      `<line x1="${g.xRight}" y1="${g.yBeltTop}" x2="${g.xBack}" y2="${g.yBeltTop}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      // Belt Bottom hinges: Left dust flap, Bottom lid, Right dust flap
      `<line x1="${g.xLeft}" y1="${g.yBeltBottom}" x2="${g.xFront}" y2="${g.yBeltBottom}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      `<line x1="${g.xFront}" y1="${g.yBeltBottom}" x2="${g.xRight}" y2="${g.yBeltBottom}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      `<line x1="${g.xRight}" y1="${g.yBeltBottom}" x2="${g.xBack}" y2="${g.yBeltBottom}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      // Bottom Tuck Tongue hinge
      `<line x1="${g.xFront}" y1="${g.yBottomLid}" x2="${g.xRight}" y2="${g.yBottomLid}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      // Vertical hinges between main panels
      `<line x1="${g.xFront}" y1="${g.yBeltTop}" x2="${g.xFront}" y2="${g.yBeltBottom}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      `<line x1="${g.xRight}" y1="${g.yBeltTop}" x2="${g.xRight}" y2="${g.yBeltBottom}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      `<line x1="${g.xBack}" y1="${g.yBeltTop}" x2="${g.xBack}" y2="${g.yBeltBottom}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`,
      `<line x1="${g.xGlue}" y1="${g.yBeltTop}" x2="${g.xGlue}" y2="${g.yBeltBottom}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.5" fill="none" />`
    ]
    return lines.join("\n    ")
  }

  private renderCuts(g: ReturnType<typeof this.calculateGeometry>): string {
    const cuts = [
      // Top Tuck Flap outline (rounded corners)
      `<path d="M ${g.xFront} ${g.yTopLid} L ${g.xFront} ${g.yTopTuck + 8} A 8 8 0 0 1 ${g.xFront + 8} ${g.yTopTuck} L ${g.xRight - 8} ${g.yTopTuck} A 8 8 0 0 1 ${g.xRight} ${g.yTopTuck + 8} L ${g.xRight} ${g.yTopLid}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Top Lid lateral cut slits
      `<line x1="${g.xFront}" y1="${g.yTopLid}" x2="${g.xFront}" y2="${g.yBeltTop}" stroke="red" stroke-width="0.5" fill="none" />`,
      `<line x1="${g.xRight}" y1="${g.yTopLid}" x2="${g.xRight}" y2="${g.yBeltTop}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Top Left Dust Flap (15° bevel)
      `<path d="M ${g.xLeft} ${g.yBeltTop} L ${g.xLeft + g.flapBevelDx} ${g.yBeltTop - g.H_flap} L ${g.xFront - g.flapBevelDx} ${g.yBeltTop - g.H_flap} L ${g.xFront} ${g.yBeltTop}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Top Right Dust Flap (15° bevel)
      `<path d="M ${g.xRight} ${g.yBeltTop} L ${g.xRight + g.flapBevelDx} ${g.yBeltTop - g.H_flap} L ${g.xBack - g.flapBevelDx} ${g.yBeltTop - g.H_flap} L ${g.xBack} ${g.yBeltTop}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Back Panel Top edge (cut)
      `<line x1="${g.xBack}" y1="${g.yBeltTop}" x2="${g.xGlue}" y2="${g.yBeltTop}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Glue Tab (15° bevel at top and bottom)
      `<path d="M ${g.xGlue} ${g.yBeltTop} L ${g.xEnd} ${g.yBeltTop + g.glueBevelDy} L ${g.xEnd} ${g.yBeltBottom - g.glueBevelDy} L ${g.xGlue} ${g.yBeltBottom}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Back Panel Bottom edge (cut)
      `<line x1="${g.xBack}" y1="${g.yBeltBottom}" x2="${g.xGlue}" y2="${g.yBeltBottom}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Bottom Right Dust Flap (15° bevel)
      `<path d="M ${g.xRight} ${g.yBeltBottom} L ${g.xRight + g.flapBevelDx} ${g.yBeltBottom + g.H_flap} L ${g.xBack - g.flapBevelDx} ${g.yBeltBottom + g.H_flap} L ${g.xBack} ${g.yBeltBottom}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Bottom Lid lateral cut slits
      `<line x1="${g.xFront}" y1="${g.yBeltBottom}" x2="${g.xFront}" y2="${g.yBottomLid}" stroke="red" stroke-width="0.5" fill="none" />`,
      `<line x1="${g.xRight}" y1="${g.yBeltBottom}" x2="${g.xRight}" y2="${g.yBottomLid}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Bottom Tuck Tongue with 15° friction ears & rounded tip
      `<path d="M ${g.xFront} ${g.yBottomLid} L ${g.xFront - 1} ${g.yBottomLid + 5} L ${g.xFront + 1} ${g.yBottomLid + 6} L ${g.xFront + 3} ${g.yBottomTuck - 6} A 6 6 0 0 0 ${g.xFront + 9} ${g.yBottomTuck} L ${g.xRight - 9} ${g.yBottomTuck} A 6 6 0 0 0 ${g.xRight - 3} ${g.yBottomTuck - 6} L ${g.xRight - 1} ${g.yBottomLid + 6} L ${g.xRight + 1} ${g.yBottomLid + 5} L ${g.xRight} ${g.yBottomLid}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Locking tongue cut slit
      `<line x1="${g.xFront + 22}" y1="${g.yBottomLid}" x2="${g.xRight - 22}" y2="${g.yBottomLid}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Bottom Left Dust Flap (15° bevel)
      `<path d="M ${g.xLeft} ${g.yBeltBottom} L ${g.xLeft + g.flapBevelDx} ${g.yBeltBottom + g.H_flap} L ${g.xFront - g.flapBevelDx} ${g.yBeltBottom + g.H_flap} L ${g.xFront} ${g.yBeltBottom}" stroke="red" stroke-width="0.5" fill="none" />`,
      // Left outer edge
      `<line x1="${g.xLeft}" y1="${g.yBeltTop}" x2="${g.xLeft}" y2="${g.yBeltBottom}" stroke="red" stroke-width="0.5" fill="none" />`
    ]
    return cuts.join("\n    ")
  }

  private renderArtwork(spec: DielineCustomSpec, g: ReturnType<typeof this.calculateGeometry>, colors: ThemeColors): string {
    const isDual = spec.backPanelMode === "dual_showcase"
    const title = escapeXml(spec.collectionTitle || "MELTIA SERIES")
    const subtitle = escapeXml(spec.subtitle || "COLLECTIBLE BLIND BOX")

    // Flaps background bleed
    const flapsBg = `
    <!-- Flap and Tab bleeds -->
    <path d="M ${g.xLeft} ${g.yBeltTop} L ${g.xLeft + g.flapBevelDx} ${g.yBeltTop - g.H_flap} L ${g.xFront - g.flapBevelDx} ${g.yBeltTop - g.H_flap} L ${g.xFront} ${g.yBeltTop} Z" fill="${colors.primary}" />
    <path d="M ${g.xRight} ${g.yBeltTop} L ${g.xRight + g.flapBevelDx} ${g.yBeltTop - g.H_flap} L ${g.xBack - g.flapBevelDx} ${g.yBeltTop - g.H_flap} L ${g.xBack} ${g.yBeltTop} Z" fill="${colors.primary}" />
    <path d="M ${g.xLeft} ${g.yBeltBottom} L ${g.xLeft + g.flapBevelDx} ${g.yBeltBottom + g.H_flap} L ${g.xFront - g.flapBevelDx} ${g.yBeltBottom + g.H_flap} L ${g.xFront} ${g.yBeltBottom} Z" fill="${colors.primary}" />
    <path d="M ${g.xRight} ${g.yBeltBottom} L ${g.xRight + g.flapBevelDx} ${g.yBeltBottom + g.H_flap} L ${g.xBack - g.flapBevelDx} ${g.yBeltBottom + g.H_flap} L ${g.xBack} ${g.yBeltBottom} Z" fill="${colors.primary}" />
    <rect x="${g.xFront}" y="${g.yTopTuck}" width="${g.W}" height="${g.T}" fill="${colors.primary}" rx="8" />
    <rect x="${g.xFront}" y="${g.yBottomLid}" width="${g.W}" height="${g.T}" fill="${colors.primary}" rx="6" />
    <!-- Glue tab hatch pattern -->
    <path d="M ${g.xGlue} ${g.yBeltTop} L ${g.xEnd} ${g.yBeltTop + g.glueBevelDy} L ${g.xEnd} ${g.yBeltBottom - g.glueBevelDy} L ${g.xGlue} ${g.yBeltBottom} Z" fill="url(#glue-hatch)" />
    <text x="${g.xGlue + 7.5}" y="${g.yBeltTop + 60}" font-family="sans-serif" font-size="2.5" fill="#666666" text-anchor="middle" transform="rotate(90 ${g.xGlue + 7.5} ${g.yBeltTop + 60})">GLUE TAB / PESTAÑA</text>
    `

    // Panel 1: Left Side Panel
    const leftPanel = this.renderLeftPanel(spec, g, colors, isDual)

    // Panel 2: Front Panel
    const frontPanel = this.renderFrontPanel(spec, g, colors, title, subtitle)

    // Panel 3: Right Side Panel
    const rightPanel = this.renderRightPanel(spec, g, colors, isDual)

    // Panel 4: Back Panel
    const backPanel = this.renderBackPanel(spec, g, colors, isDual, title, subtitle)

    // Panel 5: Top Lid
    const topLid = this.renderTopLid(g, colors, title, subtitle)

    // Panel 6: Bottom Lid
    const bottomLid = this.renderBottomLid(g, colors)

    return `${flapsBg}
    ${leftPanel}
    ${frontPanel}
    ${rightPanel}
    ${backPanel}
    ${topLid}
    ${bottomLid}`
  }

  private renderFrontPanel(
    spec: DielineCustomSpec,
    g: ReturnType<typeof this.calculateGeometry>,
    colors: ThemeColors,
    title: string,
    subtitle: string
  ): string {
    const cx = g.xFront + g.W / 2
    const cy = g.yBeltTop + g.H / 2

    return `<!-- FRONT PANEL -->
    <rect x="${g.xFront}" y="${g.yBeltTop}" width="${g.W}" height="${g.H}" fill="url(#theme-bg)" />
    ${this.renderOrnateBorder(g.xFront + 3, g.yBeltTop + 3, g.W - 6, g.H - 6, colors.accent)}

    <!-- Ribbon Banner Title -->
    <path d="M ${cx - 32} ${g.yBeltTop + 14} L ${cx + 32} ${g.yBeltTop + 14} L ${cx + 28} ${g.yBeltTop + 24} L ${cx - 28} ${g.yBeltTop + 24} Z" fill="url(#gold-banner)" />
    <path d="M ${cx - 32} ${g.yBeltTop + 14} L ${cx - 36} ${g.yBeltTop + 19} L ${cx - 32} ${g.yBeltTop + 24} Z" fill="#8c6d1f" />
    <path d="M ${cx + 32} ${g.yBeltTop + 14} L ${cx + 36} ${g.yBeltTop + 19} L ${cx + 32} ${g.yBeltTop + 24} Z" fill="#8c6d1f" />
    <text x="${cx}" y="${g.yBeltTop + 21}" font-family="Georgia, 'Times New Roman', serif" font-size="6.2" font-weight="bold" fill="#1b120c" text-anchor="middle" letter-spacing="0.5">${title}</text>
    <rect x="${cx - 22}" y="${g.yBeltTop + 26}" width="44" height="4.5" fill="#10192e" rx="1.5" />
    <text x="${cx}" y="${g.yBeltTop + 29.2}" font-family="sans-serif" font-size="2.2" font-weight="bold" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.8">${subtitle}</text>

    <!-- Character Presentation -->
    <circle cx="${cx}" cy="${cy + 5}" r="22" fill="url(#celestial-glow)" />
    ${
      spec.mainCharacterRenderUrl
        ? `<image href="${escapeXml(spec.mainCharacterRenderUrl)}" x="${cx - 18}" y="${cy - 16}" width="36" height="42" preserveAspectRatio="xMidYMid meet" />`
        : this.renderChibiPlaceholder(cx, cy + 2, spec.mainCharacterName || "Main Figure", colors)
    }

    <!-- Brand Logo -->
    <text x="${cx}" y="${g.yBeltBottom - 11}" font-family="'Cinzel', Georgia, serif" font-size="5" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${g.yBeltBottom - 7.5}" font-family="sans-serif" font-size="1.8" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.8">INSTANTES ETERNOS</text>`
  }

  private renderTopLid(
    g: ReturnType<typeof this.calculateGeometry>,
    colors: ThemeColors,
    title: string,
    subtitle: string
  ): string {
    const cx = g.xFront + g.W / 2
    const cy = g.yTopLid + g.D / 2

    return `<!-- TOP LID -->
    <rect x="${g.xFront}" y="${g.yTopLid}" width="${g.W}" height="${g.D}" fill="url(#theme-bg)" />
    ${this.renderOrnateBorder(g.xFront + 3, g.yTopLid + 3, g.W - 6, g.D - 6, colors.accent)}
    <!-- Ribbon Banner on Lid -->
    <path d="M ${cx - 26} ${cy - 10} L ${cx + 26} ${cy - 10} L ${cx + 22} ${cy - 1} L ${cx - 22} ${cy - 1} Z" fill="url(#gold-banner)" />
    <text x="${cx}" y="${cy - 3.8}" font-family="Georgia, serif" font-size="5.2" font-weight="bold" fill="#1b120c" text-anchor="middle">${title}</text>
    <rect x="${cx - 19}" y="${cy + 2}" width="38" height="4.2" fill="#10192e" rx="1" />
    <text x="${cx}" y="${cy + 5.1}" font-family="sans-serif" font-size="2" font-weight="bold" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.6">${subtitle}</text>
    <circle cx="${cx - 24}" cy="${cy + 14}" r="1" fill="${colors.accent}" />
    <circle cx="${cx + 24}" cy="${cy + 14}" r="1" fill="${colors.accent}" />
    <text x="${cx}" y="${cy + 15.5}" font-family="'Cinzel', Georgia, serif" font-size="3" fill="${colors.text}" text-anchor="middle">Meltia</text>`
  }

  private renderBottomLid(g: ReturnType<typeof this.calculateGeometry>, colors: ThemeColors): string {
    const cx = g.xFront + g.W / 2
    const cy = g.yBeltBottom + g.D / 2

    return `<!-- BOTTOM LID -->
    <rect x="${g.xFront}" y="${g.yBeltBottom}" width="${g.W}" height="${g.D}" fill="url(#theme-bg)" />
    ${this.renderOrnateBorder(g.xFront + 3, g.yBeltBottom + 3, g.W - 6, g.D - 6, colors.accent)}
    <text x="${cx}" y="${cy + 1}" font-family="'Cinzel', Georgia, serif" font-size="7" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${cy + 6.5}" font-family="sans-serif" font-size="2.4" fill="${colors.accent}" text-anchor="middle" letter-spacing="1">INSTANTES ETERNOS</text>`
  }

  private renderLeftPanel(
    spec: DielineCustomSpec,
    g: ReturnType<typeof this.calculateGeometry>,
    colors: ThemeColors,
    isDual: boolean
  ): string {
    const cx = g.xLeft + g.D / 2
    const cy = g.yBeltTop + g.H / 2

    if (isDual) {
      // Lateral AI couple hugging illustration
      return `<!-- LEFT PANEL (DUAL SHOWCASE: AI ILLUSTRATION) -->
    <rect x="${g.xLeft}" y="${g.yBeltTop}" width="${g.D}" height="${g.H}" fill="url(#theme-bg)" />
    ${this.renderOrnateBorder(g.xLeft + 3, g.yBeltTop + 3, g.D - 6, g.H - 6, colors.accent)}

    <!-- Mystery Gift Box Badge -->
    <circle cx="${cx}" cy="${g.yBeltTop + 14}" r="5.5" fill="#1b2845" stroke="${colors.accent}" stroke-width="0.6" />
    <text x="${cx}" y="${g.yBeltTop + 16}" font-family="Georgia, serif" font-size="5" font-weight="bold" fill="${colors.accent}" text-anchor="middle">?</text>

    <!-- Couple Hugging Illustration -->
    <circle cx="${cx}" cy="${cy + 3}" r="19" fill="url(#celestial-glow)" />
    ${
      spec.aiIllustrationUrl
        ? `<image href="${escapeXml(spec.aiIllustrationUrl)}" x="${cx - 20}" y="${cy - 19}" width="40" height="42" preserveAspectRatio="xMidYMid meet" />`
        : this.renderCouplePlaceholder(cx, cy + 2, colors)
    }

    <!-- Meltia Badge -->
    <text x="${cx}" y="${g.yBeltBottom - 11}" font-family="'Cinzel', Georgia, serif" font-size="4" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${g.yBeltBottom - 8}" font-family="sans-serif" font-size="1.5" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.6">INSTANTES ETERNOS</text>`
    }

    // Roster Grid: Alternative side character
    return `<!-- LEFT PANEL (ROSTER: SIDE CHARACTER) -->
    <rect x="${g.xLeft}" y="${g.yBeltTop}" width="${g.D}" height="${g.H}" fill="url(#theme-bg)" />
    ${this.renderOrnateBorder(g.xLeft + 3, g.yBeltTop + 3, g.D - 6, g.H - 6, colors.accent)}
    <text x="${cx}" y="${g.yBeltTop + 16}" font-family="sans-serif" font-size="2.4" font-weight="bold" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.5">COLLECTIBLE</text>
    ${this.renderChibiPlaceholder(cx, cy + 4, "Chibi Martial", colors)}
    <text x="${cx}" y="${g.yBeltBottom - 11}" font-family="'Cinzel', Georgia, serif" font-size="4" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${g.yBeltBottom - 8}" font-family="sans-serif" font-size="1.5" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.6">INSTANTES ETERNOS</text>`
  }

  private renderRightPanel(
    spec: DielineCustomSpec,
    g: ReturnType<typeof this.calculateGeometry>,
    colors: ThemeColors,
    isDual: boolean
  ): string {
    const cx = g.xRight + g.D / 2
    const cy = g.yBeltTop + g.H / 2

    if (isDual) {
      // Dedication Letter
      const headline = escapeXml(spec.dedicationHeadline || "Felices 28 mi amor")
      const body =
        spec.dedicationBody ||
        "Hoy celebro la maravillosa persona que eres y agradezco a la vida por permitirme coincidir y compartir contigo parte de este hermoso camino. Deseo que esta nueva vuelta al sol llegue llena de alegrías, aventuras y momentos que hagan sonreír a tu corazón."
      const signature = escapeXml(spec.dedicationSignature || "Te amo mi amor")
      const bodyLines = wrapText(body, 28)

      return `<!-- RIGHT PANEL (DUAL SHOWCASE: DEDICATION LETTER) -->
    <rect x="${g.xRight}" y="${g.yBeltTop}" width="${g.D}" height="${g.H}" fill="url(#theme-bg)" />
    ${this.renderOrnateBorder(g.xRight + 3, g.yBeltTop + 3, g.D - 6, g.H - 6, colors.accent)}

    <!-- Mystery Gift Badge -->
    <circle cx="${cx}" cy="${g.yBeltTop + 14}" r="5.5" fill="#1b2845" stroke="${colors.accent}" stroke-width="0.6" />
    <text x="${cx}" y="${g.yBeltTop + 16}" font-family="Georgia, serif" font-size="5" font-weight="bold" fill="${colors.accent}" text-anchor="middle">?</text>

    <!-- Dedication Headline -->
    <text x="${cx}" y="${g.yBeltTop + 27}" font-family="'Playfair Display', Georgia, cursive, serif" font-size="4.2" font-style="italic" font-weight="bold" fill="${colors.text}" text-anchor="middle">${headline} <tspan fill="#e63946">♥</tspan></text>

    <!-- Dedication Body -->
    <g transform="translate(0, 0)">
      ${bodyLines
        .slice(0, 11)
        .map(
          (line, i) =>
            `<text x="${cx}" y="${g.yBeltTop + 34 + i * 3.4}" font-family="Georgia, serif" font-size="2.1" font-style="italic" fill="#e2e8f0" text-anchor="middle">${escapeXml(line)}</text>`
        )
        .join("\n      ")}
    </g>

    <!-- Signature Ribbon -->
    <path d="M ${cx - 18} ${g.yBeltBottom - 26} L ${cx + 18} ${g.yBeltBottom - 26} L ${cx + 15} ${g.yBeltBottom - 20} L ${cx - 15} ${g.yBeltBottom - 20} Z" fill="url(#gold-banner)" />
    <text x="${cx}" y="${g.yBeltBottom - 22.3}" font-family="'Playfair Display', Georgia, serif" font-size="2.6" font-weight="bold" fill="#1b120c" text-anchor="middle">${signature}</text>
    <text x="${cx}" y="${g.yBeltBottom - 16.5}" font-size="3" fill="#e63946" text-anchor="middle">♥</text>

    <!-- Brand Logo -->
    <text x="${cx}" y="${g.yBeltBottom - 11}" font-family="'Cinzel', Georgia, serif" font-size="4" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${g.yBeltBottom - 8}" font-family="sans-serif" font-size="1.5" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.6">INSTANTES ETERNOS</text>`
    }

    // Roster: Alternative side character
    return `<!-- RIGHT PANEL (ROSTER: SIDE CHARACTER) -->
    <rect x="${g.xRight}" y="${g.yBeltTop}" width="${g.D}" height="${g.H}" fill="url(#theme-bg)" />
    ${this.renderOrnateBorder(g.xRight + 3, g.yBeltTop + 3, g.D - 6, g.H - 6, colors.accent)}
    <text x="${cx}" y="${g.yBeltTop + 16}" font-family="sans-serif" font-size="2.4" font-weight="bold" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.5">EXCLUSIVE</text>
    ${this.renderChibiPlaceholder(cx, cy + 4, "Chibi Suit", colors)}
    <text x="${cx}" y="${g.yBeltBottom - 11}" font-family="'Cinzel', Georgia, serif" font-size="4" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${g.yBeltBottom - 8}" font-family="sans-serif" font-size="1.5" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.6">INSTANTES ETERNOS</text>`
  }

  private renderBackPanel(
    spec: DielineCustomSpec,
    g: ReturnType<typeof this.calculateGeometry>,
    colors: ThemeColors,
    isDual: boolean,
    title: string,
    subtitle: string
  ): string {
    const cx = g.xBack + g.W / 2
    const cy = g.yBeltTop + g.H / 2

    if (isDual) {
      // Partner portrait showcase
      const partnerName = escapeXml(spec.partnerName || "Partner Portrait")
      return `<!-- BACK PANEL (DUAL SHOWCASE: PARTNER PORTRAIT) -->
    <rect x="${g.xBack}" y="${g.yBeltTop}" width="${g.W}" height="${g.H}" fill="url(#theme-bg)" />
    ${this.renderOrnateBorder(g.xBack + 3, g.yBeltTop + 3, g.W - 6, g.H - 6, colors.accent)}

    <!-- Ribbon Banner Title -->
    <path d="M ${cx - 30} ${g.yBeltTop + 14} L ${cx + 30} ${g.yBeltTop + 14} L ${cx + 26} ${g.yBeltTop + 24} L ${cx - 26} ${g.yBeltTop + 24} Z" fill="url(#gold-banner)" />
    <text x="${cx}" y="${g.yBeltTop + 21}" font-family="Georgia, serif" font-size="6" font-weight="bold" fill="#1b120c" text-anchor="middle">${title}</text>
    <rect x="${cx - 20}" y="${g.yBeltTop + 26}" width="40" height="4.2" fill="#10192e" rx="1.5" />
    <text x="${cx}" y="${g.yBeltTop + 29}" font-family="sans-serif" font-size="2.1" font-weight="bold" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.6">${subtitle}</text>

    <!-- Partner Presentation -->
    <circle cx="${cx}" cy="${cy + 5}" r="22" fill="url(#celestial-glow)" />
    ${
      spec.partnerRenderUrl
        ? `<image href="${escapeXml(spec.partnerRenderUrl)}" x="${cx - 18}" y="${cy - 16}" width="36" height="42" preserveAspectRatio="xMidYMid meet" />`
        : this.renderChibiPlaceholder(cx, cy + 2, partnerName, colors, true)
    }

    <!-- Brand Logo -->
    <text x="${cx}" y="${g.yBeltBottom - 11}" font-family="'Cinzel', Georgia, serif" font-size="5" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${g.yBeltBottom - 7.5}" font-family="sans-serif" font-size="1.8" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.8">INSTANTES ETERNOS</text>`
    }

    // 6-figure series roster grid (matching reference IMG-20260908-WA0012)
    const figures = spec.rosterFigures && spec.rosterFigures.length > 0
      ? spec.rosterFigures
      : [
          { name: "Lupe Shot", isMystery: false },
          { name: "Elias", isMystery: false },
          { name: "Lic. Elias", isMystery: false },
          { name: "Riatilla", isMystery: false },
          { name: "Chacos", isMystery: false },
          { name: "Band", isMystery: true }
        ]

    const colWidth = (g.W - 12) / 3
    const rowHeight = 36
    const startX = g.xBack + 6
    const startY = g.yBeltTop + 25

    const rosterCards = figures.slice(0, 6).map((fig, idx) => {
      const col = idx % 3
      const row = Math.floor(idx / 3)
      const fx = startX + col * colWidth + colWidth / 2
      const fy = startY + row * rowHeight

      return `<!-- Roster Figure ${idx + 1}: ${escapeXml(fig.name)} -->
      <g transform="translate(${fx}, ${fy})">
        ${
          fig.isMystery
            ? `<!-- Mystery Silhouette -->
          <circle cx="0" cy="11" r="5" fill="#111827" stroke="${colors.accent}" stroke-width="0.5" />
          <path d="M -7 28 C -7 18 7 18 7 28 Z" fill="#111827" />
          <text x="0" y="13" font-family="Georgia, serif" font-size="4.5" font-weight="bold" fill="${colors.accent}" text-anchor="middle">?</text>`
            : `<!-- Mini Chibi Avatar -->
          <circle cx="0" cy="10" r="4.8" fill="#fcd5b5" />
          <!-- Hair curls -->
          <path d="M -5 10 C -5 4 5 4 5 10 C 6 8 6 12 4 13 C 2 7 -2 7 -4 13 Z" fill="#4a2e18" />
          <!-- Eyes -->
          <circle cx="-1.6" cy="10.5" r="0.7" fill="#111827" />
          <circle cx="1.6" cy="10.5" r="0.7" fill="#111827" />
          <!-- Body -->
          <rect x="-3" y="15" width="6" height="8" rx="1.5" fill="${row === 0 ? "#ffffff" : "#2b3a4a"}" />
          <!-- Legs -->
          <rect x="-2.5" y="23" width="2" height="5" fill="#111827" />
          <rect x="0.5" y="23" width="2" height="5" fill="#111827" />`
        }
        <text x="0" y="32" font-family="'Cinzel', Georgia, serif" font-size="2.4" font-weight="bold" fill="${colors.accent}" text-anchor="middle">${escapeXml(fig.name)}</text>
      </g>`
    })

    return `<!-- BACK PANEL (ROSTER GRID) -->
    <rect x="${g.xBack}" y="${g.yBeltTop}" width="${g.W}" height="${g.H}" fill="url(#theme-bg)" />
    ${this.renderOrnateBorder(g.xBack + 3, g.yBeltTop + 3, g.W - 6, g.H - 6, colors.accent)}

    <!-- Roster Header -->
    <text x="${cx}" y="${g.yBeltTop + 14}" font-family="Georgia, serif" font-size="4.5" font-weight="bold" fill="${colors.accent}" text-anchor="middle" letter-spacing="1">SERIES ROSTER</text>
    <line x1="${cx - 24}" y1="${g.yBeltTop + 18}" x2="${cx + 24}" y2="${g.yBeltTop + 18}" stroke="${colors.accent}" stroke-width="0.5" />

    <!-- 6 Figures Grid -->
    ${rosterCards.join("\n    ")}

    <!-- Brand Logo -->
    <text x="${cx}" y="${g.yBeltBottom - 11}" font-family="'Cinzel', Georgia, serif" font-size="5" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${g.yBeltBottom - 7.5}" font-family="sans-serif" font-size="1.8" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.8">INSTANTES ETERNOS</text>`
  }

  private renderOrnateBorder(x: number, y: number, w: number, h: number, gold: string): string {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${gold}" stroke-width="0.5" />
    <rect x="${x + 1.2}" y="${y + 1.2}" width="${w - 2.4}" height="${h - 2.4}" fill="none" stroke="${gold}" stroke-width="0.3" stroke-opacity="0.6" />
    <!-- Corner flourishes -->
    <circle cx="${x + 2}" cy="${y + 2}" r="0.8" fill="${gold}" />
    <circle cx="${x + w - 2}" cy="${y + 2}" r="0.8" fill="${gold}" />
    <circle cx="${x + 2}" cy="${y + h - 2}" r="0.8" fill="${gold}" />
    <circle cx="${x + w - 2}" cy="${y + h - 2}" r="0.8" fill="${gold}" />`
  }

  private renderChibiPlaceholder(cx: number, cy: number, name: string, colors: ThemeColors, isFemale: boolean = false): string {
    return `<g transform="translate(${cx}, ${cy})">
      <!-- Head -->
      <circle cx="0" cy="-6" r="9" fill="#fcd5b5" stroke="#e0aa80" stroke-width="0.4" />
      <!-- Hair -->
      ${
        isFemale
          ? `<path d="M -9 -7 C -9 -17 9 -17 9 -7 C 11 -2 10 7 7 11 C 6 4 6 -2 3 -5 C -3 -5 -4 2 -7 11 C -10 6 -11 -2 -9 -7 Z" fill="#6d391e" />`
          : `<path d="M -9 -7 C -9 -17 9 -17 9 -7 C 10 -4 9 0 6 0 C 4 -6 -4 -6 -6 0 C -9 0 -10 -4 -9 -7 Z" fill="#3c2415" />`
      }
      <!-- Eyes & Smile -->
      <circle cx="-3" cy="-5" r="1.3" fill="#111827" />
      <circle cx="3" cy="-5" r="1.3" fill="#111827" />
      <circle cx="-2.6" cy="-5.4" r="0.4" fill="#ffffff" />
      <circle cx="3.4" cy="-5.4" r="0.4" fill="#ffffff" />
      <path d="M -1.8 -2 Q 0 -0.8 1.8 -2" stroke="#b05244" stroke-width="0.5" fill="none" stroke-linecap="round" />
      <!-- Cheeks -->
      <circle cx="-5" cy="-3.5" r="1.2" fill="#ffb4a2" opacity="0.6" />
      <circle cx="5" cy="-3.5" r="1.2" fill="#ffb4a2" opacity="0.6" />
      <!-- Body / Outfit -->
      ${
        isFemale
          ? `<path d="M -4 3 L -7 17 L 7 17 L 4 3 Z" fill="#a3b18a" />`
          : `<rect x="-5" y="3" width="10" height="11" rx="2" fill="#1e293b" />
             <polygon points="0,3 -2,7 2,7" fill="#ffffff" />
             <polygon points="0,5 -0.8,9 0.8,9" fill="#e63946" />`
      }
      <!-- Legs -->
      <rect x="-3.5" y="14" width="2.5" height="7" rx="1" fill="#0f172a" />
      <rect x="1" y="14" width="2.5" height="7" rx="1" fill="#0f172a" />
      <!-- Feet -->
      <ellipse cx="-2.2" cy="21" rx="2" ry="1" fill="#111827" />
      <ellipse cx="2.2" cy="21" rx="2" ry="1" fill="#111827" />
      <!-- Character Label -->
      <text x="0" y="27" font-family="'Cinzel', Georgia, serif" font-size="2.6" font-weight="bold" fill="${colors.accent}" text-anchor="middle">${escapeXml(name)}</text>
    </g>`
  }

  private renderCouplePlaceholder(cx: number, cy: number, colors: ThemeColors): string {
    return `<g transform="translate(${cx}, ${cy})">
      <!-- Man Chibi -->
      <g transform="translate(-4, -1)">
        <circle cx="0" cy="-6" r="6.5" fill="#fcd5b5" stroke="#e0aa80" stroke-width="0.3" />
        <path d="M -6.5 -7 C -6.5 -14 6.5 -14 6.5 -7 C 7 -4 6 0 4 -1 C 2 -5 -2 -5 -4 -1 C -6 0 -7 -4 -6.5 -7 Z" fill="#2d1e18" />
        <circle cx="-2" cy="-5" r="0.9" fill="#111827" />
        <circle cx="2" cy="-5" r="0.9" fill="#111827" />
        <rect x="-4" y="0.5" width="8" height="12" rx="1.5" fill="#1e293b" />
        <rect x="-3" y="12" width="2" height="6" fill="#111827" />
        <rect x="1" y="12" width="2" height="6" fill="#111827" />
      </g>
      <!-- Woman Chibi Hugging -->
      <g transform="translate(4, 1)">
        <circle cx="0" cy="-6" r="6.5" fill="#fcd5b5" stroke="#e0aa80" stroke-width="0.3" />
        <path d="M -6.5 -7 C -6.5 -14 6.5 -14 6.5 -7 C 8 -2 7 6 5 9 C 4 3 4 -2 2 -4 C -2 -4 -3 1 -5 9 C -7 5 -8 -2 -6.5 -7 Z" fill="#78350f" />
        <circle cx="-2" cy="-5" r="0.9" fill="#111827" />
        <circle cx="2" cy="-5" r="0.9" fill="#111827" />
        <!-- Green dress matching reference couple image -->
        <path d="M -3 0.5 L -6 16 L 6 16 L 3 0.5 Z" fill="#84cc16" />
        <!-- Glasses matching reference -->
        <circle cx="-2" cy="-5" r="1.6" fill="none" stroke="#b45309" stroke-width="0.4" />
        <circle cx="2" cy="-5" r="1.6" fill="none" stroke="#b45309" stroke-width="0.4" />
        <line x1="-0.4" y1="-5" x2="0.4" y2="-5" stroke="#b45309" stroke-width="0.4" />
      </g>
      <!-- Hugging Arms -->
      <path d="M -2 4 Q 3 6 4 4" stroke="#fcd5b5" stroke-width="1.2" fill="none" stroke-linecap="round" />
      <!-- Heart above couple -->
      <text x="0" y="-14" font-size="5" fill="#e63946" text-anchor="middle">♥</text>
    </g>`
  }

  private renderLegend(g: ReturnType<typeof this.calculateGeometry>): string {
    const rx1 = 4
    const rx2 = g.totalWidth - 4
    const ry1 = 4
    const ry2 = g.totalHeight - 4

    return `<!-- Registration Marks -->
    <path d="M ${rx1} ${ry1 - 2} L ${rx1} ${ry1 + 2} M ${rx1 - 2} ${ry1} L ${rx1 + 2} ${ry1}" stroke="#888888" stroke-width="0.4" />
    <path d="M ${rx2} ${ry1 - 2} L ${rx2} ${ry1 + 2} M ${rx2 - 2} ${ry1} L ${rx2 + 2} ${ry1}" stroke="#888888" stroke-width="0.4" />
    <path d="M ${rx1} ${ry2 - 2} L ${rx1} ${ry2 + 2} M ${rx1 - 2} ${ry2} L ${rx1 + 2} ${ry2}" stroke="#888888" stroke-width="0.4" />
    <path d="M ${rx2} ${ry2 - 2} L ${rx2} ${ry2 + 2} M ${rx2 - 2} ${ry2} L ${rx2 + 2} ${ry2}" stroke="#888888" stroke-width="0.4" />

    <!-- Color Legend Key -->
    <line x1="${g.M + 4}" y1="${g.totalHeight - 3}" x2="${g.M + 12}" y2="${g.totalHeight - 3}" stroke="red" stroke-width="0.8" />
    <text x="${g.M + 14}" y="${g.totalHeight - 2.2}" font-family="sans-serif" font-size="2.2" fill="#333333">Cut Line (Corte)</text>
    <line x1="${g.M + 44}" y1="${g.totalHeight - 3}" x2="${g.M + 52}" y2="${g.totalHeight - 3}" stroke="blue" stroke-dasharray="3,2" stroke-width="0.8" />
    <text x="${g.M + 54}" y="${g.totalHeight - 2.2}" font-family="sans-serif" font-size="2.2" fill="#333333">Fold Crease (Pliegue)</text>
    <text x="${g.totalWidth - g.M - 4}" y="${g.totalHeight - 2.2}" font-family="sans-serif" font-size="2" fill="#666666" text-anchor="end">Width: ${g.W}mm | Height: ${g.H}mm | Depth: ${g.D}mm | 300 DPI</text>`
  }
}

export default DielineCompositor
