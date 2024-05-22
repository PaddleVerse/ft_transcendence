'use client';
import React from 'react';
import { useGlobalState } from '../components/Sign/GlobalState';

interface Props {
  children: React.ReactNode;
}

function TestWrapper({ children }: Props) {
  const { state } = useGlobalState();
  if (!state) return null;
  const { user, socket } = state;
  return (
    <>
      {(user && socket) ? children : null}
    </>
  );
}

export default TestWrapper;
