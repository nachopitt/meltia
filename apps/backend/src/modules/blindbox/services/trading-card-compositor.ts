import {
  DielineCustomSpec,
  THEME_PALETTES,
  ThemeColors,
  escapeXml,
  wrapText
} from "./dieline-compositor"

export interface TradingCardDimensions {
  width: number
  height: number
  cornerRadius: number
  gap: number
  margin: number
}

export const DEFAULT_CARD_DIMENSIONS: TradingCardDimensions = {
  width: 63,
  height: 88,
  cornerRadius: 3,
  gap: 8,
  margin: 10
}

export class TradingCardCompositor {
  private dims: TradingCardDimensions

  constructor(dims?: Partial<TradingCardDimensions>) {
    this.dims = { ...DEFAULT_CARD_DIMENSIONS, ...dims }
  }

  getDimensions(): TradingCardDimensions {
    return { ...this.dims }
  }

  composeSheet(spec: DielineCustomSpec): string {
    const { width: W, height: H, cornerRadius: R, gap: G, margin: M } = this.dims
    const totalWidth = M * 2 + W * 2 + G
    const totalHeight = M * 2 + H

    const theme = THEME_PALETTES[spec.themeSlug ?? "celestial-night-gold"] ?? THEME_PALETTES["celestial-night-gold"]
    const colors: ThemeColors = { ...theme, ...spec.themeColors }

    const card1X = M
    const card1Y = M
    const card2X = M + W + G
    const card2Y = M

    const frontContent = this.renderCardFrontContent(spec, card1X, card1Y, W, H, colors)
    const backContent = this.renderCardBackContent(spec, card2X, card2Y, W, H, colors)
    const registration = this.renderSheetRegistration(totalWidth, totalHeight, M)

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}mm" height="${totalHeight}mm">
  <defs>
    <linearGradient id="card-theme-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}" />
      <stop offset="70%" stop-color="${colors.secondary}" />
      <stop offset="100%" stop-color="${colors.background}" />
    </linearGradient>
    <linearGradient id="card-gold-banner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b8860b" />
      <stop offset="40%" stop-color="#f3e5ab" />
      <stop offset="60%" stop-color="${colors.accent}" />
      <stop offset="100%" stop-color="#b8860b" />
    </linearGradient>
    <radialGradient id="card-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${colors.primary}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- CARD 1: FRONT -->
  <g id="card-front">
    ${frontContent}
    <!-- Cut Line (Red) -->
    <rect x="${card1X}" y="${card1Y}" width="${W}" height="${H}" rx="${R}" ry="${R}" fill="none" stroke="red" stroke-width="0.5" />
  </g>

  <!-- CARD 2: BACK -->
  <g id="card-back">
    ${backContent}
    <!-- Cut Line (Red) -->
    <rect x="${card2X}" y="${card2Y}" width="${W}" height="${H}" rx="${R}" ry="${R}" fill="none" stroke="red" stroke-width="0.5" />
  </g>

