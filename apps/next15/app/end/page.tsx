import { Suspense } from 'react';
import { EndingPage } from './_comp/ending-page';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-black">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <EndingPage />
    </Suspense>
  );
}
