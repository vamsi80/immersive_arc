// src/app/home/page.tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to the Home Page 🎉</h1>
        <p className="text-muted-foreground">You are now signed in!</p>
      </div>
    </main>
  );
}
