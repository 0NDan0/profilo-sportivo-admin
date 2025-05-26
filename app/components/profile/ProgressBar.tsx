import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
    uploadProgress: number
    setUploadProgress: (val: number) => void
}

const UploadProgressPopUp: React.FC<Props> = ({ uploadProgress }) => {
    const isVisible = uploadProgress > 0 && uploadProgress < 100

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed top-4 left-[5%] max-w-[90%] w-[90%] sm:w-[500px] z-[800] bg-[#0e1c2f] text-white rounded-xl shadow-lg p-4 flex flex-col gap-3 pointer-events-none"
                >
                    <div className="flex items-center justify-between  pointer-events-none">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm sm:text-base font-medium">
                                Caricamento in corso...
                            </p>
                        </div>

                        {/* <button
                            onClick={() => setUploadProgress(0)}
                            className="flex items-center gap-1 text-sm hover:text-red-400 transition"
                        >
                            <CloseIcon width={20} height={20} />
                            Annulla
                        </button> */}
                    </div>

                    {/* Barra di progresso */}
                    <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${uploadProgress}%` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan opacity-20" />
                    </div>

                    <p className="text-right text-xs text-white/70">
                        {uploadProgress.toFixed(1)}%
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default UploadProgressPopUp
