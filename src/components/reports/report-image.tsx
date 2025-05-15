"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ReportImageProps {
  imageUrl: string
  alt: string
}

export default function ReportImage({ imageUrl, alt }: ReportImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <div className="relative h-16 w-16 rounded-md overflow-hidden cursor-pointer" onClick={() => setIsOpen(true)}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="64px"
          className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          priority
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="relative h-[500px] w-full">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
