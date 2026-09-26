import { model } from "@medusajs/framework/utils"

const BodyCatalog = model.define("body_catalog", {
  id: model.id().primaryKey(),
  category: model.text(),
  code: model.text().unique(),
  name: model.text(),
  outfit_description: model.text().nullable(),
  preview_image_url: model.text().nullable(),
  mesh_stl_url: model.text().nullable(),
  is_active: model.boolean().default(true)
})

export default BodyCatalog
