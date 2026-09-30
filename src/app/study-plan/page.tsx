'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudyPlanRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('studyforge_mode', 'workspace');
    }
    router.replace('/?view=study-plan&workspace=true');
  }, [router]);

  return (
    <div style={{ background: '#29251d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c3a47b' }}>
      Loading study plan in workspace...
    </div>
  );
}
