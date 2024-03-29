const reportWebVitals = (onPerfEntry: any): void => {
  if (onPerfEntry != null && onPerfEntry instanceof Function) {
    import('web-vitals').then(({
      getCLS, getFID, getFCP, getLCP, getTTFB
    }) => {
      getCLS(onPerfEntry)
      getFID(onPerfEntry)
      getFCP(onPerfEntry)
      getLCP(onPerfEntry)
      getTTFB(onPerfEntry)
    }).catch(console.error)
  }
}

export default reportWebVitals
