import axios from "axios"

interface TranslationPayload {
  texts: Record<string, string>
  target_lang: string
  context: string
}

interface TranslationResponse {
  success: boolean
  translations?: Record<string, string>
  error?: string
}

let isTranslating = false
const originalTexts: Record<string, string> = {}

export function cleanText(text: string): string {
  if (!text || typeof text !== "string") return ""
  try {
    return text
      .replace(/[-\u001F\u007F-\u009F]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/["\\\b\f\n\r\t]/g, " ")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, " ")
      .trim()
  } catch (e) {
    console.warn("Text cleaning failed:", text.substring(0, 50), e)
    return ""
  }
}

export function isVisible(el: Element): boolean {
  return !!(el.clientWidth || el.clientHeight || (el as HTMLElement).getClientRects().length)
}

export function replaceTextOnly(el: Element, newText: string): void {
  let textReplaced = false

  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim().length) {
      node.textContent = " " + newText
      textReplaced = true
      break
    }
  }

  if (!textReplaced) {
    const icon = el.querySelector("i, svg")
    if (icon?.nextSibling) {
      icon.parentNode?.insertBefore(document.createTextNode(" " + newText), icon.nextSibling)
    } else {
      el.appendChild(document.createTextNode(" " + newText))
    }
  }
}

export function initializeTranslation(): void {
  let index = 0

  document.querySelectorAll("body *:not(script):not(style):not(table td)").forEach((el) => {
    const tag = el.tagName.toLowerCase()

    if (
      (el.children.length === 0 && el.textContent?.trim().length && isVisible(el)) ||
      (el.children.length > 0 &&
        el.childNodes.length > 0 &&
        Array.from(el.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim().length) &&
        isVisible(el)) ||
      tag === "button" ||
      tag === "th"
    ) {
      const hasChildTransId = el.querySelectorAll("[data-trans-id]").length > 0
      if (!hasChildTransId) {
        const key = `trans-id-${index++}`
        el.setAttribute("data-trans-id", key)
        originalTexts[key] = el.textContent?.trim() || ""
      }
    }
  })

  // Handle placeholders
  document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((el) => {
    const key = `placeholder-id-${index++}`
    el.setAttribute("data-trans-id", key)
    originalTexts[key] = (el as HTMLInputElement | HTMLTextAreaElement).placeholder
  })

  // Handle textarea values
  document.querySelectorAll("textarea").forEach((el) => {
    if ((el as HTMLTextAreaElement).value?.trim().length) {
      const key = `textarea-id-${index++}`
      el.setAttribute("data-trans-id", key)
      originalTexts[key] = (el as HTMLTextAreaElement).value.trim()
    }
  })

  // Handle tooltips
  document.querySelectorAll("i[data-original-title]").forEach((el) => {
    const tooltipText = el.getAttribute("data-original-title")?.trim()
    if (tooltipText) {
      const key = `tooltip-id-${index++}`
      el.setAttribute("data-trans-id", key)
      originalTexts[key] = tooltipText
    }
  })
}

export function revertToEnglish(): void {
  Object.entries(originalTexts).forEach(([id, text]) => {
    const el = document.querySelector(`[data-trans-id="${id}"]`)
    if (!el) return

    if (id.startsWith("placeholder-id-")) {
      el.setAttribute("placeholder", text)
    } else if (id.startsWith("textarea-id-")) {
      ;(el as HTMLTextAreaElement).value = text
    } else if (id.startsWith("tooltip-id-")) {
      el.setAttribute("data-original-title", text)
      el.setAttribute("title", text)
    } else {
      replaceTextOnly(el, text)
    }
  })
}

export async function translatePage(targetLang: string): Promise<void> {
  if (isTranslating) return
  isTranslating = true
  localStorage.setItem("selectedLanguage", targetLang)

  try {
    const textsToTranslate: Record<string, string> = {}
    let textCount = 0

    document.querySelectorAll("[data-trans-id]").forEach((el) => {
      const id = el.getAttribute("data-trans-id")
      if (!id) return

      let rawText = ""

      if (id.startsWith("placeholder-id-")) {
        rawText = el.getAttribute("placeholder") || ""
      } else if (id.startsWith("textarea-id-")) {
        rawText = (el as HTMLTextAreaElement).value
      } else if (id.startsWith("tooltip-id-")) {
        rawText = el.getAttribute("data-original-title") || ""
      } else if (!el.closest("td")) {
        rawText = el.textContent || ""
      }

      if (rawText?.trim()) {
        const cleaned = cleanText(rawText)
        if (cleaned.length > 0) {
          textsToTranslate[id] = cleaned
          textCount++
        }
      }
    })

    if (textCount === 0) return

    const payload: TranslationPayload = {
      texts: textsToTranslate,
      target_lang: targetLang,
      context: "Web page content translation",
    }

    const response = await axios.post<TranslationResponse>("http://localhost:8000/translate", payload)

    if (response.data.success && response.data.translations) {
      Object.entries(response.data.translations).forEach(([id, translatedText]) => {
        const el = document.querySelector(`[data-trans-id="${id}"]`)
        if (!el || !translatedText) return

        if (id.startsWith("placeholder-id-")) {
          el.setAttribute("placeholder", translatedText)
        } else if (id.startsWith("textarea-id-")) {
          ;(el as HTMLTextAreaElement).value = translatedText
        } else if (id.startsWith("tooltip-id-")) {
          el.setAttribute("data-original-title", translatedText)
          el.setAttribute("title", translatedText)
        } else {
          replaceTextOnly(el, translatedText)
        }
      })

      const cacheKey = `${location.pathname}_${targetLang}`
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          translations: response.data.translations,
          timestamp: new Date().toISOString(),
        })
      )
    } else {
      console.error("Translation failed:", response.data.error)
      throw new Error(response.data.error || "Unknown error")
    }
  } catch (error) {
    console.error("Translation error:", error)
    throw error
  } finally {
    isTranslating = false
  }
}

export function loadCachedTranslations(lang: string): boolean {
  const key = `${location.pathname}_${lang}`
  const cached = localStorage.getItem(key)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      Object.entries(parsed.translations).forEach(([id, text]) => {
        const el = document.querySelector(`[data-trans-id="${id}"]`)
        if (!el) return

        if (id.startsWith("placeholder-id-")) {
          el.setAttribute("placeholder", text as string)
        } else if (id.startsWith("textarea-id-")) {
          ;(el as HTMLTextAreaElement).value = text as string
        } else if (id.startsWith("tooltip-id-")) {
          el.setAttribute("data-original-title", text as string)
          el.setAttribute("title", text as string)
        } else {
          replaceTextOnly(el, text as string)
        }
      })
      return true
    } catch (e) {
      console.error("Error loading cache", e)
    }
  }
  return false
}