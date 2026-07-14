import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <DashboardPage title={title} description={description}>
      <Card className="max-w-2xl shadow-sm">
        <CardContent className="px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            This screen is scaffolded for the rebuild. Content will land in the next pass.
          </p>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
