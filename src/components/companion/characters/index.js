import GirlMascot from './GirlMascot.jsx'
import WaterDropMascot from './WaterDropMascot.jsx'
import BoyMascot from './BoyMascot.jsx'
import LeafBuddyMascot from './LeafBuddyMascot.jsx'

export const CHARACTERS = [
  {
    id: 'girl',
    label: 'Hydri Girl',
    description: 'A chibi companion with a rose accent',
    Component: GirlMascot
  },
  {
    id: 'boy',
    label: 'Hydri Boy',
    description: 'A chibi companion with a water bottle',
    Component: BoyMascot
  },
  {
    id: 'waterdrop',
    label: 'Water Drop',
    description: 'The original water-drop mascot',
    Component: WaterDropMascot
  },
  {
    id: 'leafbuddy',
    label: 'Leaf Buddy',
    description: 'A cheerful leaf, straight from the logo',
    Component: LeafBuddyMascot
  }
]

export function getCharacter(id) {
  return CHARACTERS.find((character) => character.id === id) ?? CHARACTERS[0]
}
