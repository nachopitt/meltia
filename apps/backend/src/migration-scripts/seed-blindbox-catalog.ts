import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { BLINDBOX_MODULE } from "../modules/blindbox"
import BlindBoxModuleService from "../modules/blindbox/service"

export default async function seed_blindbox_catalog({
  container
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const blindboxService: BlindBoxModuleService = container.resolve(BLINDBOX_MODULE)

  logger.info("Seeding Blind Box Themes...")

  const themes = [
    {
      name: "Celestial Night Gold",
      slug: "celestial-night-gold",
      description: "Midnight navy blue with gold foil celestial clouds and botanical accents",
      dieline_svg_url: "/assets/dielines/celestial-night-gold.svg",
      card_template_url: "/assets/cards/celestial-night-gold.png",
      preview_image_url: "/assets/previews/celestial-night-gold.png",
      dimensions: { width_mm: 75, height_mm: 120, depth_mm: 75 },
      is_active: true
    },
    {
      name: "Pastel Dream Clouds",
      slug: "pastel-dream-clouds",
      description: "Soft lilac and peach gradients with whimsical fluffy clouds",
      dieline_svg_url: "/assets/dielines/pastel-dream-clouds.svg",
      card_template_url: "/assets/cards/pastel-dream-clouds.png",
      preview_image_url: "/assets/previews/pastel-dream-clouds.png",
      dimensions: { width_mm: 75, height_mm: 120, depth_mm: 75 },
      is_active: true
    },
    {
      name: "Vintage Rose Garden",
      slug: "vintage-rose-garden",
      description: "Victorian botanical rose engravings with antique parchment borders",
      dieline_svg_url: "/assets/dielines/vintage-rose-garden.svg",
      card_template_url: "/assets/cards/vintage-rose-garden.png",
      preview_image_url: "/assets/previews/vintage-rose-garden.png",
      dimensions: { width_mm: 75, height_mm: 120, depth_mm: 75 },
      is_active: true
    },
    {
      name: "Cyber Neon Arcade",
      slug: "cyber-neon-arcade",
      description: "Futuristic dark grid with vibrant cyan and magenta glow lines",
      dieline_svg_url: "/assets/dielines/cyber-neon-arcade.svg",
      card_template_url: "/assets/cards/cyber-neon-arcade.png",
      preview_image_url: "/assets/previews/cyber-neon-arcade.png",
      dimensions: { width_mm: 75, height_mm: 120, depth_mm: 75 },
      is_active: true
    },
    {
      name: "Terracotta Sunset",
      slug: "terracotta-sunset",
      description: "Warm desert sunset hues with minimalist boho arch silhouettes",
      dieline_svg_url: "/assets/dielines/terracotta-sunset.svg",
      card_template_url: "/assets/cards/terracotta-sunset.png",
      preview_image_url: "/assets/previews/terracotta-sunset.png",
      dimensions: { width_mm: 75, height_mm: 120, depth_mm: 75 },
      is_active: true
    },
    {
      name: "Enchanted Forest Emerald",
      slug: "enchanted-forest-emerald",
      description: "Deep forest emerald greens with golden ferns and magical firefly specks",
      dieline_svg_url: "/assets/dielines/enchanted-forest-emerald.svg",
      card_template_url: "/assets/cards/enchanted-forest-emerald.png",
      preview_image_url: "/assets/previews/enchanted-forest-emerald.png",
      dimensions: { width_mm: 75, height_mm: 120, depth_mm: 75 },
      is_active: true
    },
    {
      name: "Monochrome Noir Minimal",
      slug: "monochrome-noir-minimal",
      description: "Matte black with high-contrast architectural typography and glossy foil lines",
      dieline_svg_url: "/assets/dielines/monochrome-noir-minimal.svg",
      card_template_url: "/assets/cards/monochrome-noir-minimal.png",
      preview_image_url: "/assets/previews/monochrome-noir-minimal.png",
      dimensions: { width_mm: 75, height_mm: 120, depth_mm: 75 },
      is_active: true
    },
    {
      name: "Festive Confetti Party",
      slug: "festive-confetti-party",
      description: "Celebratory golden foil confetti on ivory background with festive ribbons",
      dieline_svg_url: "/assets/dielines/festive-confetti-party.svg",
      card_template_url: "/assets/cards/festive-confetti-party.png",
      preview_image_url: "/assets/previews/festive-confetti-party.png",
      dimensions: { width_mm: 75, height_mm: 120, depth_mm: 75 },
      is_active: true
    }
  ]

  for (const theme of themes) {
    const existing = await blindboxService.listBoxThemes({ slug: theme.slug })
    if (existing.length === 0) {
      await blindboxService.createBoxThemes(theme)
      logger.info(`Created theme: ${theme.name}`)
    } else {
      logger.info(`Theme already exists: ${theme.name}`)
    }
  }

  logger.info("Seeding 16 Base Body Catalog...")

  const bodies = [
    // Men (4)
    {
      category: "man",
      code: "MAN_SUIT_01",
      name: "Lic. Elias",
      outfit_description: "Classic charcoal two-piece suit with black silk tie and dress shoes",
      preview_image_url: "/assets/bodies/man-suit-01.png",
      mesh_stl_url: "/assets/stl/bodies/man-suit-01.stl",
      is_active: true
    },
    {
      category: "man",
      code: "MAN_CASUAL_02",
      name: "Elias Casual",
      outfit_description: "Crisp white button-down shirt with dark slim trousers and belt",
      preview_image_url: "/assets/bodies/man-casual-02.png",
      mesh_stl_url: "/assets/stl/bodies/man-casual-02.stl",
      is_active: true
    },
    {
      category: "man",
      code: "MAN_SPORT_03",
      name: "Lupe Shot",
      outfit_description: "Athletic heather grey tee, sports shorts, sneakers and padel racket",
      preview_image_url: "/assets/bodies/man-sport-03.png",
      mesh_stl_url: "/assets/stl/bodies/man-sport-03.stl",
      is_active: true
    },
    {
      category: "man",
      code: "MAN_MARTIAL_04",
      name: "Chacos Gi",
      outfit_description: "Traditional black martial arts uniform (gi) with black belt and bare feet",
      preview_image_url: "/assets/bodies/man-martial-04.png",
      mesh_stl_url: "/assets/stl/bodies/man-martial-04.stl",
      is_active: true
    },
    // Women (4)
    {
      category: "woman",
      code: "WOMAN_GOWN_01",
      name: "Gala Emerald",
      outfit_description: "Strapless flowing lime green evening gala gown with gathered waist",
      preview_image_url: "/assets/bodies/woman-gown-01.png",
      mesh_stl_url: "/assets/stl/bodies/woman-gown-01.stl",
      is_active: true
    },
    {
      category: "woman",
      code: "WOMAN_CASUAL_02",
      name: "Sofia Casual",
      outfit_description: "Comfortable knitted sweater, denim jeans and ankle boots",
      preview_image_url: "/assets/bodies/woman-casual-02.png",
      mesh_stl_url: "/assets/stl/bodies/woman-casual-02.stl",
      is_active: true
    },
    {
      category: "woman",
      code: "WOMAN_SPORT_03",
      name: "Valeria Active",
      outfit_description: "Running top, high-waisted leggings and athletic runners",
      preview_image_url: "/assets/bodies/woman-sport-03.png",
      mesh_stl_url: "/assets/stl/bodies/woman-sport-03.stl",
      is_active: true
    },
    {
      category: "woman",
      code: "WOMAN_SUIT_04",
      name: "Lic. Daniela",
      outfit_description: "Tailored modern executive blazer, silk camisole and pencil trousers",
      preview_image_url: "/assets/bodies/woman-suit-04.png",
      mesh_stl_url: "/assets/stl/bodies/woman-suit-04.stl",
      is_active: true
    },
    // Boys (4)
    {
      category: "boy",
      code: "BOY_CASUAL_01",
      name: "Leo Casual",
      outfit_description: "Crewneck graphic tee, denim jeans and casual skate sneakers",
      preview_image_url: "/assets/bodies/boy-casual-01.png",
      mesh_stl_url: "/assets/stl/bodies/boy-casual-01.stl",
      is_active: true
    },
    {
      category: "boy",
      code: "BOY_SPORT_02",
      name: "Mateo Soccer",
      outfit_description: "Striped football kit with soccer shorts, knee socks and cleats",
      preview_image_url: "/assets/bodies/boy-sport-02.png",
      mesh_stl_url: "/assets/stl/bodies/boy-sport-02.stl",
      is_active: true
    },
    {
      category: "boy",
      code: "BOY_SCHOOL_03",
      name: "Santi Uniform",
      outfit_description: "Navy school blazer, collared shirt, tie and smart shorts",
      preview_image_url: "/assets/bodies/boy-school-03.png",
      mesh_stl_url: "/assets/stl/bodies/boy-school-03.stl",
      is_active: true
    },
    {
      category: "boy",
      code: "BOY_HOODIE_04",
      name: "Bruno Street",
      outfit_description: "Oversized hoodie with kangaroo pocket, cargo joggers and high-tops",
      preview_image_url: "/assets/bodies/boy-hoodie-04.png",
      mesh_stl_url: "/assets/stl/bodies/boy-hoodie-04.stl",
      is_active: true
    },
    // Girls (4)
    {
      category: "girl",
      code: "GIRL_DRESS_01",
      name: "Mia Party Dress",
      outfit_description: "A-line party dress with floral embroidery and ballerina flats",
      preview_image_url: "/assets/bodies/girl-dress-01.png",
      mesh_stl_url: "/assets/stl/bodies/girl-dress-01.stl",
      is_active: true
    },
    {
      category: "girl",
      code: "GIRL_CASUAL_02",
      name: "Emma Casual",
      outfit_description: "Pastel striped t-shirt with denim dungarees and white sneakers",
      preview_image_url: "/assets/bodies/girl-casual-02.png",
      mesh_stl_url: "/assets/stl/bodies/girl-casual-02.stl",
      is_active: true
    },
    {
      category: "girl",
      code: "GIRL_BALLET_03",
      name: "Renata Ballet",
      outfit_description: "Pink satin ballet leotard with tulle tutu skirt and ribbons",
      preview_image_url: "/assets/bodies/girl-ballet-03.png",
      mesh_stl_url: "/assets/stl/bodies/girl-ballet-03.stl",
      is_active: true
    },
    {
      category: "girl",
      code: "GIRL_SPORTS_04",
      name: "Ximena Gym",
      outfit_description: "Two-piece gymnastic tracksuit with sporty zip-up and sneakers",
      preview_image_url: "/assets/bodies/girl-sports-04.png",
      mesh_stl_url: "/assets/stl/bodies/girl-sports-04.stl",
      is_active: true
    }
  ]

  for (const body of bodies) {
    const existing = await blindboxService.listBodyCatalogs({ code: body.code })
    if (existing.length === 0) {
      await blindboxService.createBodyCatalogs(body)
      logger.info(`Created body: ${body.name} (${body.code})`)
    } else {
      logger.info(`Body already exists: ${body.name} (${body.code})`)
    }
  }

  logger.info("Blind Box catalog seeding completed successfully!")
}
