"use client";

import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className='hover:cursor-pointer'>
      <IoArrowBack size={24} />
    </button>
  );
};

export default BackButton;
