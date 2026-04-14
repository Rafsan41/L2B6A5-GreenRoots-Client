import React from 'react'

export default async function MedicinesPage() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // throw new Error("Something went wrong")
    return (
        <div>
            <h1>MedicinesPage</h1>
        </div>
    )
}