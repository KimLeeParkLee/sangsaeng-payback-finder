import { Button } from '@/components/ui/button';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 rounded-xl bg-white shadow">
        <h1 className="text-2xl font-semibold mb-4">Vite + React + shadcn/ui</h1>
        <Button onClick={() => alert('Hello!')}>Hello</Button>
      </div>
    </div>
  );
}

export default App;
