"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { trainingData } from "@/lib/svm"

export function TrainingDataTable() {
  const [showAll, setShowAll] = useState(false)
  const displayData = showAll ? trainingData : trainingData.slice(0, 8)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground">Dataset de Entrenamiento</CardTitle>
          <Badge variant="outline" className="text-xs">
            {trainingData.length} correos
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Asunto</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Spam Keywords</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Urgencia</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Clase</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row) => (
                <tr 
                  key={row.id} 
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{row.id}</td>
                  <td className="py-3 px-4 text-foreground max-w-[200px] md:max-w-[300px] truncate" title={row.subject}>
                    {row.subject}
                  </td>
                  <td className="py-3 px-4 text-foreground hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${row.features.spamKeywordScore * 100}%`,
                            backgroundColor: row.features.spamKeywordScore > 0.5 
                              ? 'oklch(0.60 0.22 25)' 
                              : 'oklch(0.65 0.15 265)'
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(row.features.spamKeywordScore * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${row.features.urgencyScore * 100}%`,
                            backgroundColor: row.features.urgencyScore > 0.5 
                              ? 'oklch(0.60 0.22 25)' 
                              : 'oklch(0.65 0.15 265)'
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(row.features.urgencyScore * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant="outline"
                      className={row.clase === 1 
                        ? "border-destructive text-destructive bg-destructive/10" 
                        : "border-success text-success bg-success/10"
                      }
                    >
                      {row.clase === 1 ? "Spam" : "Ham"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {trainingData.length > 8 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Mostrar menos" : `Ver todos (${trainingData.length})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
