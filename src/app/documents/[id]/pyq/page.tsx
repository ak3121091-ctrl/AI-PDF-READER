'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/study/WorkspaceShell';

function PyqRoute() {
  const params = useParams();
  const id = (params?.id as string) || 'engineering-physics';

  return <WorkspaceShell initialView="pyq" initialDocId={id} />;
}

export default function PYQAnalyzerPage() {
  return (
    <Suspense fallback={<div style={{ background: '#29251d', width: '100vw', height: '100vh' }} />}>
      <PyqRoute />
    </Suspense>
  );
}
