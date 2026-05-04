import { useNavigate } from 'react-router-dom'

interface LogoProps {
  onClick?: () => void
  light?: boolean
  src?: string
}

export default function Logo({ onClick, light, src }: LogoProps) {
  const navigate = useNavigate()
  const handleClick = onClick || (() => navigate('/'))

  if (src) {
    return (
      <div className="flex items-center cursor-pointer" onClick={handleClick}>
        <img
          src={src}
          alt="Luxeway Ride"
          className="h-9 w-auto object-contain"
          style={{ maxWidth: '160px' }}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 cursor-pointer no-underline" onClick={handleClick}>
      <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center font-extrabold font-head text-label flex-shrink-0 ${light ? 'bg-secondary text-white' : 'bg-primary text-white'}`}>
        I
      </div>
      <span className={`font-head font-bold text-[19px] tracking-[-0.5px] ${light ? 'text-white' : 'text-primary'}`}>
        Luxeway<span className={light ? 'text-secondary' : 'text-primary'}>R</span>IDE
      </span>
    </div>
  )
}
