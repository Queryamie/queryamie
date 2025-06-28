import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Globe } from "lucide-react"
import { useTranslation } from "@/lib/TranslationContext"

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
]

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useTranslation()

  const handleLanguageChange = async (langCode: string) => {
    await setLanguage(langCode)
    localStorage.setItem("selectedLanguage", langCode)
    window.dispatchEvent(new Event("languageChange"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/20 backdrop-blur-sm">
          <Globe className="h-4 w-4" />
          <span>{languages.find(lang => lang.code === currentLanguage)?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border-white/20">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className="text-white hover:bg-white/20 cursor-pointer"
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 