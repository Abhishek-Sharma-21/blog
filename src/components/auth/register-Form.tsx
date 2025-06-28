'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

//schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters long')
}).refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ['confirmPassword'] });

type RegisterFormData = z.infer<typeof registerSchema>



function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  //initialize form
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onRegisterSubmit = async (values: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      if(response.ok){
        toast.success("Registration Successfully")
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
      <form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-6">
        <FormField control={form.control} name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} type="name" placeholder="name" />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        >

        </FormField>
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
        <FormField control={form.control} name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="confirmPassword" placeholder="confirmPassword" />
              </FormControl>
              <FormMessage/>

            </FormItem>
          )}
        >

        </FormField>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;