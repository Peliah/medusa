"use client"

import { motion } from "framer-motion"

interface ValidationErrorProps {
  message: string | null
}

export function ValidationError({ message }: ValidationErrorProps) {
  return (
    <motion.div
      initial={false}
      animate={
        message
          ? { height: "auto", opacity: 1, marginTop: 6 }
          : { height: 0, opacity: 0, marginTop: 0 }
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden"
    >
      {message ? (
        <p className="text-xs text-destructive" role="alert">
          {message}
        </p>
      ) : null}
    </motion.div>
  )
}
