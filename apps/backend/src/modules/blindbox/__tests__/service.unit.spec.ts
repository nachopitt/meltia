import BlindBoxModuleService from "../service"
import BoxTheme from "../models/box-theme"
import BodyCatalog from "../models/body-catalog"
import CustomOrderSpec from "../models/custom-order-spec"
import CustomFigure from "../models/custom-figure"

describe("BlindBoxModuleService unit tests", () => {
  it("exports a valid MedusaService with dynamic entity CRUD methods", () => {
    expect(BlindBoxModuleService).toBeDefined()
    expect(typeof BlindBoxModuleService).toBe("function")

    const proto = BlindBoxModuleService.prototype
    expect(typeof proto.listBoxThemes).toBe("function")
    expect(typeof proto.createBoxThemes).toBe("function")
    expect(typeof proto.listBodyCatalogs).toBe("function")
    expect(typeof proto.createBodyCatalogs).toBe("function")
    expect(typeof proto.listCustomOrderSpecs).toBe("function")
    expect(typeof proto.createCustomOrderSpecs).toBe("function")
    expect(typeof proto.listCustomFigures).toBe("function")
    expect(typeof proto.createCustomFigures).toBe("function")
  })

  it("verifies BoxTheme model entity properties", () => {
    expect(BoxTheme).toBeDefined()
    expect(BoxTheme.name).toBe("BoxTheme")
  })

  it("verifies BodyCatalog model entity properties", () => {
    expect(BodyCatalog).toBeDefined()
    expect(BodyCatalog.name).toBe("BodyCatalog")
  })

  it("verifies CustomOrderSpec and CustomFigure model entity properties", () => {
    expect(CustomOrderSpec).toBeDefined()
    expect(CustomOrderSpec.name).toBe("CustomOrderSpec")
    expect(CustomFigure).toBeDefined()
    expect(CustomFigure.name).toBe("CustomFigure")
  })
})
