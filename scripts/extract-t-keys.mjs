#!/usr/bin/env node
/**
 * Extract all translation keys ($t, <I18nT>) from Vue/TS/JS codebase,
 * audit against lang databases (en.json, es.json), and optionally fix/sync/prune them.
 *
 * Usage:
 *   node scripts/extract-t-keys.mjs          # Audit and display report
 *   node scripts/extract-t-keys.mjs --fix    # Add missing keys to en.json/es.json, sort alphabetically
 *   node scripts/extract-t-keys.mjs --fix --prune # Remove confirmed unused/orphaned keys
 *   node scripts/extract-t-keys.mjs --json   # Output JSON summary to stdout
 *   node scripts/extract-t-keys.mjs --check  # Fail with exit code 1 if missing keys or diffs exist
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs"
import { resolve, join, relative } from "path"

const ROOT = resolve(import.meta.dirname, "..")
const SEARCH_DIRS = [
  { dir: join(ROOT, "apps/storefront/src"), exts: [".vue", ".ts", ".js"] }
]
const EN_JSON_PATH = join(ROOT, "apps/storefront/src/lang/en.json")
const ES_JSON_PATH = join(ROOT, "apps/storefront/src/lang/es.json")

const T_KEY_RE = /\$t\(\s*['"`]([^'"`]+)['"`]\s*(?:,|\))/g
const I18N_T_RE = /<I18nT\s+[^>]*?keypath=['"`]([^'"`]+)['"`]/g

function loadLangJson(path) {
  if (!existsSync(path)) {
    return {}
  }

  try {
    return JSON.parse(readFileSync(path, "utf8"))
  } catch {
    return {}
  }
}

let enDict = loadLangJson(EN_JSON_PATH)
let esDict = loadLangJson(ES_JSON_PATH)

const enKeys = new Set(Object.keys(enDict))
const esKeys = new Set(Object.keys(esDict))

function collectFiles(dir, exts) {
  const results = []

  if (!existsSync(dir)) {
    return results
  }

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)

    if (stat.isDirectory()) {
      results.push(...collectFiles(full, exts))
    } else if (exts.some((ext) => entry.endsWith(ext))) {
      results.push(full)
    }
  }

  return results
}

const keyMap = new Map()

for (const { dir, exts } of SEARCH_DIRS) {
  const files = collectFiles(dir, exts)

  for (const file of files) {
    const content = readFileSync(file, "utf8")
    const rel = relative(ROOT, file)

    // Extract $t('...')
    let match
    T_KEY_RE.lastIndex = 0

    while ((match = T_KEY_RE.exec(content)) !== null) {
      const key = match[1]

      if (!keyMap.has(key)) {
        keyMap.set(key, [])
      }

      keyMap.get(key).push(rel)
    }

    // Extract <I18nT keypath="..." />
    I18N_T_RE.lastIndex = 0

    while ((match = I18N_T_RE.exec(content)) !== null) {
      const key = match[1]

      if (!keyMap.has(key)) {
        keyMap.set(key, [])
      }

      keyMap.get(key).push(rel)
    }
  }
}

const extractedKeys = Array.from(keyMap.keys()).sort()
const extractedSet = new Set(extractedKeys)

// Code vs DB
const missingFromEn = extractedKeys.filter((k) => !enKeys.has(k))
const missingFromEs = extractedKeys.filter((k) => !esKeys.has(k))

const unusedInEn = Array.from(enKeys).filter((k) => !extractedSet.has(k)).sort()
const unusedInEs = Array.from(esKeys).filter((k) => !extractedSet.has(k)).sort()

// DB vs DB Diff
const inEnOnly = Array.from(enKeys).filter((k) => !esKeys.has(k)).sort()
const inEsOnly = Array.from(esKeys).filter((k) => !enKeys.has(k)).sort()
const untranslatedInEs = Array.from(enKeys).filter((k) => esKeys.has(k) && enDict[k] === esDict[k]).sort()

// ─── Optional Fix Mode (--fix) ─────────────────────────────────────────────
const shouldFix = process.argv.includes("--fix")
const shouldPrune = process.argv.includes("--prune")
let fixedEnCount = 0
let fixedEsCount = 0
let prunedCount = 0

if (shouldFix) {
  // English dictionary values must always match key
  for (const key of Object.keys(enDict)) {
    if (enDict[key] !== key) {
      enDict[key] = key
      fixedEnCount++
    }
  }

  for (const key of missingFromEn) {
    enDict[key] = key
    fixedEnCount++
  }

  for (const key of missingFromEs) {
    esDict[key] = enDict[key] || key
    fixedEsCount++
  }

  for (const key of inEnOnly) {
    if (!esDict[key]) {
      esDict[key] = enDict[key]
      fixedEsCount++
    }
  }

  for (const key of inEsOnly) {
    if (!enDict[key]) {
      enDict[key] = key
      fixedEnCount++
    }
  }

  if (shouldPrune) {
    for (const key of unusedInEn) {
      delete enDict[key]
      delete esDict[key]
      prunedCount++
    }
  }

  // Sort key dictionaries alphabetically
  const sortedEnDict = Object.fromEntries(
    Object.entries(enDict).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  )
  const sortedEsDict = Object.fromEntries(
    Object.entries(esDict).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  )

  writeFileSync(EN_JSON_PATH, JSON.stringify(sortedEnDict, null, 2) + "\n")
  writeFileSync(ES_JSON_PATH, JSON.stringify(sortedEsDict, null, 2) + "\n")
}

const activeMissingFromEn = shouldFix ? [] : missingFromEn
const activeMissingFromEs = shouldFix ? [] : missingFromEs
const activeInEnOnly = shouldFix ? [] : inEnOnly
const activeInEsOnly = shouldFix ? [] : inEsOnly
const activeUntranslatedInEs = shouldFix
  ? Object.keys(enDict).filter((k) => esDict[k] && enDict[k] === esDict[k]).sort()
  : untranslatedInEs

const outputSummary = {
  total_extracted_keys: extractedKeys.length,
  en_keys_count: Object.keys(enDict).length,
  es_keys_count: Object.keys(esDict).length,
  missing_from_en: activeMissingFromEn.length,
  missing_from_es: activeMissingFromEs.length,
  unused_in_en: shouldPrune ? 0 : unusedInEn.length,
  unused_in_es: shouldPrune ? 0 : unusedInEs.length,
  untranslated_in_es: activeUntranslatedInEs.length,
  fixed_en: fixedEnCount,
  fixed_es: fixedEsCount,
  pruned_keys: prunedCount
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(outputSummary, null, 2))
  process.exit(0)
}

console.log("=== i18n Translation Audit ===")
console.log(`Extracted keys from code: ${extractedKeys.length}`)
console.log(`en.json keys: ${Object.keys(enDict).length}`)
console.log(`es.json keys: ${Object.keys(esDict).length}`)

if (activeMissingFromEn.length > 0) {
  console.log(`\n[!] Missing from en.json (${activeMissingFromEn.length}):`)
  activeMissingFromEn.forEach((k) => console.log(`  - "${k}"`))
}

if (activeMissingFromEs.length > 0) {
  console.log(`\n[!] Missing from es.json (${activeMissingFromEs.length}):`)
  activeMissingFromEs.forEach((k) => console.log(`  - "${k}"`))
}

if (!shouldPrune && unusedInEn.length > 0) {
  console.log(`\n[i] Unused in en.json (${unusedInEn.length}):`)
  unusedInEn.slice(0, 10).forEach((k) => console.log(`  - "${k}"`))
  if (unusedInEn.length > 10) console.log(`  ... and ${unusedInEn.length - 10} more`)
}

if (activeUntranslatedInEs.length > 0) {
  console.log(`\n[i] Untranslated in es.json (${activeUntranslatedInEs.length}):`)
  activeUntranslatedInEs.slice(0, 10).forEach((k) => console.log(`  - "${k}"`))
  if (activeUntranslatedInEs.length > 10) console.log(`  ... and ${activeUntranslatedInEs.length - 10} more`)
}

if (shouldFix) {
  console.log(`\n[+] Fixed en.json: ${fixedEnCount} modifications.`)
  console.log(`[+] Fixed es.json: ${fixedEsCount} modifications.`)
  if (shouldPrune) console.log(`[+] Pruned orphaned keys: ${prunedCount}.`)
}

if (process.argv.includes("--check")) {
  if (activeMissingFromEn.length > 0 || activeMissingFromEs.length > 0 || activeInEnOnly.length > 0 || activeInEsOnly.length > 0) {
    console.error("\nFAIL: Translation dictionary symmetry check failed.")
    process.exit(1)
  }
  console.log("\nPASS: All translation keys are symmetrical and present.")
}
