import { useNavigate } from 'react-router-dom'

interface LogoProps {
  onClick?: () => void
}

export default function Logo({ onClick }: LogoProps) {
  const navigate = useNavigate()
  const handleClick = onClick || (() => navigate('/'))
  return (
    <div className="flex items-center gap-2 cursor-pointer no-underline" onClick={handleClick}>
      <div className="w-[38px] h-[38px] bg-primary rounded-full flex items-center justify-center text-white font-extrabold font-head text-label flex-shrink-0">
        I
      </div>
      <span className="font-head font-bold text-[19px] text-primary tracking-[-0.5px]">
        INV<span className="text-secondary">E</span>RSE
      </span>
    </div>
  )
}
