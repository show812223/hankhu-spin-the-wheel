export interface Participant {
  id: string
  name: string
  color: string
  isWinner: boolean
}

export type GamePhase = 'idle' | 'spinning' | 'showWinner' | 'finished'

export interface WheelSegment {
  id: string
  name: string
  color: string
  startAngle: number
  endAngle: number
}

export interface GameState {
  participants: Participant[]
  winners: Participant[]
  currentWinner: Participant | null
  gamePhase: GamePhase
  round: number
}
