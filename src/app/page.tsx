'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch('/api/test')
        const data = await res.json()
        console.log('API Response:', data)
      } catch (err) {
        console.error('API Error:', err)
      }
    }

    fetchTest()
  }, [])

  return (
      <main className="p-4">
        <h1 className="text-xl font-bold">Check console for API response</h1>
      </main>
  )
}
