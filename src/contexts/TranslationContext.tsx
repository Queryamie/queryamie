import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types
interface Language {
  code: string;
  name: string;
  flag: string;
}

interface TranslationContextType {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  translatePage: (targetLang: string) => Promise<void>;
  isTranslating: boolean;
  languages: Language[];
}

// Available languages
const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

// Create context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation Provider
interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [originalTexts, setOriginalTexts] = useState<Record<string, string>>({});

  // Load saved language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      setSelectedLanguageState(savedLang);
    }
  }, []);

  // Set language and persist to localStorage
  const setSelectedLanguage = (lang: string) => {
    setSelectedLanguageState(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  // Extract translatable text from page
  const extractTranslatableText = (): Record<string, string> => {
    const texts: Record<string, string> = {};
    let index = 0;

    // Get all text elements
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, label, a, li, td, th').forEach((element) => {
      const el = element as HTMLElement;
      
      // Skip if element has children with text (to avoid duplicates)
      const hasTextChildren = Array.from(el.children).some(child => 
        child.textContent && child.textContent.trim().length > 0
      );
      
      if (!hasTextChildren && el.textContent && el.textContent.trim().length > 3) {
        const key = `element_${index++}`;
        el.setAttribute('data-translation-id', key);
        texts[key] = el.textContent.trim();
      }
    });

    // Get placeholder texts
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((element) => {
      const el = element as HTMLInputElement | HTMLTextAreaElement;
      if (el.placeholder && el.placeholder.trim().length > 0) {
        const key = `placeholder_${index++}`;
        el.setAttribute('data-translation-id', key);
        texts[key] = el.placeholder.trim();
      }
    });

    return texts;
  };

  // Apply translations to page
  const applyTranslations = (translations: Record<string, string>) => {
    Object.entries(translations).forEach(([id, translatedText]) => {
      const element = document.querySelector(`[data-translation-id="${id}"]`);
      if (!element) return;

      if (id.startsWith('placeholder_')) {
        (element as HTMLInputElement | HTMLTextAreaElement).placeholder = translatedText;
      } else {
        // Preserve any child elements while replacing text
        const childElements = Array.from(element.children);
        element.textContent = translatedText;
        childElements.forEach(child => element.appendChild(child));
      }
    });
  };

  // Main translate function
  const translatePage = async (targetLang: string) => {
    if (isTranslating || targetLang === 'en') {
      setSelectedLanguage(targetLang);
      return;
    }

    setIsTranslating(true);

    try {
      // Check cache first
      const cacheKey = `translations_${window.location.pathname}_${targetLang}`;
      const cachedTranslations = localStorage.getItem(cacheKey);
      
      if (cachedTranslations) {
        const translations = JSON.parse(cachedTranslations);
        applyTranslations(translations);
        setSelectedLanguage(targetLang);
        return;
      }

      // Extract texts to translate
      const textsToTranslate = extractTranslatableText();
      
      if (Object.keys(textsToTranslate).length === 0) {
        setSelectedLanguage(targetLang);
        return;
      }

      // Save original texts if not already saved
      if (Object.keys(originalTexts).length === 0) {
        setOriginalTexts(textsToTranslate);
      }

      // Call translation API
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/translate`, {
        texts: textsToTranslate,
        target_lang: targetLang,
        context: `Web page translation for ${window.location.pathname}`,
      });

      if (response.data.success && response.data.translations) {
        // Apply translations
        applyTranslations(response.data.translations);
        
        // Cache translations
        localStorage.setItem(cacheKey, JSON.stringify(response.data.translations));
        
        // Update language
        setSelectedLanguage(targetLang);
      } else {
        console.error('Translation failed:', response.data.error);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Revert to original language
  const revertToOriginal = () => {
    if (Object.keys(originalTexts).length > 0) {
      applyTranslations(originalTexts);
    }
    setSelectedLanguage('en');
  };

  // Auto-translate when language changes
  useEffect(() => {
    if (selectedLanguage !== 'en') {
      translatePage(selectedLanguage);
    }
  }, [window.location.pathname]); // Retranslate when route changes

  const value: TranslationContextType = {
    selectedLanguage,
    setSelectedLanguage: (lang: string) => {
      if (lang === 'en') {
        revertToOriginal();
      } else {
        translatePage(lang);
      }
    },
    translatePage,
    isTranslating,
    languages: LANGUAGES,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use translation context
export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Language Selector Component
export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { selectedLanguage, setSelectedLanguage, isTranslating, languages } = useTranslation();

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        disabled={isTranslating}
        className="bg-dark-700/80 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500 disabled:opacity-50 appearance-none cursor-pointer hover:bg-dark-600/80 transition-colors"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      
      {isTranslating && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}; 