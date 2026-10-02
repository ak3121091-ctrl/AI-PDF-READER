'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/study/WorkspaceShell';

function QuizRoute() {
  const params = useParams();
  const id = (params?.id as string) || 'engineering-physics';

  return <WorkspaceShell initialView="quiz" initialDocId={id} />;
}

export default function DocumentQuizPage() {
  return (
    <Suspense fallback={<div style={{ background: '#29251d', width: '100vw', height: '100vh' }} />}>
      <QuizRoute />
    </Suspense>
  );
}
