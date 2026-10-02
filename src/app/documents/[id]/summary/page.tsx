'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/study/WorkspaceShell';

function SummaryRoute() {
  const params = useParams();
  const id = (params?.id as string) || 'engineering-physics';

  return <WorkspaceShell initialView="summary" initialDocId={id} />;
}

export default function DocumentSummaryPage() {
  return (
    <Suspense fallback={<div style={{ background: '#29251d', width: '100vw', height: '100vh' }} />}>
      <SummaryRoute />
    </Suspense>
  );
}
