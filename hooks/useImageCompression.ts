import { useState } from 'react'
import imageCompression from 'browser-image-compression'

export default function useImageCompression() {
  const [compressedImage, setCompressedImage] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const compressImage = async (file: File, format: string) => {
    setIsCompressing(true)
    setProgress(0)
    setError(null)

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: `image/${format}`,
        onProgress: (progress: number) => {
          setProgress(Math.round(progress))
        },
      }

      const compressedFile = await imageCompression(file, options)
      setCompressedImage(compressedFile)
    } catch (err) {
      setError('压缩过程中出错，请重试。')
      console.error(err)
    } finally {
      setIsCompressing(false)
    }
  }

  return { compressImage, compressedImage, isCompressing, progress, error }
}

