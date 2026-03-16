import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Community } from "@/types";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 pb-2 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
          <Image
            src={community.logo || "/placeholder.svg?height=100&width=100"}
            alt={community.name}
            fill
            className="object-contain p-2"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{community.name}</h3>
          <p className="text-sm text-muted-foreground">{community.college}</p>
        </div>
      </div>
      <CardContent className="px-6 pb-0">
        {community.description && (
          <p className="text-muted-foreground mb-4">{community.description}</p>
        )}
      </CardContent>
      {community.website && (
        <CardFooter className="p-6 mt-auto">
          <Button variant="outline" className="w-full" asChild>
            <a
              href={community.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
