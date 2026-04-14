import { Navbar } from '@/components/layout/Navbar'
import React from 'react'

export default function CommonLayOut({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
            {/* <Footer /> */}
        </div>
    )
}
