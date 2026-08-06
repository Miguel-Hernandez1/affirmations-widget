// ─── Affirmations Widget for Scriptable ───────────────────────────────────
// 1. Get your Profile Key from affirmations-widget.vercel.app/widget
// 2. Paste it below between the quotes
// 3. Add a Scriptable widget to your home screen and select this script
// ──────────────────────────────────────────────────────────────────────────

const PROFILE_KEY = "" // paste your key here

const API_URL  = "https://affirmations-widget.vercel.app/api/daily"
const APP_URL  = "https://affirmations-widget.vercel.app/affirmation"
const BG       = new Color("#fafaf9")
const TEXT     = new Color("#292524")
const MUTED    = new Color("#a8a29e")
const ACCENT   = new Color("#a78bfa")

async function getAffirmation() {
  const req = new Request(`${API_URL}?profile=${encodeURIComponent(PROFILE_KEY)}`)
  return (await req.loadJSON()).affirmation
}

function buildWidget(text, category) {
  const w = new ListWidget()
  w.backgroundColor = BG
  w.setPadding(14, 16, 14, 16)
  w.url = APP_URL

  const cat = w.addText((category || "affirmation").toUpperCase())
  cat.textColor = ACCENT
  cat.font = Font.systemFont(9)
  cat.lineLimit = 1

  w.addSpacer(6)

  const body = w.addText(text)
  body.textColor = TEXT
  body.font = Font.lightSystemFont(14)
  body.minimumScaleFactor = 0.6

  w.addSpacer()

  const footer = w.addText("Affirmations")
  footer.textColor = MUTED
  footer.font = Font.systemFont(9)

  return w
}

function buildSetupWidget() {
  const w = new ListWidget()
  w.backgroundColor = BG
  w.setPadding(14, 16, 14, 16)
  w.url = APP_URL

  const msg = w.addText("Paste your Profile Key to get started.")
  msg.textColor = MUTED
  msg.font = Font.systemFont(12)
  msg.minimumScaleFactor = 0.6

  w.addSpacer(6)

  const hint = w.addText("Visit affirmations-widget.vercel.app/widget")
  hint.textColor = ACCENT
  hint.font = Font.systemFont(10)
  hint.minimumScaleFactor = 0.6

  return w
}

function buildErrorWidget() {
  const w = new ListWidget()
  w.backgroundColor = BG
  w.setPadding(14, 16, 14, 16)
  w.url = APP_URL

  const msg = w.addText("Could not load your affirmation. Tap to open the app.")
  msg.textColor = MUTED
  msg.font = Font.systemFont(12)
  msg.minimumScaleFactor = 0.6

  return w
}

// ─── Main ─────────────────────────────────────────────────────────────────

let widget

if (!PROFILE_KEY) {
  widget = buildSetupWidget()
} else {
  try {
    const aff = await getAffirmation()
    widget = buildWidget(aff.text, aff.categories?.[0])
  } catch (_) {
    widget = buildErrorWidget()
  }
}

Script.setWidget(widget)

if (config.runsInApp) {
  await widget.presentSmall()
}

Script.complete()
