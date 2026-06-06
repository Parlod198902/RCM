import api from './axios'

export const uploadApi = {
  uploadExcel: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/upload/excel', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  previewExcel: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/upload/preview', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
