import { getCharacter } from './characters/index.js'

export default function Mascot({ characterId = 'girl', pose = 'idle', size = 'medium', facingLeft = false }) {
  const { Component } = getCharacter(characterId)
  return <Component pose={pose} size={size} facingLeft={facingLeft} />
}
