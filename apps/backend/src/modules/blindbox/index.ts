import { Module } from "@medusajs/framework/utils"
import BlindBoxModuleService from "./service"

export const BLINDBOX_MODULE = "blindbox"

export default Module(BLINDBOX_MODULE, {
  service: BlindBoxModuleService
})
