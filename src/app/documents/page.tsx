'use client';

import React, { Suspense } from 'react';
import { WorkspaceShell } from '@/components/study/WorkspaceShell';

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div style={{ background: '#29251d', width: '100vw', height: '100vh' }} />}>
      <WorkspaceShell initialView="documents" />
    </Suspense>
  );
}
