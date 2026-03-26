import { useState, useEffect, useRef, useMemo } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WEEKDAYS   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function pad(n: number) { return String(n).padStart(2, '0') }

function parseISO(s: string) {
  if (!s) return null
  const [dp, tp = '00:00'] = s.split('T')
  const [y, mo, d] = dp.split('-').map(Number)
  const [h, m]     = tp.split(':').map(Number)
  return { date: new Date(y, mo - 1, d), hour: h, minute: m }
}

function toISO(date: Date, h: number, m: number) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(h)}:${pad(m)}`
}

function formatDisplay(s: string) {
  const p = parseISO(s)
  if (!p) return ''
  const { date, hour, minute } = p
  const mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12  = hour % 12 || 12
  return `${date.getDate()} ${mons[date.getMonth()]} ${date.getFullYear()}  ${pad(h12)}:${pad(minute)} ${ampm}`
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate()
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  value:        string
  onChange:     (v: string) => void
  min?:         string
  placeholder?: string
}

export default function DateTimePicker({ value, onChange, min, placeholder = 'Select date & time' }: Props) {
  const today     = useMemo(() => new Date(), [])
  const minParsed = useMemo(() => (min ? parseISO(min) : null), [min])
  const parsed    = useMemo(() => (value ? parseISO(value) : null), [value])

  const [open,       setOpen]       = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const [viewYear,   setViewYear]   = useState(() => parsed?.date.getFullYear() ?? today.getFullYear())
  const [viewMonth,  setViewMonth]  = useState(() => parsed?.date.getMonth()    ?? today.getMonth())
  const [draftDate,  setDraftDate]  = useState<Date | null>(() => parsed?.date ?? null)
  const [draftHour,  setDraftHour]  = useState(() => parsed?.hour   ?? today.getHours())
  const [draftMinute,setDraftMinute]= useState(() => {
    const raw = parsed?.minute ?? today.getMinutes()
    return Math.ceil(raw / 5) * 5 % 60
  })

  // Sync draft when value is changed externally (e.g. cleared by parent)
  useEffect(() => {
    const p = parseISO(value)
    if (p) {
      setDraftDate(p.date)
      setDraftHour(p.hour)
      setDraftMinute(p.minute)
    } else {
      setDraftDate(null)
    }
  }, [value])

  // Close on outside click
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef   = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // ── Open ─────────────────────────────────────────────────────────────────
  function openPicker() {
    // Decide direction: open upward if not enough space below
    if (triggerRef.current) {
      const rect       = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 360)
    }
    // Sync view + draft to committed value
    const p   = parsed
    const ref = p?.date ?? today
    setViewYear(ref.getFullYear())
    setViewMonth(ref.getMonth())
    if (p) {
      setDraftDate(p.date)
      setDraftHour(p.hour)
      setDraftMinute(p.minute)
    }
    setOpen(true)
  }

  // ── Calendar grid ─────────────────────────────────────────────────────────
  const cells = useMemo<(Date | null)[]>(() => {
    const firstDow    = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const grid: (Date | null)[] = Array(firstDow).fill(null)
    for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(viewYear, viewMonth, d))
    while (grid.length % 7 !== 0) grid.push(null)
    return grid
  }, [viewYear, viewMonth])

  // ── Month navigation ──────────────────────────────────────────────────────
  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }
  function canGoPrev() {
    if (!minParsed) return true
    const prev = new Date(viewYear, viewMonth - 1, 1)
    const minM = new Date(minParsed.date.getFullYear(), minParsed.date.getMonth(), 1)
    return prev >= minM
  }

  // ── Date selection ────────────────────────────────────────────────────────
  function isDisabled(date: Date) {
    if (!minParsed) return false
    return startOfDay(date) < startOfDay(minParsed.date)
  }

  function selectDate(date: Date) {
    if (isDisabled(date)) return
    setDraftDate(date)
    if (minParsed && sameDay(date, minParsed.date)) {
      if (draftHour < minParsed.hour ||
         (draftHour === minParsed.hour && draftMinute < minParsed.minute)) {
        setDraftHour(minParsed.hour)
        setDraftMinute(Math.ceil(minParsed.minute / 5) * 5 % 60)
      }
    }
  }

  // ── Time spinners ─────────────────────────────────────────────────────────
  // 12-hour display helpers (internal draftHour stays 0-23)
  const displayHour = draftHour % 12 || 12          // 1-12
  const amPm        = draftHour >= 12 ? 'PM' : 'AM'

  function adjustHour(delta: number) {
    // Cycle 1→2→...→12→1 within the current AM/PM half
    const newDisplay  = (displayHour - 1 + delta + 12) % 12 + 1  // always 1-12
    const newH        = amPm === 'AM'
      ? (newDisplay === 12 ? 0 : newDisplay)
      : (newDisplay === 12 ? 12 : newDisplay + 12)
    if (minParsed && draftDate && sameDay(draftDate, minParsed.date) && newH < minParsed.hour) return
    if (minParsed && draftDate && sameDay(draftDate, minParsed.date) &&
        newH === minParsed.hour && draftMinute < minParsed.minute) {
      setDraftMinute(Math.ceil(minParsed.minute / 5) * 5 % 60)
    }
    setDraftHour(newH)
  }

  function toggleAmPm() {
    const newH = draftHour >= 12 ? draftHour - 12 : draftHour + 12
    if (minParsed && draftDate && sameDay(draftDate, minParsed.date) && newH < minParsed.hour) return
    setDraftHour(newH)
  }

  function adjustMinute(delta: number) {
    const newM = (draftMinute + delta * 5 + 60) % 60
    if (minParsed && draftDate && sameDay(draftDate, minParsed.date) &&
        draftHour === minParsed.hour && newM < minParsed.minute) return
    setDraftMinute(newM)
  }

  // ── Apply / Cancel ────────────────────────────────────────────────────────
  function apply() {
    if (!draftDate) return
    onChange(toISO(draftDate, draftHour, draftMinute))
    setOpen(false)
  }
  function cancel() {
    const p = parseISO(value)
    if (p) { setDraftDate(p.date); setDraftHour(p.hour); setDraftMinute(p.minute) }
    setOpen(false)
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative">

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openPicker}
        className="relative w-full bg-transparent pl-[22px] py-0 pr-0 text-left font-body outline-none cursor-pointer border-none"
      >
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none flex items-center">
          <CalendarDays size={14} />
        </span>
        <span className={`text-[14px] ${value ? 'text-primary' : 'text-[#aaa]'}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className={[
            'absolute left-0 right-0 bg-white rounded-xl z-[500] overflow-y-auto',
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2',
          ].join(' ')}
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.22)', maxHeight: 'min(380px, 70vh)' }}
        >

          {/* Month navigation */}
          <div className="flex items-center justify-between px-3 pt-3 pb-1">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev()}
              className="w-7 h-7 rounded-full flex items-center justify-center text-primary transition-colors hover:bg-[#F1F5F9] disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-head font-semibold text-primary text-[12px] select-none">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center text-primary transition-colors hover:bg-[#F1F5F9]"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Calendar */}
          <div className="px-2 pb-2">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-0.5">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-muted py-0.5 select-none">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {cells.map((date, i) => {
                if (!date) return <div key={i} />
                const disabled = isDisabled(date)
                const selected = draftDate ? sameDay(date, draftDate) : false
                const isToday  = sameDay(date, today)
                return (
                  <div key={i} className="flex items-center justify-center py-px">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => selectDate(date)}
                      className={[
                        'relative w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all select-none',
                        disabled  ? 'text-[#CBD5E1] cursor-not-allowed' : 'cursor-pointer',
                        selected  ? 'text-white font-bold' : '',
                        !selected && !disabled ? 'hover:bg-[#F1F5F9]' : '',
                      ].join(' ')}
                      style={selected ? { background: '#FFC857' } : undefined}
                    >
                      {date.getDate()}
                      {isToday && !selected && (
                        <span
                          className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full"
                          style={{ background: '#FFC857' }}
                        />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-[#E2E8F0]" />

          {/* Time picker */}
          <div className="px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted uppercase tracking-widest select-none">Time</span>
              <div className="flex items-center gap-1">

                {/* Hour */}
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => adjustHour(-1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-primary transition-colors hover:bg-[#F1F5F9]">
                    <ChevronDown size={13} />
                  </button>
                  <span className="text-[15px] font-bold text-primary font-head w-8 text-center tabular-nums leading-none select-none">
                    {pad(displayHour)}
                  </span>
                  <button type="button" onClick={() => adjustHour(1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-primary transition-colors hover:bg-[#F1F5F9]">
                    <ChevronUp size={13} />
                  </button>
                </div>

                <span className="text-[15px] font-bold text-[#CBD5E1] select-none">:</span>

                {/* Minute */}
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => adjustMinute(-1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-primary transition-colors hover:bg-[#F1F5F9]">
                    <ChevronDown size={13} />
                  </button>
                  <span className="text-[15px] font-bold text-primary font-head w-8 text-center tabular-nums leading-none select-none">
                    {pad(draftMinute)}
                  </span>
                  <button type="button" onClick={() => adjustMinute(1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-primary transition-colors hover:bg-[#F1F5F9]">
                    <ChevronUp size={13} />
                  </button>
                </div>

                {/* AM / PM */}
                <div className="flex items-center gap-0.5 ml-1">
                  <button type="button" onClick={toggleAmPm}
                    className="w-6 h-6 rounded flex items-center justify-center text-primary transition-colors hover:bg-[#F1F5F9]">
                    <ChevronDown size={13} />
                  </button>
                  <span className="text-[15px] font-bold text-primary font-head w-8 text-center leading-none select-none">
                    {amPm}
                  </span>
                  <button type="button" onClick={toggleAmPm}
                    className="w-6 h-6 rounded flex items-center justify-center text-primary transition-colors hover:bg-[#F1F5F9]">
                    <ChevronUp size={13} />
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-[#E2E8F0]" />

          {/* Footer */}
          <div className="flex justify-end gap-1.5 px-3 py-2">
            <button
              type="button"
              onClick={cancel}
              className="px-3 py-1.5 text-[11px] font-semibold text-muted rounded-md transition-colors hover:bg-[#F1F5F9] hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={!draftDate}
              className="px-4 py-1.5 text-[11px] font-bold text-white rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
              style={{ background: '#FFC857' }}
            >
              Apply
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
