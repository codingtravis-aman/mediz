import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const bloodTypes = [
  { value: 'a-positive', label: 'A+' },
  { value: 'a-negative', label: 'A-' },
  { value: 'b-positive', label: 'B+' },
  { value: 'b-negative', label: 'B-' },
  { value: 'ab-positive', label: 'AB+' },
  { value: 'ab-negative', label: 'AB-' },
  { value: 'o-positive', label: 'O+' },
  { value: 'o-negative', label: 'O-' },
  { value: 'unknown', label: 'Unknown' }
];

const formSchema = z.object({
  fullName: z.string().min(3, {
    message: 'Full name must be at least 3 characters',
  }),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  bloodType: z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
});

const ProfileSetup = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: 'prefer-not-to-say',
      bloodType: 'unknown',
      emergencyContact: '',
      medicalConditions: '',
      allergies: '',
    },
  });

  const profileMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return apiRequest({
        url: '/api/users/profile',
        method: 'POST',
        body: values
      });
    },
    onSuccess: () => {
      // Navigate to permissions page after profile setup
      navigate('/onboarding/permissions');
    },
    onError: (error: any) => {
      toast({
        title: 'Profile setup failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    profileMutation.mutate(values);
  };

  const skipProfileSetup = () => {
    navigate('/onboarding/permissions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-6">
      <div className="max-w-md mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Setup Your Profile</h1>
            <p className="text-gray-600">Help us personalize your experience</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            className="h-12 rounded-xl pl-10"
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            placeholder="YYYY-MM-DD"
                            {...field}
                            className="h-12 rounded-xl pl-10"
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genders.map((gender) => (
                              <SelectItem key={gender.value} value={gender.value}>
                                {gender.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bloodType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bloodTypes.map((bloodType) => (
                              <SelectItem key={bloodType.value} value={bloodType.value}>
                                {bloodType.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Emergency contact number" 
                          {...field} 
                          className="h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Any existing medical conditions" 
                          {...field} 
                          className="h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Any allergies to medications" 
                          {...field} 
                          className="h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  disabled={profileMutation.isPending}
                  className={`w-full h-12 rounded-xl shadow-md ${
                    profileMutation.isPending 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  } text-white`}
                >
                  {profileMutation.isPending ? 'Saving Profile...' : 'Save Profile'}
                  {!profileMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>
          </div>

          <Button
            variant="ghost"
            onClick={skipProfileSetup}
            className="w-full h-12 rounded-xl border border-gray-300 hover:bg-gray-100"
          >
            Skip for Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;