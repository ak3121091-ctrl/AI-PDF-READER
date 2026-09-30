'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const upload = searchParams.get('upload') === 'true';
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('studyforge_mode', 'workspace');
    }
    router.replace(upload ? '/?view=documents&upload=true&workspace=true' : '/?view=dashboard&workspace=true');
  }, [router, searchParams]);

  return (
    <div style={{ background: '#29251d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c3a47b' }}>
      Redirecting to unified StudyForge workspace...
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ background: '#29251d', minHeight: '100vh' }} />}>
      <RedirectContent />
    </Suspense>
  );
}
