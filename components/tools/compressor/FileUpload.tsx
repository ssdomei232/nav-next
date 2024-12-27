import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, HTMLMotionProps } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export default function FileUpload({
  onFileSelect,
  selectedFile,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type.startsWith("image/")) {
          onFileSelect(file);
          setError(null);
        } else {
          setError("请上传有效的图片文件。");
        }
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  return (
    <>
      <motion.div
        {...getRootProps() as Omit<HTMLMotionProps<"div">, "onDragStart">}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500 dark:text-blue-400">拖放图片到这里 ...</p>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            拖放图片到这里，或点击选择图片
          </p>
        )}
      </motion.div>
      {error && <p className="text-red-500">{error}</p>}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 p-4 bg-green-100 dark:bg-green-800 rounded-lg"
        >
          <p className="text-green-700 dark:text-green-200">
            <span className="font-semibold">已成功上传:</span>{" "}
            {selectedFile.name}
          </p>
          <p className="text-sm text-green-600 dark:text-green-300 mt-1">
            文件大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          {selectedFile.type.startsWith("image/") && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt={selectedFile.name}
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
