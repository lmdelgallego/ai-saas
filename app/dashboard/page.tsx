import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Edit } from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <div>
        <h1>Your Newsletters Dashboard</h1>
        <p>Manage your newsletters, subscribers, and more.</p>
      </div>

      <div>
        <div>
          <h2>Current Preferences</h2>
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
        </div>

        <div>
          <h2>Actions</h2>
          <div>
            <Button variant="outline" asChild>
              <Link href="/select">
                <Edit className="mr-2" size={16} />
                Update Preferences
              </Link>
            </Button>
          </div>
        </div>


      </div>
    </div>
  )
}