import GirlMascot from './GirlMascot.jsx'
import WaterDropMascot from './WaterDropMascot.jsx'

export const CHARACTERS = [
  {
    id: 'girl',
    label: 'Hydri Girl',
    description: 'A chibi companion with a rose accent',
    Component: GirlMascot
  },
  {
    id: 'waterdrop',
    label: 'Water Drop',
    description: 'The original water-drop mascot',
    Component: WaterDropMascot
  }
]

export function getCharacter(id) {
  return CHARACTERS.find((character) => character.id === id) ?? CHARACTERS[0]
}
