// File Type Conversion and Creation
// --------------------------------------------------
export const fileToBase64 = async (
  file: File
): Promise<string | ArrayBuffer | null> => {
  const reader = new FileReader()
  const promise = new Promise<string | ArrayBuffer | null>(
    (resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = () => {
        reject(new Error('FileReader failed'))
      }
    }
  )
  reader.readAsDataURL(file)

  return await promise
}

// Download Functions
// --------------------------------------------------
export const downloadFile = (
  fileName: string,
  data: BlobPart,
  blobType: string,
  fileType: string
): void => {
  const blob = new Blob([data], { type: blobType })
  const href = URL.createObjectURL(blob)
  // Create "a" element with href to file
  const link = document.createElement('a')
  link.href = href
  link.download = `${fileName}.${fileType}`
  document.body.appendChild(link)
  link.click()
  // Cean up element & remove ObjectURL
  document.body.removeChild(link)
  URL.revokeObjectURL(href)
}

export const downloadJSON = (fileName: string, data: unknown): void => {
  const json = JSON.stringify(data)
  downloadFile(fileName, json, 'application/json', 'json')
}

export const download = (filename: string, contents: string): void => {
  const a = document.createElement('a')
  a.download = filename
  a.href = contents
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const downloadUrl = async (
  url: string,
  filename: string
): Promise<void> => {
  const response = await fetch(url)
  const blob = await response.blob()
  download(filename, URL.createObjectURL(blob))
}
