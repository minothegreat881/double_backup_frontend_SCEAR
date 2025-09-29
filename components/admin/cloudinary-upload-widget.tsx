"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void
  buttonText?: string
  folder?: string
}

declare global {
  interface Window {
    cloudinary: any
  }
}

export default function CloudinaryUploadWidget({
  onUpload,
  buttonText = "Nahrať na Cloudinary",
  folder = "scear-hero"
}: CloudinaryUploadWidgetProps) {
  const widgetRef = useRef<any>()

  useEffect(() => {
    // Load Cloudinary widget script
    const script = document.createElement("script")
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.cloudinary) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: "dii0wl9ke",
            apiKey: "817718588418822",
            uploadSignature: generateSignature,
            uploadSignatureTimestamp: Math.round(new Date().getTime() / 1000),
            sources: ["local", "url", "camera", "image_search"],
            multiple: false,
            folder: folder,
            resourceType: "auto",
            clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "gif"],
            maxFileSize: 10000000, // 10MB
            cropping: false,
            styles: {
              palette: {
                window: "#1f2937",
                windowBorder: "#991b1b",
                tabIcon: "#ffffff",
                menuIcons: "#ffffff",
                textDark: "#000000",
                textLight: "#ffffff",
                link: "#991b1b",
                action: "#991b1b",
                inactiveTabIcon: "#9ca3af",
                error: "#ef4444",
                inProgress: "#991b1b",
                complete: "#16a34a",
                sourceBg: "#111827"
              },
              fonts: {
                default: {
                  active: true
                }
              }
            }
          },
          (error: any, result: any) => {
            if (error) {
              console.error("Upload error:", error)
              return
            }

            if (result.event === "success") {
              console.log("Upload successful:", result.info)
              onUpload(result.info.secure_url)
            }
          }
        )
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [folder, onUpload])

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open()
    }
  }

  return (
    <Button
      onClick={openWidget}
      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
    >
      <Upload className="h-4 w-4 mr-2" />
      {buttonText}
    </Button>
  )
}