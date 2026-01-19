"use client"

import { useMemo, useState } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { trainingData, getDecisionBoundaryPoints, getSupportVectorsInfo, getModelMetrics, type EmailFeatures } from "@/lib/svm"

interface SVMChartsProps {
  userPoint?: { 
    spamKeywordScore: number
    urgencyScore: number
    prediction: number
    features?: EmailFeatures
  } | null
}

// Custom tooltip for scatter chart
function ScatterTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { x: number; y: number; type?: string; subject?: string } }> }) {
  if (!active || !payload || !payload.length) return null
  
  const data = payload[0].payload
  
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-xl max-w-xs">
      <p className="font-semibold text-foreground mb-1">{data.type || "Punto"}</p>
      {data.subject && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{data.subject}</p>
      )}
      <p className="text-sm text-muted-foreground">
        Spam Keywords: <span className="text-foreground font-medium">{Math.round(data.x)}%</span>
      </p>
      <p className="text-sm text-muted-foreground">
        Urgencia: <span className="text-foreground font-medium">{Math.round(data.y)}%</span>
      </p>
    </div>
  )
}

// Generic tooltip
function GenericTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null
  
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
      {label && <p className="font-semibold text-foreground mb-2">{label}</p>}
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-muted-foreground">
          {entry.name}: <span className="text-foreground font-medium">{typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}</span>
        </p>
      ))}
    </div>
  )
}

