import { useState } from 'react'

export function useShare() {
  const [copied, setCopied] = useState(false)

  async function share(text) {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My affirmation', text })
      } catch {
        // User cancelled the share sheet — do nothing
      }
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — silent fail
    }
  }

  return { share, copied }
}
