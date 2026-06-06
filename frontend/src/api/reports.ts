import api from './axios'

export const reportsApi = {
  downloadExcel: (params?: Record<string, string>) =>
    api.get('/reports/excel', { params, responseType: 'blob' }),

  downloadPdf: () =>
    api.get('/reports/pdf', { responseType: 'blob' }),
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
