"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ReportImageProps {
  imageUrl: string
  alt: string
  wrapperClassName?: string
  imageClassName?: string
}

export default function ReportImage({ 
  imageUrl, 
  alt, 
  wrapperClassName = "relative h-16 w-16 rounded-md overflow-hidden cursor-pointer",
  imageClassName = "object-cover transition-opacity duration-300"
}: ReportImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <div 
        className={cn(wrapperClassName)} 
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="64px"
          className={cn(imageClassName, isLoading ? 'opacity-0' : 'opacity-100')}
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
