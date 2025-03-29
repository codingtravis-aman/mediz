import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePWA } from '@/hooks/use-pwa';

const Settings: FC = () => {
  const { toast } = useToast();
  const { isStandalone, installPrompt, isInstallable } = usePWA();

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          toast({
            title: 'Notifications Enabled',
            description: 'You will now receive medication reminders',
          });
        } else {
          toast({
            title: 'Permission Denied',
            description: 'Please enable notifications in your browser settings',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not enable notifications',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Notifications Disabled',
        description: 'You will no longer receive medication reminders',
      });
    }
  };

  const handleInstall = async () => {
    try {
      await installPrompt();
      toast({
        title: 'Installation Started',
        description: 'Follow the prompts to install the app',
      });
    } catch (error) {
      toast({
        title: 'Installation Failed',
        description: 'Could not initiate app installation',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="pt-20 px-4 max-w-lg mx-auto pb-20">
      <Card className="w-full shadow-md mb-6">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* App Installation */}
          {!isStandalone && isInstallable && (
            <div className="flex flex-col space-y-2">
              <Label>App Installation</Label>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Install Mediz as a standalone app</p>
                <Button onClick={handleInstall} size="sm" variant="outline">Install</Button>
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="notifications">Notifications</Label>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Medication reminders</span>
              <Switch 
                id="notifications" 
                onCheckedChange={handleNotificationToggle} 
                defaultChecked={Notification.permission === 'granted'} 
              />
            </div>
          </div>

          {/* Language */}
          <div className="flex flex-col space-y-2">
            <Label>Language</Label>
            <RadioGroup defaultValue="en" className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lang-en" className="text-sm font-normal text-gray-500">English</Label>
                <RadioGroupItem value="en" id="lang-en" />
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <Label htmlFor="lang-hi" className="text-sm font-normal text-gray-500">हिंदी (Hindi)</Label>
                <RadioGroupItem value="hi" id="lang-hi" />
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <Label htmlFor="lang-bn" className="text-sm font-normal text-gray-500">বাংলা (Bengali)</Label>
                <RadioGroupItem value="bn" id="lang-bn" />
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <Label htmlFor="lang-ta" className="text-sm font-normal text-gray-500">தமிழ் (Tamil)</Label>
                <RadioGroupItem value="ta" id="lang-ta" />
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <Label htmlFor="lang-te" className="text-sm font-normal text-gray-500">తెలుగు (Telugu)</Label>
                <RadioGroupItem value="te" id="lang-te" />
              </div>
            </RadioGroup>
          </div>

          {/* Theme */}
          <div className="flex flex-col space-y-2">
            <Label>Theme</Label>
            <RadioGroup defaultValue="light" className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-light" className="text-sm font-normal text-gray-500">Light</Label>
                <RadioGroupItem value="light" id="theme-light" />
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <Label htmlFor="theme-dark" className="text-sm font-normal text-gray-500">Dark</Label>
                <RadioGroupItem value="dark" id="theme-dark" />
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <Label htmlFor="theme-system" className="text-sm font-normal text-gray-500">System Default</Label>
                <RadioGroupItem value="system" id="theme-system" />
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>About Mediz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Version</p>
            <p className="text-sm text-gray-500">1.0.0</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Privacy Policy</p>
            <p className="text-sm text-gray-500">
              <a href="#" className="text-blue-500 hover:underline">View our privacy policy</a>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Terms of Service</p>
            <p className="text-sm text-gray-500">
              <a href="#" className="text-blue-500 hover:underline">View our terms of service</a>
            </p>
          </div>
          <Button variant="outline" className="w-full mt-4">Log Out</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;