import { MedusaService } from "@medusajs/framework/utils"
import BoxTheme from "./models/box-theme"
import BodyCatalog from "./models/body-catalog"
import CustomOrderSpec from "./models/custom-order-spec"
import CustomFigure from "./models/custom-figure"

import DielineCompositor, { DielineCustomSpec } from "./services/dieline-compositor"
import TradingCardCompositor from "./services/trading-card-compositor"

class BlindBoxModuleService extends MedusaService({
  BoxTheme,
  BodyCatalog,
  CustomOrderSpec,
  CustomFigure
}) {
  private dielineCompositor = new DielineCompositor()
  private cardCompositor = new TradingCardCompositor()

  async composeDielineSvg(spec: DielineCustomSpec): Promise<string> {
    return this.dielineCompositor.compose(spec)
  }

  async composeTradingCardSheetSvg(spec: DielineCustomSpec): Promise<string> {
    return this.cardCompositor.composeSheet(spec)
  }
}

export default BlindBoxModuleService
