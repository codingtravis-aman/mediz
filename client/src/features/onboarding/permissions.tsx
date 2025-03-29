import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Camera, MapPin, Bell, FileText } from 'lucide-react';

const permissions = [
  {
    id: 'camera',
    title: 'Camera Access',
    description: 'Allow Mediz to take pictures of prescriptions for scanning',
    icon: <Camera className="h-5 w-5 text-purple-600" />,
    required: true
  },
  {
    id: 'location',
    title: 'Location Access',
    description: 'For finding nearby clinics and pharmacies',
    icon: <MapPin className="h-5 w-5 text-blue-600" />,
    required: false
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'For medication reminders and health alerts',
    icon: <Bell className="h-5 w-5 text-amber-600" />,
    required: false
  },
  {
    id: 'storage',
    title: 'Storage Access',
    description: 'To save and manage your health records',
    icon: <FileText className="h-5 w-5 text-green-600" />,
    required: true
  }
];

const Permissions = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [enabledPermissions, setEnabledPermissions] = useState<string[]>(
    permissions.filter(p => p.required).map(p => p.id)
  );
  const [_, navigate] = useLocation();

  const handlePermissionToggle = (permissionId: string, enabled: boolean) => {
    if (enabled) {
      setEnabledPermissions(prev => [...prev, permissionId]);
    } else {
      // Don't allow disabling required permissions
      const permission = permissions.find(p => p.id === permissionId);
      if (permission?.required) return;
      
      setEnabledPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleContinue = () => {
    // In a real app, request these permissions from the device
    
    // Mark onboarding as complete
    localStorage.setItem('mediz-onboarding-complete', 'true');
    
    // Navigate to home/dashboard
    navigate('/');
  };

  const allRequiredPermissionsEnabled = permissions
    .filter(p => p.required)
    .every(p => enabledPermissions.includes(p.id));

  const canContinue = acceptedTerms && allRequiredPermissionsEnabled;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-6">
      <div className="max-w-md mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">App Permissions</h1>
            <p className="text-gray-600">These permissions help enhance your experience</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="space-y-6">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start">
                  <div className="mt-0.5 mr-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {permission.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-gray-900">
                        {permission.title}
                        {permission.required && (
                          <span className="ml-2 text-xs text-red-500">Required</span>
                        )}
                      </h3>
                      <Switch 
                        checked={enabledPermissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                        disabled={permission.required}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <Switch
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                />
                <div>
                  <label 
                    htmlFor="terms" 
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    I accept the Terms & Conditions and Privacy Policy
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    By continuing, you acknowledge that you have read and understood our{' '}
                    <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full h-12 rounded-xl shadow-md ${
              canContinue 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          {!canContinue && (
            <p className="text-center text-xs text-red-500 mt-2">
              Please accept the terms and enable all required permissions to continue
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Permissions;