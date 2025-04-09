import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRight, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters',
  }),
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  confirmPassword: z.string().min(6, {
    message: 'Confirm password must be at least 6 characters',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: (values: { username: string; fullName: string; password: string }) => {
      return apiRequest({
        url: '/api/auth/register',
        method: 'POST',
        body: values
      });
    },
    onSuccess: () => {
      // Navigate to profile setup page after successful registration
      navigate('/onboarding/profile');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { username, fullName, password } = values;
    registerMutation.mutate({ username, fullName, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-6">
      <div className="max-w-md mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join Mediz to manage your medications effectively</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
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
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            {...field}
                            className="h-12 rounded-xl pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            {...field}
                            className="h-12 rounded-xl pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  disabled={registerMutation.isPending}
                  className={`w-full h-12 rounded-xl shadow-md ${
                    registerMutation.isPending 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  } text-white`}
                >
                  {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                  {!registerMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  className="text-purple-600 hover:underline font-medium"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;