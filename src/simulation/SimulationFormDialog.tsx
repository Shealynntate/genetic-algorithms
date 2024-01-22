import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { type ParametersState } from '../parameters/types'
import SimulationForm from '../form/SimulationForm'

interface SimulationFormDialogProps {
  defaultValues?: ParametersState
  open?: boolean
  onClose: () => void
  onSubmit: (parameters: ParametersState) => void
}

function SimulationFormDialog ({
  defaultValues,
  open = false,
  onClose,
  onSubmit
}: SimulationFormDialogProps): JSX.Element {
  // Send to database and close form
  const handleSubmit = (data: ParametersState): void => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onClose={() => { onClose() }} maxWidth="xl" sx={{ p: 0 }}>
      <DialogTitle sx={{ p: 0.5 }}>Simulation Setup</DialogTitle>
      <DialogContent sx={{ py: 0, px: 0.5 }}>
        <SimulationForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

export default SimulationFormDialog
