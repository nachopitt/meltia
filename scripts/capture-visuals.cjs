const { chromium } = require("playwright")
const fs = require("fs")
const path = require("path")

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
]

const ROUTES = [
  { name: "home", path: "/" },
  { name: "customizer", path: "/customizer" },
]

const BASE_URL = process.env.TEST_BASE_URL || "http://web:80"
const OUTPUT_DIR = path.resolve(process.cwd(), "screenshots")

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function run() {
  const executablePath = fs.existsSync("/ms-playwright/chromium-1234/chrome-linux64/chrome")
    ? "/ms-playwright/chromium-1234/chrome-linux64/chrome"
    : undefined

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  let hasErrors = false

  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      })

      const consoleMessages = []
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleMessages.push(`[${msg.type()}] ${msg.text()}`)
        }
      })

      page.on("pageerror", (err) => {
        consoleMessages.push(`[PAGE_ERROR] ${err.message}`)
      })

      const targetUrl = `${BASE_URL}${route.path}`
      console.log(`Testing ${route.name} (${vp.name}) -> ${targetUrl}`)

      try {
        const response = await page.goto(targetUrl, {
          waitUntil: "networkidle",
          timeout: 10000,
        })

        if (!response || response.status() >= 400) {
          console.error(`HTTP error: ${response ? response.status() : "no response"}`)
          hasErrors = true
        }

        const filename = `${route.name}-${vp.name}.png`
        const filepath = path.join(OUTPUT_DIR, filename)
        await page.screenshot({ path: filepath, fullPage: true })
        console.log(`Saved screenshot: ${filepath}`)

        if (consoleMessages.length > 0) {
          console.error(`Console errors on ${route.name} (${vp.name}):`)
          consoleMessages.forEach((msg) => console.error(`  ${msg}`))
          hasErrors = true
        }
      } catch (err) {
        console.error(`Error testing ${route.name} (${vp.name}):`, err.message)
        hasErrors = true
      } finally {
        await page.close()
      }
    }
  }

  await browser.close()

  if (hasErrors) {
    console.error("Visual capture encountered errors.")
    process.exit(1)
  } else {
    console.log("All visual checks passed successfully.")
  }
}

run()
