import { model } from "@medusajs/framework/utils"
import CustomFigure from "./custom-figure"

const CustomOrderSpec = model.define("custom_order_spec", {
  id: model.id().primaryKey(),
  line_item_id: model.text(),
  box_theme_id: model.text().nullable(),
  collection_title: model.text(),
  dedication_headline: model.text().nullable(),
  dedication_body: model.text().nullable(),
  ai_illustration_url: model.text().nullable(),
  print_dieline_pdf_url: model.text().nullable(),
  print_cards_pdf_url: model.text().nullable(),
  back_panel_mode: model.text().default("roster_grid"),
  status: model.text().default("pending"),
  figures: model.hasMany(() => CustomFigure, { mappedBy: "order_spec" })
})

export default CustomOrderSpec
