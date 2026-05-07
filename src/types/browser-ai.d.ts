interface BrowserLanguageModel {
  prompt(input: string): Promise<string>
  destroy?: () => void
}

interface BrowserLanguageModelFactory {
  availability?: () => Promise<string>
  create: () => Promise<BrowserLanguageModel>
}

interface Window {
  LanguageModel?: BrowserLanguageModelFactory
  ai?: {
    languageModel?: BrowserLanguageModelFactory
  }
}
