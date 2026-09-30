'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function TopicsRedirect({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('studyforge_mode', 'workspace');
    }
    router.replace(`/?view=topics&docId=${resolvedParams.id}&workspace=true`);
  }, [router, resolvedParams.id]);

  return (
    <div style={{ background: '#29251d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c3a47b' }}>
      Loading topics in workspace...
    </div>
  );
}
