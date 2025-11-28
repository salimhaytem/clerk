import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your dashboard. View agencies and contacts below.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <CardTitle>Agencies</CardTitle>
            </div>
            <CardDescription>
              View all agencies in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Browse through all available agencies with their details including location, type, and statistics.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/agencies">View Agencies</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <CardTitle>Contacts</CardTitle>
            </div>
            <CardDescription>
              View contacts (50 per day limit)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Access contact information for agency employees. You can view up to 50 contacts per day.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/contacts">View Contacts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

