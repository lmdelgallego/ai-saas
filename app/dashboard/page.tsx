"use client";

import Link from "next/link";
import { Button } from '@/components/ui/button';
import { CreditCard, Edit, Pause, Play, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


type UserPreferences = {
  categories: string[];
  frequency: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const fetchPreferences = async () => {
    const res = await fetch("/api/user-preferences");
    const data = await res.json();

    setPreferences(data.preferences);
  };


  const handlePauseNewsletters = async () => {
    const response = await fetch('/api/user-preferences', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_active: false
      })
    });

    if(response.ok) {
      setPreferences((prev) => (prev ? {...prev, is_active: false} : null));
    }
  }

  const handleActivateNewsletters = async () => {

    const response = await fetch('/api/user-preferences', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_active: true
      })
    });

    if(response.ok) {
      setPreferences((prev) => (prev ? {...prev, is_active: true} : null));
    }
  }

  useEffect(() => {
    fetchPreferences();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Newsletters Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your newsletters, subscribers, and more.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card >
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900">Current Preferences</CardTitle>
            </CardHeader>
            <CardContent>
            {preferences ? (
              <div className="space-y-4">

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg leading-none font-medium w-full text-gray-900">Categories:</h3>
                  <div className="flex flex-wrap gap-2">
                    {preferences.categories.map((category, key) => (
                      <Badge variant="secondary" key={key}>{category}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-lg leading-none font-medium text-gray-900">Frequency:</h3>
                  <p className="text-gray-600 capitalize">{preferences.frequency}</p>
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-lg leading-none font-medium text-gray-900">Email:</h3>
                  <p className="text-gray-600">{preferences.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-lg leading-none font-medium text-gray-900">Status:</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={preferences.is_active ? 'positive' : 'destructive'} className="rounded-full size-3 p-0"></Badge>
                    <span className="text-gray-600">{preferences.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-lg leading-none font-medium text-gray-900">Created At:</h3>
                  <p className="text-gray-600">{new Date(preferences.created_at).toLocaleDateString()}</p>
                </div>

              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  No preferences set yet.
                </p>
                <Link
                  href="/select"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Set Up Preferences
                </Link>
              </div>
            )}
            </CardContent>
          </Card>

          <Card >
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/select">
                    <Edit className="mr-2" size={16} />
                    Update Preferences
                  </Link>
                </Button>

                {preferences?.is_active && (
                  <Button variant="destructive" className="w-full" size="lg" onClick={handlePauseNewsletters}>
                    <Pause className="mr-2" size={16} />
                    Pause Newsletters
                  </Button>
                )}

                {!preferences?.is_active && (
                  <Button variant="positive" className="w-full" size="lg" onClick={handleActivateNewsletters}>
                    <Play className="mr-2" size={16} />
                    Activate Newsletters
                  </Button>
                )}

                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href="/subscriptions">
                    <CreditCard className="mr-2" size={16} />
                    Manager Subscriptions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )
}