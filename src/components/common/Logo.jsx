import iconLogo from '../../assets/hydri-logo.png'

export default function Logo({ size = 36, className = '' }) {
  return <img src={iconLogo} alt="Hydri" width={size} height={size} className={className} draggable={false} />
}
