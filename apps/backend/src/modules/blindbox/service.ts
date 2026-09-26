import { MedusaService } from "@medusajs/framework/utils"
import BoxTheme from "./models/box-theme"
import BodyCatalog from "./models/body-catalog"
import CustomOrderSpec from "./models/custom-order-spec"
import CustomFigure from "./models/custom-figure"

class BlindBoxModuleService extends MedusaService({
  BoxTheme,
  BodyCatalog,
  CustomOrderSpec,
  CustomFigure
}) {}

export default BlindBoxModuleService
