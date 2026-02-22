import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

import { NavTag } from '../common/types'

const firestoreApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: [NavTag.SIMULATION_REPORTS],
  endpoints: () => ({})
})

export default firestoreApi
