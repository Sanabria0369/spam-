"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PredictionFormProps {
  onPredict: (content: string, fileName?: string) => void
  isLoading?: boolean
}

export function PredictionForm({ onPredict, isLoading }: PredictionFormProps) {
  const [content, setContent] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onPredict(content, fileName || undefined)
    }
  }

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          resolve(result)
        } else if (result instanceof ArrayBuffer) {
          // For binary files, try to decode as text
          const decoder = new TextDecoder('utf-8', { fatal: false })
          const text = decoder.decode(result)
          resolve(text)
        } else {
          resolve('')
        }
      }
      
      reader.onerror = () => reject(reader.error)
      
      // Read as text for known text formats, otherwise as ArrayBuffer
      const textExtensions = ['.txt', '.eml', '.msg', '.html', '.htm', '.mhtml', '.mht', '.json', '.xml', '.csv', '.md', '.rtf']
      const isTextFile = textExtensions.some(ext => file.name.toLowerCase().endsWith(ext)) || 
                         file.type.startsWith('text/') ||
                         file.type === 'message/rfc822' ||
                         file.type === 'application/json'
      
      if (isTextFile) {
        reader.readAsText(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
    })
  }

  const handleFile = async (file: File) => {
    try {
      const text = await readFileContent(file)
      setContent(text)
      setFileName(file.name)
    } catch {
      // If we can't read the file, just set the filename
      setFileName(file.name)
      setContent(`[No se pudo leer el contenido del archivo: ${file.name}]`)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handleClear = () => {
    setContent("")
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const loadExample = (type: 'spam' | 'ham') => {
    if (type === 'spam') {
      setContent(`FELICITACIONES!!! Has sido SELECCIONADO para ganar $50,000 USD!!!

Estimado ganador,

Tu direccion de correo ha sido elegida al AZAR de nuestra base de datos global. 
ACTUA AHORA para reclamar tu PREMIO antes de que EXPIRE!

Click aqui URGENTE: http://fake-lottery-scam.com/claim

GRATIS! Sin costo! Solo necesitamos verificar tu identidad con:
- Numero de tarjeta de credito
- Contrasena de tu banco
- Copia de tu identificacion

NO ESPERES! Esta oferta es LIMITADA y EXCLUSIVA para ti.

RESPONDE INMEDIATAMENTE o perderas tu DINERO!!!

$$$$$$$$$$$$$$$$$`)
      setFileName("ejemplo_spam.txt")
    } else {
      setContent(`Hola equipo,

Les escribo para recordarles sobre la reunion de proyecto programada para manana a las 10:00 AM en la sala de conferencias B.

Agenda:
1. Revision del progreso del Q1
2. Planificacion de tareas para el Q2
3. Asignacion de recursos

Por favor confirmen su asistencia respondiendo a este correo.

Saludos,
Maria Garcia
Gerente de Proyectos`)
      setFileName("ejemplo_legitimo.txt")
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Analizar Correo Electronico</CardTitle>
        <CardDescription className="text-muted-foreground">
          Pega el contenido de un correo o carga un archivo para detectar spam
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-muted-foreground"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              accept="*/*"
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <svg 
                  className="h-5 w-5 text-muted-foreground" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">
                  {fileName ? fileName : "Arrastra un archivo o haz click para seleccionar"}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Soporta cualquier tipo de archivo (.eml, .txt, .msg, .html, etc.)
                </p>
              </div>
            </label>
          </div>

          {/* Quick Examples */}
          <div className="flex gap-2">
            <Label className="text-xs text-muted-foreground self-center">Ejemplos:</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => loadExample('spam')}
              className="text-xs"
            >
              Cargar Spam
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => loadExample('ham')}
              className="text-xs"
            >
              Cargar Legitimo
            </Button>
          </div>

          {/* Text Content Area */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-foreground">
              Contenido del Correo
            </Label>
            <Textarea
              id="content"
              placeholder="Pega aqui el contenido del correo electronico (asunto + cuerpo)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[180px] bg-input border-border text-foreground resize-none font-mono text-sm"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{content.length} caracteres</span>
              <span>{content.split(/\s+/).filter(w => w.length > 0).length} palabras</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analizando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Detectar Spam
                </span>
              )}
            </Button>
            {content && (
              <Button 
                type="button" 
                variant="outline"
                onClick={handleClear}
              >
                Limpiar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
