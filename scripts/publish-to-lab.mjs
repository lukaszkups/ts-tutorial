#!/usr/bin/env node
/**
 * Copy VitePress dist into lukaszkups.net content/pages/lab/<slug>/
 *
 * Usage: node scripts/publish-to-lab.mjs <lab-slug>
 * Expects: docs/.vitepress/dist (run docs:build first)
 * Target: ../../lukaszkups.net/content/pages/lab/<slug>
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const slug = process.argv[2]
if (!slug) {
  console.error('Usage: node scripts/publish-to-lab.mjs <lab-slug>')
  process.exit(1)
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'docs/.vitepress/dist')
const dest = resolve(root, '../../lukaszkups.net/content/pages/lab', slug)

if (!existsSync(dist)) {
  console.error(`Missing build output: ${dist}\nRun npm run docs:build first.`)
  process.exit(1)
}

const siteRoot = resolve(root, '../../lukaszkups.net')
if (!existsSync(siteRoot)) {
  console.error(`lukaszkups.net repo not found at: ${siteRoot}`)
  process.exit(1)
}

rmSync(dest, { recursive: true, force: true })
mkdirSync(dest, { recursive: true })
cpSync(dist, dest, { recursive: true })

console.log(`Published → ${dest}`)
