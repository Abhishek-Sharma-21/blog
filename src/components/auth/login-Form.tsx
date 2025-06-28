'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

//schema ->

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

//Type Inference for Form Data
type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  //initialize form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onLoginSubmit = async (values: LoginFormData)=>{
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        
          email: values.email,
          password: values.password,
        }),
      });
      if(response.ok){
        toast.success("Login Successfully")
        // Redirect to home page and refresh authentication state
        window.location.href = "/";
      }else{
        console.log("Something went wrong");
        
      }
      console.log(values);
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-6">
        <FormField control={form.control} name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email" />
              </FormControl>
              <FormMessage/>

            </FormItem>
          )}
        >

        </FormField>
        <FormField control={form.control} name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="password" />
              </FormControl>
              <FormMessage/>

            </FormItem>
          )}
        >

        </FormField>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;