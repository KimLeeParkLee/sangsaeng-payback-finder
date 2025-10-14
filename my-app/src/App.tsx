import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { api } from '@/api/client';
import HomePage from '@/pages/Home/HomePage';

function App() {
  const [checkMsg, setCheckMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const checkBackend = async () => {
    setLoading(true);
    setCheckMsg('요청 중...');
    try {
      const res = await api.get('connectivity-probe', {
        // 어떤 상태코드든 성공으로 처리해서 바로 확인
        validateStatus: () => true,
        params: { t: Date.now() },
      });
      setCheckMsg(`응답 수신: status=${res.status} (${res.statusText || 'no statusText'})`);
    } catch (e: any) {
      const code = e?.code ? ` code=${e.code}` : '';
      setCheckMsg(`네트워크 오류: ${e?.message || 'unknown error'}${code}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <h1 className="text-lg font-semibold">상생 페이백 파인더</h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={checkBackend} disabled={loading}>
              {loading ? '확인 중...' : '백엔드 체크'}
            </Button>
          </div>
        </div>
        {checkMsg && (
          <div className="border-t bg-amber-50 p-2 text-center text-sm text-amber-800">
            {checkMsg}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-5xl">
        <HomePage />
      </main>
    </div>
  );
}

export default App;
