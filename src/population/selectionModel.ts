import { type SelectionParameters, type Selection, type SelectionType } from './types'

//
class SelectionModel {
  type: SelectionType
  eliteCount: number
  tournamentSize: number

  constructor (parameters: SelectionParameters) {
    this.type = parameters.type
    this.eliteCount = parameters.eliteCount
    this.tournamentSize = parameters.tournamentSize
  }

  initialize (parameters: SelectionParameters): void {
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
