import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import ExperimentWizard from '../form/ExperimentWizard'
import { type ParametersState } from '../parameters/types'

interface SimulationFormDialogProps {
  defaultValues?: ParametersState
  open?: boolean
  onClose: () => void
  onSubmit: (parameters: ParametersState) => void
}

function SimulationFormDialog({
  defaultValues,
  open = false,
  onClose,
  onSubmit
}: SimulationFormDialogProps): JSX.Element {
  const handleSubmit = (data: ParametersState): void => {
    onSubmit(data)
  }

  return (
    <Dialog
      open={open}
      onClose={() => { onClose() }}
      maxWidth="md"
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
        New Experiment
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 3 }}>
        <ExperimentWizard
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default SimulationFormDialog
