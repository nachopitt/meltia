import DielineCompositor, {
  DEFAULT_DIMENSIONS,
  DielineCustomSpec
} from "../services/dieline-compositor"
import TradingCardCompositor, {
  DEFAULT_CARD_DIMENSIONS
} from "../services/trading-card-compositor"
import BlindBoxModuleService from "../service"
import generateDielineWorkflow, {
  resolveDielineSpecStep,
  generateDielineAssetsStep
} from "../../../workflows/generate-dieline-workflow"

describe("Milestone 2: Dieline & Asset Generator Engine", () => {
  describe("DielineCompositor Net Geometry & Dimensions", () => {
    it("calculates exact 6-panel tuck box net dimensions for 80x120x60mm", () => {
      const compositor = new DielineCompositor()
      const geom = compositor.calculateGeometry()

      // Core dimensions
      expect(geom.W).toBe(80)
      expect(geom.H).toBe(120)
      expect(geom.D).toBe(60)
      expect(geom.G).toBe(15)
      expect(geom.T).toBe(20)
      expect(geom.H_flap).toBe(35)
      expect(geom.M).toBe(10)

      // Horizontal belt sequence: Margin + Left(D:60) + Front(W:80) + Right(D:60) + Back(W:80) + Glue(G:15) + Margin(10)
      expect(geom.xLeft).toBe(10)
      expect(geom.xFront).toBe(70)
      expect(geom.xRight).toBe(150)
      expect(geom.xBack).toBe(210)
      expect(geom.xGlue).toBe(290)
      expect(geom.xEnd).toBe(305)
      expect(geom.totalWidth).toBe(315)

      // Vertical net sequence: Margin + TopTuck(20) + TopLid(60) + Belt(120) + BottomLid(60) + BottomTuck(20) + Margin(10)
      expect(geom.yTopTuck).toBe(10)
      expect(geom.yTopLid).toBe(30)
      expect(geom.yBeltTop).toBe(90)
      expect(geom.yBeltBottom).toBe(210)
      expect(geom.yBottomLid).toBe(270)
      expect(geom.yBottomTuck).toBe(290)
      expect(geom.totalHeight).toBe(300)

      // 15° bevel math verification: tan(15°) ≈ 0.2679
      expect(geom.flapBevelDx).toBeCloseTo(9.38, 1) // 35 * tan(15°)
      expect(geom.glueBevelDy).toBeCloseTo(4.02, 1) // 15 * tan(15°)
    })

    it("supports custom dimensions override (e.g. 75x120x75mm)", () => {
      const compositor = new DielineCompositor({ width: 75, depth: 75, height: 120 })
      const geom = compositor.calculateGeometry()

      expect(geom.W).toBe(75)
      expect(geom.D).toBe(75)
      // total width: 10 + 75 + 75 + 75 + 75 + 15 + 10 = 335
      expect(geom.totalWidth).toBe(335)
      // total height: 10 + 20 + 75 + 120 + 75 + 20 + 10 = 330
      expect(geom.totalHeight).toBe(330)
    })
  })

  describe("DielineCompositor SVG Output & Markings", () => {
    it("renders valid SVG with millimeters viewBox, cut lines, fold creases, and locking tongue", () => {
      const compositor = new DielineCompositor()
      const spec: DielineCustomSpec = {
        collectionTitle: "ELIAS",
        subtitle: "COLLECTIBLE BLIND BOX",
        backPanelMode: "roster_grid"
      }

      const svg = compositor.compose(spec)

      // SVG root attributes
      expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"')
      expect(svg).toContain('viewBox="0 0 315 300"')
      expect(svg).toContain('width="315mm"')
      expect(svg).toContain('height="300mm"')

      // Cut lines: stroke="red"
      expect(svg).toContain('stroke="red"')
      expect(svg).toContain('id="die-cuts"')

      // Crease lines: stroke="blue" dashed
      expect(svg).toContain('stroke="blue"')
      expect(svg).toContain('stroke-dasharray="3,2"')
      expect(svg).toContain('id="fold-creases"')

      // 15° bevel glue tab and dust flaps
      expect(svg).toContain("GLUE TAB / PESTAÑA")
      expect(svg).toContain("305 94.02") // glue tab top bevel: G * tan(15°) = 15 * 0.2679 ≈ 4.02 -> y = 90 + 4.02 = 94.02
      expect(svg).toContain("19.38") // dust flap bevel: H_flap * tan(15°) = 35 * 0.2679 ≈ 9.38 -> x = 10 + 9.38 = 19.38

      // Locking bottom tongue with friction ears and locking slit
      expect(svg).toContain('x1="92" y1="270" x2="128" y2="270" stroke="red"') // locking slit
      expect(svg).toContain("L 69 275") // friction ear

      // Registration marks and print legend
      expect(svg).toContain('id="print-legend"')
      expect(svg).toContain("Cut Line (Corte)")
      expect(svg).toContain("Fold Crease (Pliegue)")
      expect(svg).toContain("Width: 80mm | Height: 120mm | Depth: 60mm | 300 DPI")
    })

    it("renders Solo Series Roster layout (roster_grid) matching reference IMG-20260908-WA0012", () => {
      const compositor = new DielineCompositor()
      const spec: DielineCustomSpec = {
        collectionTitle: "ELIAS",
        backPanelMode: "roster_grid",
        mainCharacterName: "Elias",
        rosterFigures: [
          { name: "Lupe Shot", isMystery: false },
          { name: "Elias", isMystery: false },
          { name: "Lic. Elias", isMystery: false },
          { name: "Riatilla", isMystery: false },
          { name: "Chacos", isMystery: false },
          { name: "Band", isMystery: true }
        ]
      }

      const svg = compositor.compose(spec)

      // Front panel banner
      expect(svg).toContain("ELIAS")
      expect(svg).toContain("COLLECTIBLE BLIND BOX")
      expect(svg).toContain("Meltia")
      expect(svg).toContain("INSTANTES ETERNOS")

      // Back panel 6-figure roster
      expect(svg).toContain("SERIES ROSTER")
      expect(svg).toContain("Lupe Shot")
      expect(svg).toContain("Lic. Elias")
      expect(svg).toContain("Riatilla")
      expect(svg).toContain("Chacos")
      expect(svg).toContain("Band")
      expect(svg).toContain("Mystery Silhouette")
    })

    it("renders Couple Showcase layout (dual_showcase) matching reference IMG-20260908-WA0013", () => {
      const compositor = new DielineCompositor()
      const spec: DielineCustomSpec = {
        collectionTitle: "FAM. AGUSTÍN",
        backPanelMode: "dual_showcase",
        dedicationHeadline: "Felices 28 mi amor",
        dedicationBody:
          "Hoy celebro la maravillosa persona que eres y agradezco a la vida por permitirme coincidir y compartir contigo parte de este hermoso camino.",
        dedicationSignature: "Te amo mi amor",
        partnerName: "Esposa Agustin"
      }

      const svg = compositor.compose(spec)

      // Front panel
      expect(svg).toContain("FAM. AGUSTÍN")

      // Left panel: Lateral couple hugging illustration
      expect(svg).toContain("LEFT PANEL (DUAL SHOWCASE: AI ILLUSTRATION)")
      expect(svg).toContain("Couple Hugging Illustration")

      // Right panel: Lateral dedication letter
      expect(svg).toContain("RIGHT PANEL (DUAL SHOWCASE: DEDICATION LETTER)")
      expect(svg).toContain("Felices 28 mi amor")
      expect(svg).toContain("Hoy celebro la maravillosa")
      expect(svg).toContain("Te amo mi amor")

      // Back panel: Partner portrait
      expect(svg).toContain("BACK PANEL (DUAL SHOWCASE: PARTNER PORTRAIT)")
      expect(svg).toContain("Esposa Agustin")
    })
  })

  describe("TradingCardCompositor (2-Up Companion Cards)", () => {
    it("renders 2-up trading card sheet matching 63x88mm card dimensions", () => {
      const cardCompositor = new TradingCardCompositor()
      const dims = cardCompositor.getDimensions()

      expect(dims.width).toBe(63)
      expect(dims.height).toBe(88)
      expect(dims.cornerRadius).toBe(3)
      expect(dims.gap).toBe(8)
      expect(dims.margin).toBe(10)

      const spec: DielineCustomSpec = {
        collectionTitle: "FAM. AGUSTÍN",
        backPanelMode: "dual_showcase",
        mainCharacterName: "Agustín",
        dedicationHeadline: "Felices 28 mi amor",
        dedicationBody: "Hoy celebro tu vida y agradezco coincidir contigo.",
        dedicationSignature: "Te amo mi amor"
      }

      const sheetSvg = cardCompositor.composeSheet(spec)

      // Total sheet size: 10 + 63 + 8 + 63 + 10 = 154mm width, 10 + 88 + 10 = 108mm height
      expect(sheetSvg).toContain('viewBox="0 0 154 108"')
      expect(sheetSvg).toContain('width="154mm"')
      expect(sheetSvg).toContain('height="108mm"')

      // Card 1 Front cut line: 63x88mm with 3mm radius
      expect(sheetSvg).toContain('x="10" y="10" width="63" height="88" rx="3" ry="3" fill="none" stroke="red"')
      // Card 2 Back cut line: 63x88mm at x = 10 + 63 + 8 = 81
      expect(sheetSvg).toContain('x="81" y="10" width="63" height="88" rx="3" ry="3" fill="none" stroke="red"')

      // Artwork elements
      expect(sheetSvg).toContain("Agustín")
      expect(sheetSvg).toContain("TARJETA COLECCIONABLE")
      expect(sheetSvg).toContain("Felices 28 mi amor")
      expect(sheetSvg).toContain("Te amo mi amor")
      expect(sheetSvg).toContain("Meltia")
    })

    it("renders individual Front and Back card SVGs", () => {
      const cardCompositor = new TradingCardCompositor()
      const spec: DielineCustomSpec = {
        collectionTitle: "ELIAS",
        backPanelMode: "roster_grid",
        mainCharacterName: "Lic. Elias"
      }

      const frontSvg = cardCompositor.composeFront(spec)
      expect(frontSvg).toContain('viewBox="0 0 63 88"')
      expect(frontSvg).toContain('width="63mm"')
      expect(frontSvg).toContain('height="88mm"')
      expect(frontSvg).toContain("Lic. Elias")

      const backSvg = cardCompositor.composeBack(spec)
      expect(backSvg).toContain('viewBox="0 0 63 88"')
      expect(backSvg).toContain('width="63mm"')
      expect(backSvg).toContain('height="88mm"')
      expect(backSvg).toContain("PIEZA COLECCIONABLE")
      expect(backSvg).toContain("EDICIÓN EXCLUSIVA A MEDIDA")
    })
  })

  describe("BlindBoxModuleService Compositor Integration", () => {
    it("exposes composeDielineSvg and composeTradingCardSheetSvg on service", async () => {
      const service = new BlindBoxModuleService({} as any)

      expect(typeof service.composeDielineSvg).toBe("function")
      expect(typeof service.composeTradingCardSheetSvg).toBe("function")

      const dieline = await service.composeDielineSvg({
        collectionTitle: "TEST",
        backPanelMode: "roster_grid"
      })
      expect(dieline).toContain('<svg xmlns="http://www.w3.org/2000/svg"')

      const sheet = await service.composeTradingCardSheetSvg({
        collectionTitle: "TEST",
        backPanelMode: "dual_showcase"
      })
      expect(sheet).toContain('viewBox="0 0 154 108"')
    })
  })

  describe("generateDielineWorkflow", () => {
    it("exports valid Medusa v2 workflow with steps", () => {
      expect(generateDielineWorkflow).toBeDefined()
      expect(typeof generateDielineWorkflow).toBe("function")
      expect(resolveDielineSpecStep).toBeDefined()
      expect(generateDielineAssetsStep).toBeDefined()
    })

    it("runs workflow to generate dieline and card assets", async () => {
      const workflow = generateDielineWorkflow({} as any)
      const { result } = await workflow.run({
        input: {
          override_spec: {
            collectionTitle: "WORKFLOW TEST",
            backPanelMode: "dual_showcase",
            dedicationHeadline: "Felicidades",
            dedicationBody: "Nota de amor"
          }
        }
      })

      expect(result.dieline_svg).toContain("WORKFLOW TEST")
      expect(result.dieline_svg).toContain('viewBox="0 0 315 300"')
      expect(result.cards_svg).toContain('viewBox="0 0 154 108"')
      expect(result.card_front_svg).toContain('viewBox="0 0 63 88"')
      expect(result.card_back_svg).toContain('viewBox="0 0 63 88"')
    })
  })
})
