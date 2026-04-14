"use client"

import React, { useEffect } from 'react'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    useEffect(() => {
        console.log(error)
    }, [error])
    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4 bg-zinc-50 font-sans dark:bg-black text-red-500'>
            <h1 className='text-2xl font-bold'>Something Went Wrong: Please Try Again Later</h1>
            <button className='bg-primary text-primary-foreground px-4 py-2 rounded-md' onClick={() => window.history.back()}>go back</button>
        </div>
    )
}