import { type Selection, type SelectionType } from './types'

//
class SelectionModel {
  type: SelectionType
  eliteCount: number
  tournamentSize: number

  constructor (parameters: Selection) {
    this.type = parameters.type
    this.eliteCount = parameters.eliteCount
    this.tournamentSize = parameters.tournamentSize
  }

  initialize (parameters: Selection): void {
    this.type = parameters.type
    this.eliteCount = parameters.eliteCount
    this.tournamentSize = parameters.tournamentSize
  }

  serialize (): Selection {
    return {
      type: this.type,
      eliteCount: this.eliteCount,
      tournamentSize: this.tournamentSize
    }
  }
}

export default SelectionModel
