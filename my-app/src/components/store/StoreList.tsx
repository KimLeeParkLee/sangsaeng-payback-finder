import type { Store } from '@/types/store';
import { Button } from '@/components/ui/button';

type Props = {
  stores: Store[];
  onSelect?: (store: Store) => void;
  onJudge?: (store: Store) => void;
};

export function StoreList({ stores, onSelect, onJudge }: Props) {
  return (
    <div className="space-y-2">
      {stores.map((s) => (
        <div
          key={s.id || `${s.name}-${s.lat}-${s.lng}`}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div>
            <div className="font-medium">
              {s.name}{' '}
              {s.recognized !== undefined && (
                <span
                  className={
                    'ml-2 rounded px-2 py-0.5 text-xs ' +
                    (s.recognized
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700')
                  }
                >
                  {s.recognized ? '인정' : '불인정'}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {s.address}
              {typeof s.distanceMeters === 'number' && (
                <span className="ml-2 tabular-nums">· {Math.round(s.distanceMeters)}m</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => onSelect?.(s)}>
              상세
            </Button>
            <Button size="sm" onClick={() => onJudge?.(s)}>
              판별
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StoreList;
