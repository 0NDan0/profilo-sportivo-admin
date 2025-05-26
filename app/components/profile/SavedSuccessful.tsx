import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
    isVisible: boolean
    text?: string
}

const SavedSuccessful: React.FC<Props> = ({ isVisible, text }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 20px)` }}
                    className="fixed top-0 z-[800] w-full flex justify-center pointer-events-none"
                >
                    <div className="w-fit p-3 rounded-md bg-green-500 text-white mt-3 text-center shadow-lg flex items-center pointer-events-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span>{text ? text : "Informazioni salvate con successo!"}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SavedSuccessful
