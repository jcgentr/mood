'use client'

import { useState } from 'react'

export default function Editor({ entry }: { entry: any }) {
  const [value, setValue] = useState(entry.content)

  return (
    <div className="h-full">
      <textarea
        className="w-full h-full p-8 text-xl outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
