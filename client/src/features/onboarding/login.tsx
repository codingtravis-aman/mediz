import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '../../hooks/use-toast';
import { apiRequest } from '../../lib/queryClient';
import { motion } from 'framer-motion';
import { ArrowRight, EyeIcon, EyeOffIcon } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (values: { username: string; password: string }) => {
      return apiRequest({
        url: '/api/auth/login', 
        method: 'POST', 
        body: values
      });
    },
    onSuccess: () => {
      // Set authentication state
      localStorage.setItem('mediz-authenticated', 'true');
      
      // Navigate to home page after successful login
      navigate('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid username or password. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(values);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to manage your medications with Mediz</p>
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
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
                      <div className="text-right">
                        <button 
                          type="button"
                          className="text-sm text-purple-600 hover:underline"
                          onClick={() => navigate('/forgot-password')}
                        >
                          Forgot password?
                        </button>
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  disabled={loginMutation.isPending}
                  className={`w-full h-12 rounded-xl shadow-md ${
                    loginMutation.isPending 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  } text-white`}
                >
                  {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                  {!loginMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  className="text-purple-600 hover:underline font-medium"
                  onClick={() => navigate('/onboarding/register')}
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;