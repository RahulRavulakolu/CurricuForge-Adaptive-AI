import React from 'react';

// Minimal no-op Toaster used during build to avoid UI module export issues.
// This preserves the `Toaster` export shape while avoiding deep UI imports.
export function Toaster() {
  return null;
}

export default Toaster;