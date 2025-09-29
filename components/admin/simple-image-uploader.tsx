"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Link, Loader2, Image } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { uploadToCloudinary } from "@/lib/cloudinary-upload"

interface SimpleImageUploaderProps {
  onUpload: (url: string) => void
  buttonText?: string
}

export default function SimpleImageUploader({
  onUpload,
  buttonText = "Zmeniť obrázok"
}: SimpleImageUploaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const { toast } = useToast()

  const handleUrlSubmit = () => {
    if (imageUrl) {
      onUpload(imageUrl)
      setImageUrl("")
      setIsOpen(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      // Use existing cloudinary-upload function from lib
      const result = await uploadToCloudinary(selectedFile, 'scear-hero')

      if (result && result.secure_url) {
        onUpload(result.secure_url)
        toast({
          title: "Obrázok nahraný",
          description: "Obrázok bol úspešne nahraný na Cloudinary",
        })
        setIsOpen(false)
        setSelectedFile(null)
        setPreviewUrl("")
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Chyba",
        description: "Nepodarilo sa nahrať obrázok",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-red-800/30 hover:border-red-600 text-white hover:bg-red-800/20"
        >
          <Upload className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-red-800/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nastaviť Hero Obrázok</DialogTitle>
          <DialogDescription className="text-gray-400">
            Nahrajte obrázok z počítača alebo zadajte URL adresu
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="upload" className="data-[state=active]:bg-red-800">
              <Upload className="h-4 w-4 mr-2" />
              Nahrať súbor
            </TabsTrigger>
            <TabsTrigger value="url" className="data-[state=active]:bg-red-800">
              <Link className="h-4 w-4 mr-2" />
              URL adresa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-gray-800 border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-800 file:text-white hover:file:bg-red-700"
              />

              {previewUrl && (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Zrušiť
                </Button>
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isUploading}
                  className="bg-red-800 hover:bg-red-700 text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Nahrávam...
                    </>
                  ) : (
                    <>
                      <Image className="h-4 w-4 mr-2" />
                      Nahrať na Cloudinary
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-4">
              <Input
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Zrušiť
                </Button>
                <Button
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl}
                  className="bg-red-800 hover:bg-red-700 text-white"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Použiť URL
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}