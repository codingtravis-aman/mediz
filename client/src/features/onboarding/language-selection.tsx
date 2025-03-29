import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const languages = [
  { id: 'en', name: 'English', native: 'English' },
  { id: 'hi', name: 'Hindi', native: 'हिंदी' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు' },
  { id: 'mr', name: 'Marathi', native: 'मराठी' },
  { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { id: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [_, navigate] = useLocation();

  const handleContinue = () => {
    // Save selected language
    localStorage.setItem('mediz-language', selectedLanguage);
    // Navigate to registration
    navigate('/onboarding/register');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-6 flex flex-col">
      <div className="max-w-md mx-auto py-10 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Language</h1>
          <p className="text-gray-600">Select the language you're most comfortable with</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl shadow-md p-4 overflow-hidden mb-6 flex-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="grid gap-3">
            {languages.map((language) => (
              <motion.button
                key={language.id}
                variants={item}
                onClick={() => setSelectedLanguage(language.id)}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  selectedLanguage === language.id
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <div className="ml-2">
                    <p className="font-medium text-gray-900">{language.name}</p>
                    <p className="text-sm text-gray-500">{language.native}</p>
                  </div>
                </div>
                {selectedLanguage === language.id && (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button 
            onClick={handleContinue} 
            className="w-full h-12 rounded-xl shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default LanguageSelection;