export function SVMCharts({ userPoint }: SVMChartsProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  
  const boundaryPoints = useMemo(() => getDecisionBoundaryPoints(), [])
  const supportVectors = useMemo(() => getSupportVectorsInfo(), [])
  const modelMetrics = useMemo(() => getModelMetrics(), [])
  
  // Prepare data for different charts
  const boundary0 = boundaryPoints.filter(p => p.class === 0).map(p => ({ x: p.x, y: p.y }))
  const boundary1 = boundaryPoints.filter(p => p.class === 1).map(p => ({ x: p.x, y: p.y }))
  
  const svIds = new Set(supportVectors.map(sv => sv.id))
  
  const allTrainingData = trainingData.map((d) => ({
    x: d.features.spamKeywordScore * 100,
    y: d.features.urgencyScore * 100,
    clase: d.clase,
    isSV: svIds.has(d.id),
    subject: d.subject,
    type: svIds.has(d.id) 
      ? `Vector de Soporte (${d.clase === 1 ? 'Spam' : 'Ham'})`
      : d.clase === 1 ? 'Spam' : 'Ham (Legitimo)',
    id: d.id
  }))
  
  const userData = userPoint ? [{
    x: userPoint.spamKeywordScore,
    y: userPoint.urgencyScore,
    type: `Tu correo: ${userPoint.prediction === 1 ? 'SPAM' : 'HAM'}`
  }] : []

  // Feature distribution data
  const featureDistribution = useMemo(() => {
    const spamData = trainingData.filter(d => d.clase === 1)
    const hamData = trainingData.filter(d => d.clase === 0)
    
    const avgFeatures = (data: typeof trainingData) => ({
      spamKeywords: data.reduce((sum, d) => sum + d.features.spamKeywordScore, 0) / data.length * 100,
      urgency: data.reduce((sum, d) => sum + d.features.urgencyScore, 0) / data.length * 100,
      specialChars: data.reduce((sum, d) => sum + d.features.specialCharRatio, 0) / data.length * 100,
      uppercase: data.reduce((sum, d) => sum + d.features.uppercaseRatio, 0) / data.length * 100,
      links: data.reduce((sum, d) => sum + d.features.linkCount, 0) / data.length * 20,
    })
    
    return [
      { feature: 'Spam Keywords', spam: avgFeatures(spamData).spamKeywords, ham: avgFeatures(hamData).spamKeywords },
      { feature: 'Urgencia', spam: avgFeatures(spamData).urgency, ham: avgFeatures(hamData).urgency },
      { feature: 'Chars Especiales', spam: avgFeatures(spamData).specialChars, ham: avgFeatures(hamData).specialChars },
      { feature: 'Mayusculas', spam: avgFeatures(spamData).uppercase, ham: avgFeatures(hamData).uppercase },
      { feature: 'Enlaces', spam: avgFeatures(spamData).links, ham: avgFeatures(hamData).links },
    ]
  }, [])

  // Radar data for user's email
  const radarData = useMemo(() => {
    if (!userPoint?.features) return null
    return [
      { feature: 'Spam Keywords', value: userPoint.features.spamKeywordScore * 100, fullMark: 100 },
      { feature: 'Urgencia', value: userPoint.features.urgencyScore * 100, fullMark: 100 },
      { feature: 'Chars Especiales', value: userPoint.features.specialCharRatio * 100, fullMark: 100 },
      { feature: 'Mayusculas', value: userPoint.features.uppercaseRatio * 100, fullMark: 100 },
      { feature: 'Enlaces', value: (userPoint.features.linkCount / 5) * 100, fullMark: 100 },
    ]
  }, [userPoint])

  // Class distribution pie data
  const classDistribution = [
    { name: 'Spam', value: trainingData.filter(d => d.clase === 1).length, fill: 'oklch(0.60 0.22 25)' },
    { name: 'Ham', value: trainingData.filter(d => d.clase === 0).length, fill: 'oklch(0.70 0.18 160)' },
  ]

  // Confidence distribution line data
  const confidenceData = useMemo(() => {
    return trainingData.map((d, i) => ({
      index: i + 1,
      spamScore: d.features.spamKeywordScore * 50 + d.features.urgencyScore * 50,
      clase: d.clase,
      subject: d.subject.substring(0, 20) + '...'
    })).sort((a, b) => a.spamScore - b.spamScore)
  }, [])

  // Feature correlation heatmap data
  const featureScatter = useMemo(() => {
    return trainingData.map(d => ({
      specialChars: d.features.specialCharRatio * 100,
      uppercase: d.features.uppercaseRatio * 100,
      clase: d.clase
    }))
  }, [])

  return (
    <div className="space-y-6">
      {/* Main Decision Boundary Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                Frontera de Decision SVM
              </CardTitle>
              <CardDescription className="mt-1">
                Visualizacion 2D del hiperplano de separacion (Spam Keywords vs Urgencia)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Kernel: RBF
              </Badge>
              <Badge variant="outline" className="text-xs">
                Gamma: 0.8
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  domain={[0, 100]}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)', strokeWidth: 1 }}
                  tickLine={{ stroke: 'var(--border)' }}
                  label={{ 
                    value: 'Spam Keywords Score (%)', 
                    position: 'bottom', 
                    offset: 5,
                    fontSize: 12,
                    fill: 'var(--muted-foreground)'
                  }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  domain={[0, 100]}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)', strokeWidth: 1 }}
                  tickLine={{ stroke: 'var(--border)' }}
                  label={{ 
                    value: 'Urgency Score (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 15,
                    fontSize: 12,
                    fill: 'var(--muted-foreground)'
                  }}
                />
                
                <Tooltip content={<ScatterTooltip />} />
                
                <ReferenceLine x={50} stroke="var(--muted-foreground)" strokeDasharray="5 5" opacity={0.3} />
                <ReferenceLine y={50} stroke="var(--muted-foreground)" strokeDasharray="5 5" opacity={0.3} />
                
                {/* Decision boundary regions */}
                <Scatter data={boundary0} fill="oklch(0.65 0.15 160 / 0.12)" isAnimationActive={false} />
                <Scatter data={boundary1} fill="oklch(0.55 0.18 25 / 0.12)" isAnimationActive={false} />
                
                {/* Training data points */}
                <Scatter data={allTrainingData} isAnimationActive={true} animationDuration={800}>
                  {allTrainingData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={entry.clase === 1 ? 'oklch(0.60 0.22 25)' : 'oklch(0.70 0.18 160)'}
                      stroke={entry.isSV ? 'oklch(0.90 0.15 90)' : 'white'}
                      strokeWidth={entry.isSV ? 3 : 2}
                      r={entry.isSV ? 10 : 7}
                      style={{
                        cursor: 'pointer',
                        filter: hoveredPoint === index ? 'brightness(1.2) drop-shadow(0 0 8px currentColor)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                </Scatter>
                
                {/* User prediction point */}
                {userData.length > 0 && (
                  <Scatter data={userData} isAnimationActive={true} animationDuration={500}>
                    <Cell
                      fill="oklch(0.70 0.25 265)"
                      stroke="white"
                      strokeWidth={3}
                      r={14}
                      style={{
                        filter: 'drop-shadow(0 0 12px oklch(0.70 0.25 265))',
                        cursor: 'pointer'
                      }}
                    />
                  </Scatter>
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.70 0.18 160)' }} />
              <span className="text-sm text-muted-foreground">Ham (Legitimo)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.60 0.22 25)' }} />
              <span className="text-sm text-muted-foreground">Spam</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'oklch(0.70 0.18 160)', borderColor: 'oklch(0.90 0.15 90)' }} />
              <span className="text-sm text-muted-foreground">Vector de Soporte</span>
            </div>
            {userPoint && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.70 0.25 265)', boxShadow: '0 0 6px oklch(0.70 0.25 265)' }} />
                <span className="text-sm text-muted-foreground">Tu Correo</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Distribution Bar Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Distribucion de Caracteristicas</CardTitle>
            <CardDescription>Comparacion promedio de features entre Spam y Ham</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis 
                    dataKey="feature" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<GenericTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="spam" name="Spam" fill="oklch(0.60 0.22 25)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ham" name="Ham" fill="oklch(0.70 0.18 160)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Class Distribution Pie Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Distribucion de Clases</CardTitle>
            <CardDescription>Balance del dataset de entrenamiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={{ stroke: 'var(--muted-foreground)' }}
                  >
                    {classDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="var(--background)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<GenericTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{classDistribution[0].value}</p>
                <p className="text-xs text-muted-foreground">Spam</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{classDistribution[1].value}</p>
                <p className="text-xs text-muted-foreground">Ham</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Email Radar + Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart for User's Email */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Perfil de Caracteristicas</CardTitle>
            <CardDescription>
              {userPoint ? 'Analisis radar del correo analizado' : 'Analiza un correo para ver su perfil'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {radarData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis 
                      dataKey="feature" 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }}
                    />
                    <Radar
                      name="Tu Correo"
                      dataKey="value"
                      stroke={userPoint?.prediction === 1 ? 'oklch(0.60 0.22 25)' : 'oklch(0.70 0.18 160)'}
                      fill={userPoint?.prediction === 1 ? 'oklch(0.60 0.22 25)' : 'oklch(0.70 0.18 160)'}
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                    <Tooltip content={<GenericTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <svg className="h-16 w-16 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm">Carga un correo para ver el analisis</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution Area Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Distribucion de Scores</CardTitle>
            <CardDescription>Scores de spam ordenados de menor a mayor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={confidenceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.60 0.22 25)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.70 0.18 160)" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis 
                    dataKey="index" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    label={{ value: 'Correo #', position: 'bottom', offset: -5, fontSize: 10, fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    domain={[0, 100]}
                    label={{ value: 'Score', angle: -90, position: 'insideLeft', offset: 15, fontSize: 10, fill: 'var(--muted-foreground)' }}
                  />
                  <Tooltip content={<GenericTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="spamScore" 
                    name="Spam Score"
                    stroke="oklch(0.65 0.20 30)"
                    fill="url(#scoreGradient)"
                    strokeWidth={2}
                  />
                  <ReferenceLine y={50} stroke="var(--muted-foreground)" strokeDasharray="5 5" label={{ value: 'Umbral', fill: 'var(--muted-foreground)', fontSize: 10 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Feature Analysis */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Correlacion: Caracteres Especiales vs Mayusculas</CardTitle>
          <CardDescription>Analisis de la relacion entre estas dos caracteristicas del SVM</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="specialChars" 
                  domain={[0, 40]}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  label={{ value: 'Caracteres Especiales (%)', position: 'bottom', offset: 5, fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="uppercase" 
                  domain={[0, 100]}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  label={{ value: 'Mayusculas (%)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <Tooltip content={<GenericTooltip />} />
                <Scatter data={featureScatter} isAnimationActive={true}>
                  {featureScatter.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.clase === 1 ? 'oklch(0.60 0.22 25)' : 'oklch(0.70 0.18 160)'}
                      stroke="white"
                      strokeWidth={2}
                      r={8}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Model Metrics Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Metricas del Modelo SVM</CardTitle>
          <CardDescription>Resumen de parametros y rendimiento del clasificador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-3xl font-bold text-foreground">{modelMetrics.accuracy}%</p>
              <p className="text-xs text-muted-foreground mt-1">Precision (Training)</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-3xl font-bold text-foreground">{modelMetrics.supportVectorCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Vectores de Soporte</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-3xl font-bold text-foreground">{trainingData.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Muestras de Entrenamiento</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-3xl font-bold text-foreground font-mono">{modelMetrics.bias.toFixed(3)}</p>
              <p className="text-xs text-muted-foreground mt-1">Bias (b)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
