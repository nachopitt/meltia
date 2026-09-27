import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse
} from "@medusajs/framework/workflows-sdk"
import { BLINDBOX_MODULE } from "../modules/blindbox"
import BlindBoxModuleService from "../modules/blindbox/service"
import DielineCompositor, { DielineCustomSpec } from "../modules/blindbox/services/dieline-compositor"
import TradingCardCompositor from "../modules/blindbox/services/trading-card-compositor"

export interface GenerateDielineWorkflowInput {
  custom_order_spec_id?: string
  override_spec?: Partial<DielineCustomSpec>
}

export const resolveDielineSpecStep = createStep(
  "resolve-dieline-spec",
  async (input: GenerateDielineWorkflowInput, context) => {
    let spec: DielineCustomSpec = {
      collectionTitle: input.override_spec?.collectionTitle || "MELTIA COLLECTIBLE",
      subtitle: input.override_spec?.subtitle || "COLLECTIBLE BLIND BOX",
      backPanelMode: input.override_spec?.backPanelMode || "roster_grid",
      ...input.override_spec
    }

    let existingOrderSpec: any = null

    if (input.custom_order_spec_id && context?.container) {
      const blindboxService: BlindBoxModuleService = context.container.resolve(BLINDBOX_MODULE)
      const orderSpec = await blindboxService.retrieveCustomOrderSpec(input.custom_order_spec_id, {
        relations: ["figures"]
      })

      existingOrderSpec = orderSpec

      let themeSlug = spec.themeSlug
      if (orderSpec.box_theme_id) {
        try {
          const theme = await blindboxService.retrieveBoxTheme(orderSpec.box_theme_id)
          themeSlug = theme.slug
        } catch {
          // ignore theme resolution error
        }
      }

      const figures = (orderSpec.figures as any[]) || []
      const primaryFigure = figures.find((f) => f.is_primary) || figures[0]
      const secondaryFigure = figures.find((f) => !f.is_primary) || figures[1]

      spec = {
        collectionTitle: orderSpec.collection_title || spec.collectionTitle,
        subtitle: spec.subtitle,
        backPanelMode: (orderSpec.back_panel_mode as "roster_grid" | "dual_showcase") || spec.backPanelMode,
        themeSlug: themeSlug || spec.themeSlug,
        dedicationHeadline: orderSpec.dedication_headline || spec.dedicationHeadline,
        dedicationBody: orderSpec.dedication_body || spec.dedicationBody,
        aiIllustrationUrl: orderSpec.ai_illustration_url || spec.aiIllustrationUrl,
        mainCharacterName: primaryFigure?.character_name || spec.mainCharacterName,
        mainCharacterRenderUrl: primaryFigure?.cropped_face_url || spec.mainCharacterRenderUrl,
        partnerName: secondaryFigure?.character_name || spec.partnerName,
        partnerRenderUrl: secondaryFigure?.cropped_face_url || spec.partnerRenderUrl,
        rosterFigures: figures.map((f) => ({
          name: f.character_name || "Figure",
          isMystery: !f.character_name || f.character_name.toLowerCase().includes("mystery"),
          renderUrl: f.cropped_face_url
        })),
        ...input.override_spec
      }
    }

    return new StepResponse({
      spec,
      custom_order_spec_id: input.custom_order_spec_id,
      existingOrderSpec
    })
  }
)

export const generateDielineAssetsStep = createStep(
  "generate-dieline-assets",
  async (
    input: {
      spec: DielineCustomSpec
      custom_order_spec_id?: string
      existingOrderSpec?: any
    }
  ) => {
    const dielineCompositor = new DielineCompositor(input.spec.dimensions)
    const tradingCardCompositor = new TradingCardCompositor()

    const dielineSvg = dielineCompositor.compose(input.spec)
    const cardsSvg = tradingCardCompositor.composeSheet(input.spec)
    const cardFrontSvg = tradingCardCompositor.composeFront(input.spec)
    const cardBackSvg = tradingCardCompositor.composeBack(input.spec)

    return new StepResponse({
      dieline_svg: dielineSvg,
      cards_svg: cardsSvg,
      card_front_svg: cardFrontSvg,
      card_back_svg: cardBackSvg,
      spec: input.spec,
      custom_order_spec_id: input.custom_order_spec_id,
      existingOrderSpec: input.existingOrderSpec
    })
  }
)

export const saveDielineAssetsStep = createStep(
  "save-dieline-assets",
  async (
    input: {
      dieline_svg: string
      cards_svg: string
      card_front_svg: string
      card_back_svg: string
      spec: DielineCustomSpec
      custom_order_spec_id?: string
      existingOrderSpec?: any
    },
    context
  ) => {
    if (!input.custom_order_spec_id || !context?.container) {
      return new StepResponse(null)
    }

    const blindboxService: BlindBoxModuleService = context.container.resolve(BLINDBOX_MODULE)
    const dielineDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(input.dieline_svg)}`
    const cardsDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(input.cards_svg)}`

    const updated = await blindboxService.updateCustomOrderSpecs({
      id: input.custom_order_spec_id,
      print_dieline_pdf_url: dielineDataUrl,
      print_cards_pdf_url: cardsDataUrl,
      status: "ready"
    })

    return new StepResponse(updated, {
      id: input.custom_order_spec_id,
      previous: input.existingOrderSpec
    })
  },
  async (compensationData, context) => {
    if (!compensationData?.id || !compensationData?.previous || !context?.container) {
      return
    }

    const blindboxService: BlindBoxModuleService = context.container.resolve(BLINDBOX_MODULE)
    await blindboxService.updateCustomOrderSpecs({
      id: compensationData.id,
      print_dieline_pdf_url: compensationData.previous.print_dieline_pdf_url,
      print_cards_pdf_url: compensationData.previous.print_cards_pdf_url,
      status: compensationData.previous.status
    })
  }
)

export const generateDielineWorkflow = createWorkflow(
  "generate-dieline",
  (input: GenerateDielineWorkflowInput) => {
    const resolved = resolveDielineSpecStep(input)
    const assets = generateDielineAssetsStep(resolved)
    const saved = saveDielineAssetsStep(assets)

    return new WorkflowResponse({
      dieline_svg: assets.dieline_svg,
      cards_svg: assets.cards_svg,
      card_front_svg: assets.card_front_svg,
      card_back_svg: assets.card_back_svg,
      custom_order_spec: saved,
      spec: assets.spec
    })
  }
)

export default generateDielineWorkflow
