import React, { useState } from 'react'

export default function FAQ({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <div>
      {items.map((item, i) => (
        <div className="faq-item" key={i}>
          <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{item.q}</span>
            <span className="faq-toggle">{open === i ? '×' : '+'}</span>
          </div>
          {open === i && <div className="faq-a">{item.a}</div>}
        </div>
      ))}
    </div>
  )
}
