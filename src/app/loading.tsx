import React from 'react'

export default function LoadingPage() {
    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4 bg-zinc-50 font-sans dark:bg-black text-red-500'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
        </div>
    )
}