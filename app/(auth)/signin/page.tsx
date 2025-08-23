"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from "@/lib/client";
import { CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function SignIn() {

  const [isSignUp, setIsSignUp] = useState(false);
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      if(isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })
        if(error) throw error;
        setMessage("Check your email for confirmation link");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if(error) throw error;
        router.push("/dashboard");
      }

    }
    catch(err){
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12px-4sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personalize AI Newsletters</h1>
          <p  className="text-xl text-gray-600">{isSignUp ? "Create Your Account" : "Sign in to your account"}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleAuth} className="space-y-6">
            {message && (
              <Alert >
                <CheckCircle2Icon />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" required onChange={handleChange} value={formData.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" name="password" required onChange={handleChange} value={formData.password} />
              <a href="/forgot-password" className="text-sm text-right">
                Forgot password?
              </a>
            </div>

            <div>
              <Button className="w-full" type="submit">
                {isSignUp ? "Create Account" : "Sign in"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Button onClick={() => setIsSignUp(prev => !prev)} variant={
              "link"
            } >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}