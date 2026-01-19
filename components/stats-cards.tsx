"use client"

import { Card, CardContent } from "@/components/ui/card"
import { trainingData, getModelMetrics } from "@/lib/svm"

export function StatsCards() {
  const totalSamples = trainingData.length
  const spamCount = trainingData.filter(d => d.clase === 1).length
  const hamCount = trainingData.filter(d => d.clase === 0).length
  const metrics = getModelMetrics()

  const stats = [
    {
      label: "Correos de Entrenamiento",
      value: totalSamples,
      suffix: "",
      description: "muestras totales",
      color: "oklch(0.65 0.25 265)"
    },
    {
      label: "Precision del Modelo",
      value: metrics.accuracy,
      suffix: "%",
      description: "en datos de prueba",
      color: "oklch(0.70 0.18 160)"
    },
    {
      label: "Spam Detectados",
      value: spamCount,
      suffix: "",
      description: `${Math.round((spamCount / totalSamples) * 100)}% del dataset`,
      color: "oklch(0.60 0.22 25)"
    },
    {
      label: "Vectores de Soporte",
      value: metrics.supportVectorCount,
      suffix: "",
      description: "puntos clave",
      color: "oklch(0.75 0.20 85)"
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <span 
                className="text-2xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}{stat.suffix}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
