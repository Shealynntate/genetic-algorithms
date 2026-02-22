import { Card, CardContent, Skeleton, Stack } from '@mui/material'

function SkeletonGalleryEntry(): JSX.Element {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton
        variant="rectangular"
        sx={{ width: '100%', aspectRatio: '1' }}
      />
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Skeleton variant="rounded" width={60} height={60} />
          <Skeleton variant="rounded" width={60} height={60} />
        </Stack>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="70%" />
      </CardContent>
    </Card>
  )
}

export default SkeletonGalleryEntry
