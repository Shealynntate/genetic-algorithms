// File Type Conversion and Creation
// --------------------------------------------------
export const fileToBase64 = async (file) => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = () => { resolve(reader.result); };
    reader.onerror = (error) => { reject(error); };
  });
  reader.readAsDataURL(file);

  return promise;
};

// Download Functions
// --------------------------------------------------
export const downloadFile = (fileName, data, blobType, fileType) => {
  const blob = new Blob([data], { type: blobType });
  const href = URL.createObjectURL(blob);
  // Create "a" element with href to file
  const link = document.createElement('a');
  link.href = href;
  link.download = `${fileName}.${fileType}`;
  document.body.appendChild(link);
  link.click();
  // Cean up element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

export const downloadJSON = (fileName, data) => {
  const json = JSON.stringify(data);
  downloadFile(fileName, json, 'application/json', 'json');
};

export const download = (filename, contents) => {
  const a = document.createElement('a');
  a.download = filename;
  a.href = contents;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
