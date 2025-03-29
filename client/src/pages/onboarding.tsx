
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [, navigate] = useLocation();

  const steps = {
    1: {
      title: "Welcome to Mediz",
      subtitle: "Your Health, Our Priority",
      component: (
        <div className="space-y-4">
          <Button onClick={() => setStep(2)} className="w-full">
            Get Started
          </Button>
          <Button variant="outline" onClick={() => navigate('/home')} className="w-full">
            Skip Intro
          </Button>
        </div>
      )
    },
    2: {
      title: "Choose Language",
      subtitle: "Select your preferred language",
      component: (
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => setStep(3)}>English</Button>
          <Button onClick={() => setStep(3)}>हिंदी</Button>
        </div>
      )
    },
    3: {
      title: "App Permissions",
      subtitle: "Help us serve you better",
      component: (
        <div className="space-y-4">
          <Button onClick={() => navigate('/home')} className="w-full">
            Allow & Continue
          </Button>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            {steps[step as keyof typeof steps].title}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {steps[step as keyof typeof steps].subtitle}
          </p>
          {steps[step as keyof typeof steps].component}
        </Card>
      </motion.div>
    </div>
  );
}
