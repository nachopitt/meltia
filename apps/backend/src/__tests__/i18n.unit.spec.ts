import { existsSync, readFileSync } from "fs"
import { resolve, join } from "path"
import { execSync } from "child_process"

describe("i18n Infrastructure & Dictionary Symmetry Test", () => {
  const ROOT = resolve(__dirname, "../../../../")
  const SCRIPT_PATH = join(ROOT, "scripts/extract-t-keys.mjs")
  const EN_PATH = join(ROOT, "apps/storefront/src/lang/en.json")
  const ES_PATH = join(ROOT, "apps/storefront/src/lang/es.json")

  it("extract-t-keys script exists and runs cleanly with --check", () => {
    expect(existsSync(SCRIPT_PATH)).toBe(true)

    const output = execSync(`node "${SCRIPT_PATH}" --check`, {
      encoding: "utf8",
      cwd: ROOT
    })

    expect(output).toContain("PASS: All translation keys are symmetrical and present.")
  })

  it("dictionaries en.json and es.json exist and are non-empty", () => {
    expect(existsSync(EN_PATH)).toBe(true)
    expect(existsSync(ES_PATH)).toBe(true)

    const enDict = JSON.parse(readFileSync(EN_PATH, "utf8"))
    const esDict = JSON.parse(readFileSync(ES_PATH, "utf8"))

    expect(Object.keys(enDict).length).toBeGreaterThan(0)
    expect(Object.keys(esDict).length).toBeGreaterThan(0)
  })

  it("dictionaries are alphabetically sorted", () => {
    const enDict = JSON.parse(readFileSync(EN_PATH, "utf8"))
    const esDict = JSON.parse(readFileSync(ES_PATH, "utf8"))

    const enKeys = Object.keys(enDict)
    const esKeys = Object.keys(esDict)

    const sortedEn = [...enKeys].sort()
    const sortedEs = [...esKeys].sort()

    expect(enKeys).toEqual(sortedEn)
    expect(esKeys).toEqual(sortedEs)
  })

  it("dictionaries en.json and es.json have 100% key-for-key symmetry", () => {
    const enDict = JSON.parse(readFileSync(EN_PATH, "utf8"))
    const esDict = JSON.parse(readFileSync(ES_PATH, "utf8"))

    const enKeys = Object.keys(enDict).sort()
    const esKeys = Object.keys(esDict).sort()

    expect(enKeys).toEqual(esKeys)
  })

  it("en.json satisfies base dictionary purity (key === value)", () => {
    const enDict = JSON.parse(readFileSync(EN_PATH, "utf8"))

    for (const [key, value] of Object.entries(enDict)) {
      expect(value).toBe(key)
    }
  })
})
