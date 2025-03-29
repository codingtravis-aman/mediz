import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  const [_, navigate] = useLocation();

  useEffect(() => {
    // Auto-navigate to language selection after a delay
    const timer = setTimeout(() => {
      navigate('/onboarding/language');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <div className="bg-white rounded-full p-5 w-32 h-32 mx-auto mb-8 shadow-lg flex items-center justify-center">
          <div className="text-6xl bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text font-bold">
            M
          </div>
        </div>

        <motion.h1 
          className="text-4xl font-bold text-white mb-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          MEDIZ
        </motion.h1>
        
        <motion.p 
          className="text-blue-100 text-lg max-w-xs mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Your personal medication assistant
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto" />
      </motion.div>
    </div>
  );
};

export default SplashScreen;