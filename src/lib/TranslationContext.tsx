import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { initializeTranslation, translatePage, loadCachedTranslations } from "./translation"

interface TranslationContextType {
  currentLanguage: string
  setLanguage: (lang: string) => Promise<void>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const setLanguage = async (lang: string) => {
    try {
      if (!loadCachedTranslations(lang)) {
        await translatePage(lang)
      }
      setCurrentLanguage(lang)
    } catch (error) {
      console.error("Failed to set language:", error)
    }
  }

  useEffect(() => {
    const storedLang = localStorage.getItem("selectedLanguage")
    if (storedLang) {
      setLanguage(storedLang)
    }

    initializeTranslation()

    const handleLanguageChange = () => {
      const selectedLang = localStorage.getItem("selectedLanguage")
      if (selectedLang) {
        setLanguage(selectedLang)
      }
    }

    window.addEventListener("languageChange", handleLanguageChange)
    return () => window.removeEventListener("languageChange", handleLanguageChange)
  }, [])

  // Re-initialize translation when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      initializeTranslation()
      const storedLang = localStorage.getItem("selectedLanguage")
      if (storedLang && storedLang !== "en") {
        setLanguage(storedLang)
      }
    }

    // Listen for route changes
    window.addEventListener("popstate", handleRouteChange)
    
    // Create a mutation observer to watch for route changes in React Router
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" || mutation.type === "attributes") {
          handleRouteChange()
        }
      })
    })

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-rr-ui-event-key"] // React Router specific attribute
    })

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
      observer.disconnect()
    }
  }, [])

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
} 