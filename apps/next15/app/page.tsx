import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <main className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">채팅</h1>
        </div>

        {/* Chat List */}
        <div className="space-y-2">
          <Link href="/chat">
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-4 p-4">
                {/* Avatar */}
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1762325658409-5d8aa0e43261?q=80&w=1072&auto=format&fit=crop"
                    alt="민지"
                  />
                  <AvatarFallback>민지</AvatarFallback>
                </Avatar>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-semibold text-foreground">민지</h2>
                    <span className="text-xs text-muted-foreground">오후 2:30</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      안녕! 오늘 기분이 어때?
                    </p>
                    <Badge variant="default" className="ml-2 shrink-0">
                      1
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
