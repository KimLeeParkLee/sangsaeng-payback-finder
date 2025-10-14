import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function CheckPage() {
  const [q, setQ] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const onCheck = () => {
    // TODO: /api/check 호출 → 인정/불인정 결과
    setResult(`"${q}" 판별 결과: (샘플) 불인정`);
  };

  return (
    <div className="p-4">
      <h2 className="mb-3 text-xl font-semibold">매장 판별</h2>
      <div className="mb-3 flex gap-2">
        <Input placeholder="상호명 또는 주소" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button onClick={onCheck}>판별</Button>
      </div>
      {result && <div className="rounded-lg border p-3">{result}</div>}
      <div className="mt-3 text-sm text-muted-foreground">판별 결과에 대한 피드백 입력 기능을 추가할 수 있습니다.</div>
    </div>
  );
}

