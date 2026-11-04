'use client';

import React from 'react';
import BodySelector from '@/components/BodySelector';

export default function HumanBodyViewer({ onSelect }) {
  return (
    <div className="w-full h-full min-h-[500px]">
      <BodySelector onSelect={onSelect} />
    </div>
  );
}
