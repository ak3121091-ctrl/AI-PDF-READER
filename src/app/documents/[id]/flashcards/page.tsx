'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/study/WorkspaceShell';

function FlashcardsRoute() {
  const params = useParams();
  const id = (params?.id as string) || 'engineering-physics';

  return <WorkspaceShell initialView="flashcards" initialDocId={id} />;
}

export default function DocumentFlashcardsPage() {
  return (
    <Suspense fallback={<div style={{ background: '#29251d', width: '100vw', height: '100vh' }} />}>
      <FlashcardsRoute />
    </Suspense>
  );
}
