"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EmailFeatures } from "@/lib/svm"

interface PredictionResultProps {
  result: {
    prediction: number
    confidence: number
    features: EmailFeatures
    label: string
    content: string
    fileName?: string
  } | null
}

export function PredictionResult({ result }: PredictionResultProps) {
  if (!result) {
    return (
      <Card className="bg-card border-border border-dashed">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <svg 
              className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-muted-foreground">
              Carga un correo o pega su contenido para analizarlo
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isSpam = result.prediction === 1

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div 
        className="h-1.5" 
        style={{ 
          backgroundColor: isSpam 
            ? 'oklch(0.60 0.22 25)' 
            : 'oklch(0.70 0.18 160)' 
        }} 
      />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground">Resultado del Analisis</CardTitle>
          <Badge 
            className={isSpam 
              ? "bg-destructive text-destructive-foreground text-sm px-3 py-1" 
              : "bg-success text-success-foreground text-sm px-3 py-1"
            }
          >
            {isSpam ? "SPAM" : "HAM (Legitimo)"}
          </Badge>
        </div>
        {result.fileName && (
          <p className="text-xs text-muted-foreground mt-1">
            Archivo analizado: <span className="font-mono">{result.fileName}</span>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Nivel de Confianza</p>
            <p className="text-lg font-bold text-foreground">{result.confidence}%</p>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ 
                width: `${result.confidence}%`,
                backgroundColor: isSpam 
                  ? 'oklch(0.60 0.22 25)' 
                  : 'oklch(0.70 0.18 160)'
              }}
            />
          </div>
        </div>

        {/* Feature Analysis */}
        <div className="pt-3 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-3">Analisis de Caracteristicas</p>
          <div className="grid grid-cols-2 gap-3">
            <FeatureItem 
              label="Palabras Spam" 
              value={result.features.spamKeywordScore} 
              isHighRisk={result.features.spamKeywordScore > 0.5}
            />
            <FeatureItem 
              label="Urgencia" 
              value={result.features.urgencyScore} 
              isHighRisk={result.features.urgencyScore > 0.5}
            />
            <FeatureItem 
              label="Chars Especiales" 
              value={result.features.specialCharRatio} 
              isHighRisk={result.features.specialCharRatio > 0.15}
            />
            <FeatureItem 
              label="Mayusculas" 
              value={result.features.uppercaseRatio} 
              isHighRisk={result.features.uppercaseRatio > 0.3}
            />
            <FeatureItem 
              label="Enlaces" 
              value={result.features.linkCount / 5} 
              isHighRisk={result.features.linkCount > 2}
              rawValue={`${result.features.linkCount}`}
            />
            <FeatureItem 
              label="Palabras" 
              value={Math.min(1, result.features.wordCount / 100)} 
              isHighRisk={false}
              rawValue={`${result.features.wordCount}`}
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-3 border-t border-border">
          <div className={`p-3 rounded-lg ${isSpam ? 'bg-destructive/10' : 'bg-success/10'}`}>
            <p className="text-sm leading-relaxed">
              {isSpam 
                ? "Este correo presenta multiples indicadores de spam: palabras sospechosas, tono urgente, o enlaces potencialmente peligrosos. Se recomienda NO hacer clic en enlaces ni proporcionar informacion personal."
                : "Este correo parece ser legitimo segun el analisis de patrones. No presenta caracteristicas tipicas de spam, aunque siempre es recomendable verificar el remitente antes de realizar acciones sensibles."
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FeatureItem({ 
  label, 
  value, 
  isHighRisk,
  rawValue 
}: { 
  label: string
  value: number
  isHighRisk: boolean
  rawValue?: string
}) {
  const percentage = Math.round(value * 100)
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={isHighRisk ? "text-destructive font-medium" : "text-foreground"}>
          {rawValue || `${percentage}%`}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: isHighRisk 
              ? 'oklch(0.60 0.22 25)' 
              : 'oklch(0.65 0.15 265)'
          }}
        />
      </div>
    </div>
  )
}
