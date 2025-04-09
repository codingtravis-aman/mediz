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
import { ArrowRight, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
});

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (values: { username: string }) => 
      // In a real app, this would connect to a backend endpoint
      // For demo, we'll just simulate a successful response
      Promise.resolve({ success: true }),
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: 'Reset link sent',
        description: 'If an account exists with this username, a password reset link has been sent.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Request failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    forgotPasswordMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-6">
      <div className="max-w-md mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            className="flex items-center text-purple-600 mb-8"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </button>
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">
              {isSubmitted 
                ? 'Check your email for reset instructions' 
                : 'Enter your username to receive password reset instructions'}
            </p>
          </div>

          {!isSubmitted ? (
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

                  <Button 
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className={`w-full h-12 rounded-xl shadow-md ${
                      forgotPasswordMutation.isPending 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                    } text-white`}
                  >
                    {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
                    {!forgotPasswordMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-4">
                  We've sent reset instructions to your associated email address.
                </p>
                <p className="text-sm text-gray-500">
                  If you don't see it, please check your spam folder.
                </p>
              </div>
              
              <Button 
                onClick={() => navigate('/login')}
                className="w-full h-12 rounded-xl shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              >
                Return to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;