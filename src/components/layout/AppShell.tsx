import ManaOrb from '../floating/ManaOrb';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto p-4 max-w-3xl">
        {children}
      </div>
      <ManaOrb />
    </div>
  );
}