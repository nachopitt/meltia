import { model } from "@medusajs/framework/utils"

const BoxTheme = model.define("box_theme", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  description: model.text().nullable(),
  dieline_svg_url: model.text().nullable(),
  card_template_url: model.text().nullable(),
  preview_image_url: model.text().nullable(),
  dimensions: model.json().nullable(),
  is_active: model.boolean().default(true)
})

export default BoxTheme
