'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export const TypewriterText = ({ 
  texts, 
  delay = 0,
  typingSpeed = 50, 
  deletingSpeed = 30,
  pauseDuration = 1500 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timeout
    const fullText = texts[currentTextIndex]

    if (isTyping) {
      if (currentText.length < fullText.length) {
        timeout = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1))
        }, typingSpeed)
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false)
        }, pauseDuration)
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1))
        }, deletingSpeed)
      } else {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [currentText, currentTextIndex, isTyping, texts, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <div className="inline-flex items-center justify-center min-h-[2rem]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTextIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-medium dark:text-gray-300 text-center"
        >
          {currentText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="ml-1 inline-block h-5 w-1 bg-current align-middle"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}