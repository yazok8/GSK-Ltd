import dynamic from 'next/dynamic';

import React from 'react'

const PrimarySlider = dynamic(() => import('../components/Homepage/PrimarySlider'), { ssr: false });

export default function Homepage() {
  return (
    <>
    <PrimarySlider />
    </>
  )
}