  <!-- SHEET REGISTRATION & LEGEND -->
  <g id="sheet-legend">
    ${registration}
  </g>
</svg>`
  }

  composeFront(spec: DielineCustomSpec): string {
    const { width: W, height: H, cornerRadius: R } = this.dims
    const theme = THEME_PALETTES[spec.themeSlug ?? "celestial-night-gold"] ?? THEME_PALETTES["celestial-night-gold"]
    const colors: ThemeColors = { ...theme, ...spec.themeColors }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">
  <defs>
    <linearGradient id="card-theme-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}" />
      <stop offset="70%" stop-color="${colors.secondary}" />
      <stop offset="100%" stop-color="${colors.background}" />
    </linearGradient>
    <linearGradient id="card-gold-banner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b8860b" />
      <stop offset="40%" stop-color="#f3e5ab" />
      <stop offset="60%" stop-color="${colors.accent}" />
      <stop offset="100%" stop-color="#b8860b" />
    </linearGradient>
  </defs>
  ${this.renderCardFrontContent(spec, 0, 0, W, H, colors)}
  <rect x="0" y="0" width="${W}" height="${H}" rx="${R}" ry="${R}" fill="none" stroke="red" stroke-width="0.5" />
</svg>`
  }

  composeBack(spec: DielineCustomSpec): string {
    const { width: W, height: H, cornerRadius: R } = this.dims
    const theme = THEME_PALETTES[spec.themeSlug ?? "celestial-night-gold"] ?? THEME_PALETTES["celestial-night-gold"]
    const colors: ThemeColors = { ...theme, ...spec.themeColors }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">
  <defs>
    <linearGradient id="card-theme-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}" />
      <stop offset="70%" stop-color="${colors.secondary}" />
      <stop offset="100%" stop-color="${colors.background}" />
    </linearGradient>
  </defs>
  ${this.renderCardBackContent(spec, 0, 0, W, H, colors)}
  <rect x="0" y="0" width="${W}" height="${H}" rx="${R}" ry="${R}" fill="none" stroke="red" stroke-width="0.5" />
</svg>`
  }

  private renderCardFrontContent(
    spec: DielineCustomSpec,
    x: number,
    y: number,
    w: number,
    h: number,
    colors: ThemeColors
  ): string {
    const cx = x + w / 2
    const cy = y + h / 2
    const characterName = escapeXml(spec.mainCharacterName || spec.collectionTitle || "Collectible Figure")

    return `<!-- Background & Outer Fill -->
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${this.dims.cornerRadius}" fill="url(#card-theme-bg)" />
    <!-- Decorative Ornate Frame -->
    ${this.renderCardFrame(x + 2.5, y + 2.5, w - 5, h - 5, colors.accent)}

    <!-- Character Name Banner at Top -->
    <path d="M ${cx - 24} ${y + 8} L ${cx + 24} ${y + 8} L ${cx + 21} ${y + 16} L ${cx - 21} ${y + 16} Z" fill="url(#card-gold-banner)" />
    <text x="${cx}" y="${y + 13.8}" font-family="Georgia, serif" font-size="4.2" font-weight="bold" fill="#1b120c" text-anchor="middle">${characterName}</text>

    <!-- Character Presentation -->
    <circle cx="${cx}" cy="${cy + 2}" r="17" fill="url(#card-glow)" />
    ${
      spec.mainCharacterRenderUrl
        ? `<image href="${escapeXml(spec.mainCharacterRenderUrl)}" x="${cx - 15}" y="${cy - 16}" width="30" height="36" preserveAspectRatio="xMidYMid meet" />`
        : this.renderMiniChibi(cx, cy + 2, colors)
    }

    <!-- Brand Logo at Bottom -->
    <text x="${cx}" y="${y + h - 9}" font-family="'Cinzel', Georgia, serif" font-size="4" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${y + h - 6}" font-family="sans-serif" font-size="1.4" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.6">TARJETA COLECCIONABLE</text>`
  }

  private renderCardBackContent(
    spec: DielineCustomSpec,
    x: number,
    y: number,
    w: number,
    h: number,
    colors: ThemeColors
  ): string {
    const cx = x + w / 2
    const isDual = spec.backPanelMode === "dual_showcase"

    // Dedication letter or parchment texture
    const parchmentX = x + 4
    const parchmentY = y + 7
    const parchmentW = w - 8
    const parchmentH = h - 20

    return `<!-- Background & Outer Fill -->
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${this.dims.cornerRadius}" fill="url(#card-theme-bg)" />
    <!-- Decorative Ornate Frame -->
    ${this.renderCardFrame(x + 2.5, y + 2.5, w - 5, h - 5, colors.accent)}

    <!-- Antique Dedication Parchment -->
    <rect x="${parchmentX}" y="${parchmentY}" width="${parchmentW}" height="${parchmentH}" rx="2" fill="${colors.cardParchment}" stroke="${colors.accent}" stroke-width="0.4" />
    <rect x="${parchmentX + 1}" y="${parchmentY + 1}" width="${parchmentW - 2}" height="${parchmentH - 2}" rx="1.5" fill="none" stroke="${colors.accent}" stroke-width="0.2" stroke-opacity="0.5" />

    ${
      isDual
        ? this.renderParchmentDedication(spec, cx, parchmentY, parchmentW, colors)
        : this.renderParchmentCertificate(spec, cx, parchmentY, parchmentW, colors)
    }

    <!-- Brand Logo at Bottom -->
    <text x="${cx}" y="${y + h - 7.5}" font-family="'Cinzel', Georgia, serif" font-size="3.6" font-weight="bold" fill="${colors.text}" text-anchor="middle">Meltia</text>
    <text x="${cx}" y="${y + h - 4.8}" font-family="sans-serif" font-size="1.3" fill="${colors.accent}" text-anchor="middle" letter-spacing="0.6">INSTANTES ETERNOS</text>`
  }

  private renderParchmentDedication(
    spec: DielineCustomSpec,
    cx: number,
    startY: number,
    pW: number,
    colors: ThemeColors
  ): string {
    const headline = escapeXml(spec.dedicationHeadline || "Para Ti Con Todo Mi Amor")
    const body =
      spec.dedicationBody ||
      "Cada instante a tu lado se convierte en un recuerdo eterno. Gracias por compartir tu vida, tus sueños y tu luz conmigo hoy y siempre."
    const signature = escapeXml(spec.dedicationSignature || "Con todo mi amor")
    const bodyLines = wrapText(body, 26)

    return `<!-- Headline with Heart -->
    <text x="${cx}" y="${startY + 7}" font-family="'Playfair Display', Georgia, serif" font-size="3.2" font-style="italic" font-weight="bold" fill="#3a2012" text-anchor="middle">${headline} <tspan fill="#b91c1c">♥</tspan></text>
    <line x1="${cx - 16}" y1="${startY + 9.5}" x2="${cx + 16}" y2="${startY + 9.5}" stroke="#b8860b" stroke-width="0.3" />

    <!-- Dedication Body -->
    <g transform="translate(0, 0)">
      ${bodyLines
        .slice(0, 8)
        .map(
          (line, i) =>
            `<text x="${cx}" y="${startY + 15 + i * 3.5}" font-family="Georgia, serif" font-size="2" font-style="italic" fill="#4a3525" text-anchor="middle">${escapeXml(line)}</text>`
        )
        .join("\n      ")}
    </g>

    <!-- Signature -->
    <text x="${cx}" y="${startY + 48}" font-family="'Playfair Display', Georgia, serif" font-size="2.6" font-weight="bold" fill="#3a2012" text-anchor="middle">${signature}</text>
    <text x="${cx}" y="${startY + 52}" font-size="2.6" fill="#b91c1c" text-anchor="middle">♥</text>`
  }

  private renderParchmentCertificate(
    spec: DielineCustomSpec,
    cx: number,
    startY: number,
    pW: number,
    colors: ThemeColors
  ): string {
    const title = escapeXml(spec.collectionTitle || "MELTIA SERIES")
    const character = escapeXml(spec.mainCharacterName || "Figura Original")

    return `<!-- Collector Certificate of Authenticity -->
    <text x="${cx}" y="${startY + 6.5}" font-family="Georgia, serif" font-size="2.8" font-weight="bold" fill="#3a2012" text-anchor="middle" letter-spacing="0.5">PIEZA COLECCIONABLE</text>
    <text x="${cx}" y="${startY + 10}" font-family="sans-serif" font-size="1.5" fill="#78350f" text-anchor="middle">EDICIÓN EXCLUSIVA A MEDIDA</text>
    <line x1="${cx - 18}" y1="${startY + 12}" x2="${cx + 18}" y2="${startY + 12}" stroke="#b8860b" stroke-width="0.3" />

    <text x="${cx}" y="${startY + 18}" font-family="Georgia, serif" font-size="2.1" font-weight="bold" fill="#3a2012" text-anchor="middle">Colección: ${title}</text>
    <text x="${cx}" y="${startY + 23}" font-family="Georgia, serif" font-size="2" fill="#4a3525" text-anchor="middle">Personaje: ${character}</text>
    <text x="${cx}" y="${startY + 28}" font-family="sans-serif" font-size="1.7" fill="#666666" text-anchor="middle">Serie 1 / 1 &bull; Impresión FDM Artesanal</text>

    <!-- Vintage Note Lines for Handwritten Message -->
    <line x1="${cx - 20}" y1="${startY + 36}" x2="${cx + 20}" y2="${startY + 36}" stroke="#d6c7b2" stroke-width="0.4" stroke-dasharray="1,1" />
    <line x1="${cx - 20}" y1="${startY + 42}" x2="${cx + 20}" y2="${startY + 42}" stroke="#d6c7b2" stroke-width="0.4" stroke-dasharray="1,1" />
    <line x1="${cx - 20}" y1="${startY + 48}" x2="${cx + 20}" y2="${startY + 48}" stroke="#d6c7b2" stroke-width="0.4" stroke-dasharray="1,1" />
    <line x1="${cx - 20}" y1="${startY + 54}" x2="${cx + 20}" y2="${startY + 54}" stroke="#d6c7b2" stroke-width="0.4" stroke-dasharray="1,1" />
    <text x="${cx}" y="${startY + 60}" font-family="Georgia, serif" font-size="1.6" font-style="italic" fill="#8c7355" text-anchor="middle">Espacio para dedicatoria manuscrita</text>`
  }

  private renderCardFrame(x: number, y: number, w: number, h: number, gold: string): string {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="none" stroke="${gold}" stroke-width="0.5" />
    <rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="1.5" fill="none" stroke="${gold}" stroke-width="0.25" stroke-opacity="0.6" />
    <!-- Frame corner dots -->
    <circle cx="${x + 2}" cy="${y + 2}" r="0.6" fill="${gold}" />
    <circle cx="${x + w - 2}" cy="${y + 2}" r="0.6" fill="${gold}" />
    <circle cx="${x + 2}" cy="${y + h - 2}" r="0.6" fill="${gold}" />
    <circle cx="${x + w - 2}" cy="${y + h - 2}" r="0.6" fill="${gold}" />`
  }

  private renderMiniChibi(cx: number, cy: number, colors: ThemeColors): string {
    return `<g transform="translate(${cx}, ${cy})">
      <!-- Head -->
      <circle cx="0" cy="-5" r="7" fill="#fcd5b5" stroke="#e0aa80" stroke-width="0.3" />
      <!-- Hair -->
      <path d="M -7 -6 C -7 -14 7 -14 7 -6 C 8 -3 7 1 5 1 C 3 -4 -3 -4 -5 1 C -7 1 -8 -3 -7 -6 Z" fill="#3c2415" />
      <!-- Eyes & Smile -->
      <circle cx="-2.2" cy="-4.5" r="1" fill="#111827" />
      <circle cx="2.2" cy="-4.5" r="1" fill="#111827" />
      <circle cx="-1.9" cy="-4.8" r="0.3" fill="#ffffff" />
      <circle cx="2.5" cy="-4.8" r="0.3" fill="#ffffff" />
      <path d="M -1.2 -2 Q 0 -1.2 1.2 -2" stroke="#b05244" stroke-width="0.4" fill="none" stroke-linecap="round" />
      <!-- Suit Body -->
      <rect x="-4" y="2" width="8" height="9" rx="1.5" fill="#1e293b" />
      <polygon points="0,2 -1.5,5 1.5,5" fill="#ffffff" />
      <polygon points="0,4 -0.6,7 0.6,7" fill="#e63946" />
      <!-- Legs -->
      <rect x="-2.8" y="11" width="2" height="5" rx="0.5" fill="#0f172a" />
      <rect x="0.8" y="11" width="2" height="5" rx="0.5" fill="#0f172a" />
    </g>`
  }

  private renderSheetRegistration(totalWidth: number, totalHeight: number, margin: number): string {
    const rx1 = 4
    const rx2 = totalWidth - 4
    const ry1 = 4
    const ry2 = totalHeight - 4

    return `<!-- Registration Crosshairs -->
    <path d="M ${rx1} ${ry1 - 2} L ${rx1} ${ry1 + 2} M ${rx1 - 2} ${ry1} L ${rx1 + 2} ${ry1}" stroke="#888888" stroke-width="0.4" />
    <path d="M ${rx2} ${ry1 - 2} L ${rx2} ${ry1 + 2} M ${rx2 - 2} ${ry1} L ${rx2 + 2} ${ry1}" stroke="#888888" stroke-width="0.4" />
    <path d="M ${rx1} ${ry2 - 2} L ${rx1} ${ry2 + 2} M ${rx1 - 2} ${ry2} L ${rx1 + 2} ${ry2}" stroke="#888888" stroke-width="0.4" />
    <path d="M ${rx2} ${ry2 - 2} L ${rx2} ${ry2 + 2} M ${rx2 - 2} ${ry2} L ${rx2 + 2} ${ry2}" stroke="#888888" stroke-width="0.4" />

    <!-- Sheet Information -->
    <line x1="${margin}" y1="${totalHeight - 3}" x2="${margin + 8}" y2="${totalHeight - 3}" stroke="red" stroke-width="0.8" />
    <text x="${margin + 10}" y="${totalHeight - 2.2}" font-family="sans-serif" font-size="2" fill="#333333">Cut Line (63 x 88 mm)</text>
    <text x="${totalWidth - margin}" y="${totalHeight - 2.2}" font-family="sans-serif" font-size="1.8" fill="#666666" text-anchor="end">2-Up Companion Cards | 300 DPI Ready</text>`
  }
}

export default TradingCardCompositor
