import { useState, useEffect } from 'react';
import { ArrowRight, X, Volume2, Copy, Check } from 'lucide-react';

const TranslationApp = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('french');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [languages, setLanguages] = useState([
    {code: 'arabic', name: 'Arabic'},
    {code: 'french', name: 'French'},
    {code: 'german', name: 'German'},
    {code: 'italian', name: 'Italian'}
  ]);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          target_language: targetLanguage
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTranslatedText(data.translation);
      } else {
        console.error('Translation error:', data.error);
        setTranslatedText('Translation error occurred');
      }
    } catch (error) {
      console.error('Network error:', error);
      setTranslatedText('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleTranslate();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [inputText, targetLanguage]);

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLangCode(lang);
    window.speechSynthesis.speak(utterance);
  };

  const getLangCode = (lang) => {
    const langMap = {
      'french': 'fr-FR',
      'german': 'de-DE',
      'italian': 'it-IT',
      'arabic': 'ar-SA',
      'english': 'en-US'
    };
    return langMap[lang] || 'en-US';
  };

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Translation App</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto flex-1 p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Language selection */}
          <div className="flex border-b p-4 bg-gray-50">
            <div className="flex items-center">
              <span className="font-medium mr-2 text-black">English</span>
            </div>
            <div className="mx-2 flex items-center">
              <ArrowRight size={20} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="p-2 border rounded-md w-40 text-black"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Translation area */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
            {/* Input */}
            <div className="p-4 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-64 resize-none p-2 focus:outline-none"
                placeholder="Enter text to translate"
              ></textarea>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {inputText && (
                  <>
                    <button 
                      onClick={handleClear} 
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={() => speakText(inputText, 'english')}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Volume2 size={18} />
                    </button>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {inputText.length} characters
              </div>
            </div>

            {/* Output */}
            <div className="p-4 relative bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="h-64 p-2 overflow-auto text-black">
                  {translatedText}
                </div>
              )}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {translatedText && (
                  <>
                    <button
                      onClick={() => speakText(translatedText, targetLanguage)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Volume2 size={18} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(translatedText)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        <p>Translation App powered by Machine Learning</p>
      </footer>
    </div>
  );
};

export default TranslationApp;