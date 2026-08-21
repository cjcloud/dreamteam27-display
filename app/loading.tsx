'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-onyx pitch-bg flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tangerine"></div>
        <p className="text-timber text-lg">Loading...</p>
      </div>
    </div>
  );
}
