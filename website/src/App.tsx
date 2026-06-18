import { useState } from 'react'
import { AiAssistantSection } from './components/AiAssistantSection'
import { ContactSection } from './components/ContactSection'
import { DownloadSection } from './components/DownloadSection'
import { Footer } from './components/Footer'
import { HeroSection } from './components/HeroSection'
import { LiveSignalsSection } from './components/LiveSignalsSection'
import { ProductSystemSection } from './components/ProductSystemSection'
import { SiteShell } from './components/SiteShell'
import { TemplateSection } from './components/TemplateSection'
import { ThesisSection } from './components/ThesisSection'
import { siteContent } from './data/content'
import type { Language } from './data/content'

export function App() {
  const [language, setLanguage] = useState<Language>('en')
  const copy = siteContent[language]

  return (
    <SiteShell copy={copy} language={language} onLanguageChange={setLanguage}>
      <HeroSection copy={copy} />
      <ThesisSection copy={copy} />
      <ProductSystemSection copy={copy} />
      <TemplateSection copy={copy} />
      <LiveSignalsSection copy={copy} />
      <AiAssistantSection copy={copy} />
      <DownloadSection copy={copy} />
      <ContactSection copy={copy} />
      <Footer copy={copy} />
    </SiteShell>
  )
}
