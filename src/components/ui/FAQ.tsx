import { useState } from 'react'
import type { FAQ } from '../../types'

interface FAQProps {
  items: FAQ[]
}

export default function FAQ({ items }: FAQProps) {
  const [open, setOpen] = useState(0)

  return (
    <div>
      {items.map((item, i) => (
        <div className="border-b border-border" key={i}>
          <div
            className="py-4 flex items-center justify-between cursor-pointer font-medium text-span hover:text-secondary transition-colors"
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            <span>{item.q}</span>
            <span className="text-secondary text-xl font-light flex-shrink-0 ml-4">
              {open === i ? '×' : '+'}
            </span>
          </div>
          {open === i && (
            <div className="pb-4 text-muted text-label leading-[1.7]">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  )
}
