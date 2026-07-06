import { generateReactHelpers } from 'uploadthing/helpers'

export const { UploadDropzone, uploadFiles } = generateReactHelpers<{
  profilePhoto: { maxFileSize: '4MB' }
}>()
