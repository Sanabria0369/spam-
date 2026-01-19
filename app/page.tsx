"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SVMCharts } from "@/components/svm-charts"
import { PredictionForm } from "@/components/prediction-form"
import { PredictionResult } from "@/components/prediction-result"
import { StatsCards } from "@/components/stats-cards"
import { TrainingDataTable } from "@/components/training-data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { classify, type EmailFeatures } from "@/lib/svm"

export default function SpamDetectorPage() {
  const [result, setResult] = useState<{
    prediction: number
    confidence: number
    features: EmailFeatures
    label: string
    content: string
    fileName?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userPoint, setUserPoint] = useState<{
    spamKeywordScore: number
    urgencyScore: number
    prediction: number
    features?: EmailFeatures
  } | null>(null)

  const handlePredict = async (content: string, fileName?: string) => {
    setIsLoading(true)
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const { prediction, confidence, features, label } = classify(content)
    
    setResult({
      prediction,
      confidence,
      features,
      label,
      content,
      fileName
    })
    
    setUserPoint({
      spamKeywordScore: features.spamKeywordScore * 100,
      urgencyScore: features.urgencyScore * 100,
      prediction,
      features
    })
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <svg 
                  className="h-5 w-5 text-primary-foreground" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Spam Detector SVM</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Clasificador de correos con Support Vector Machine</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground font-mono">v1.0.0</span>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">
            Detector de Correos Spam con SVM
          </h2>
          <p className="text-muted-foreground max-w-3xl text-pretty">
            Sistema inteligente de deteccion de spam utilizando Maquinas de Vectores de Soporte (SVM) 
            con kernel RBF (Radial Basis Function). El algoritmo analiza multiples caracteristicas del correo 
            para clasificarlo como SPAM o HAM (legitimo), mostrando graficas detalladas del proceso de clasificacion.
          </p>
        </div>

        {/* Stats Overview */}
        <section className="mb-8">
          <StatsCards />
        </section>

        {/* Main Tabs */}
        <Tabs defaultValue="analyzer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="analyzer">Analizador</TabsTrigger>
            <TabsTrigger value="visualizations">Graficas SVM</TabsTrigger>
            <TabsTrigger value="data">Datos de Entrenamiento</TabsTrigger>
          </TabsList>

          {/* Analyzer Tab */}
          <TabsContent value="analyzer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
              <PredictionResult result={result} />
            </div>
            
            {/* Quick Chart Preview */}
            {userPoint && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Vista Rapida - Posicion del Correo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tu correo se encuentra en la posicion marcada. Ve a la pestana &quot;Graficas SVM&quot; para ver 
                    el analisis completo con todas las visualizaciones del algoritmo.
                  </p>
                  <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Spam Keywords Score</p>
                      <p className="text-2xl font-bold text-foreground">{userPoint.spamKeywordScore.toFixed(1)}%</p>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div>
                      <p className="text-sm text-muted-foreground">Urgency Score</p>
                      <p className="text-2xl font-bold text-foreground">{userPoint.urgencyScore.toFixed(1)}%</p>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div>
                      <p className="text-sm text-muted-foreground">Clasificacion</p>
                      <p className={`text-2xl font-bold ${userPoint.prediction === 1 ? 'text-red-500' : 'text-green-500'}`}>
                        {userPoint.prediction === 1 ? 'SPAM' : 'HAM'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Visualizations Tab */}
          <TabsContent value="visualizations" className="space-y-6">
            <SVMCharts userPoint={userPoint} />
          </TabsContent>

          {/* Training Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <TrainingDataTable />
            
            {/* Algorithm Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Algoritmo SVM</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    <strong className="text-foreground">Support Vector Machine (SVM)</strong> es un algoritmo de 
                    aprendizaje supervisado que busca encontrar el hiperplano optimo que separa las clases 
                    con el mayor margen posible.
                  </p>
                  <p>
                    Utilizamos el <strong className="text-foreground">Kernel RBF (Radial Basis Function)</strong>:
                  </p>
                  <div className="p-3 bg-muted rounded-lg font-mono text-xs">
                    K(x, z) = exp(-gamma * ||x - z||^2)
                  </div>
                  <p>
                    Donde <code className="text-xs bg-muted px-1 rounded">gamma = 0.8</code> controla 
                    la influencia de cada punto de entrenamiento.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Caracteristicas Extraidas</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span><strong className="text-foreground">Spam Keywords:</strong> Proporcion de palabras clave sospechosas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span><strong className="text-foreground">Urgency Score:</strong> Nivel de urgencia detectado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span><strong className="text-foreground">Special Chars:</strong> Ratio de caracteres especiales (!$%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span><strong className="text-foreground">Uppercase:</strong> Proporcion de mayusculas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span><strong className="text-foreground">Links:</strong> Cantidad de enlaces detectados</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Spam Detector - Clasificacion de correos con Support Vector Machine
            </p>
            <p className="text-xs text-muted-foreground">
              Kernel RBF | SMO Algorithm | Listo para Vercel
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
