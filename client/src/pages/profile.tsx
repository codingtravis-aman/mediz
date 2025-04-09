import { FC, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEMO_USER_ID } from '@/lib/api';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const Profile: FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  
  const { data: user, isLoading, refetch } = useQuery<User>({
    queryKey: ['/api/users', DEMO_USER_ID],
    queryFn: () => apiRequest({
      url: `/api/users/${DEMO_USER_ID}`
    }),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await apiRequest({
        url: '/api/users/profile',
        method: 'POST',
        body: { fullName }
      });
      
      toast({
        title: 'प्रोफाइल अपडेट किया गया',
        description: 'आपकी प्रोफाइल सफलतापूर्वक अपडेट हो गई है',
      });
      
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast({
        title: 'त्रुटि',
        description: 'प्रोफाइल अपडेट करने में समस्या हुई',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 px-4 max-w-lg mx-auto">
        <Card className="w-full shadow-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">प्रोफाइल लोड हो रहा है...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 max-w-lg mx-auto">
      <Card className="w-full shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>
            View and update your profile information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="h-32 w-32 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center shadow-md">
              <span className="text-white text-4xl font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={user?.username || ''} readOnly disabled className="bg-gray-50" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            {isEditing ? (
              <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
              />
            ) : (
              <Input id="fullName" value={user?.fullName || ''} readOnly disabled className="bg-gray-50" />
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full">Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;