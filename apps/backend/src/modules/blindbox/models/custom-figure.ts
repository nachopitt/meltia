import { model } from "@medusajs/framework/utils"
import CustomOrderSpec from "./custom-order-spec"

const CustomFigure = model.define("custom_figure", {
  id: model.id().primaryKey(),
  character_name: model.text().nullable(),
  is_primary: model.boolean().default(false),
  body_catalog_id: model.text().nullable(),
  original_photo_url: model.text().nullable(),
  cropped_face_url: model.text().nullable(),
  skin_filament: model.text().nullable(),
  hair_filament: model.text().nullable(),
  clothing_filament: model.text().nullable(),
  accessories: model.json().nullable(),
  order_spec: model.belongsTo(() => CustomOrderSpec, { mappedBy: "figures" }).nullable()
})

export default CustomFigure
