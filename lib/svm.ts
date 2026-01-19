// Training data for spam detection
// Features: word count, special char ratio, uppercase ratio, link count, urgency words, spam keywords
export interface EmailFeatures {
  wordCount: number
  specialCharRatio: number
  uppercaseRatio: number
  linkCount: number
  urgencyScore: number
  spamKeywordScore: number
}

export interface TrainingEmail {
  id: number
  subject: string
  features: EmailFeatures
  clase: number // 0 = ham (legitimo), 1 = spam
}

// Pre-computed training data for spam detection
export const trainingData: TrainingEmail[] = [
  // SPAM emails (clase = 1)
  {
    id: 1,
    subject: "GANASTE $1,000,000!!! RECLAMA AHORA!!!",
    features: { wordCount: 5, specialCharRatio: 0.35, uppercaseRatio: 0.85, linkCount: 3, urgencyScore: 0.9, spamKeywordScore: 0.95 },
    clase: 1
  },
  {
    id: 2,
    subject: "Oferta URGENTE - 90% descuento solo HOY",
    features: { wordCount: 7, specialCharRatio: 0.15, uppercaseRatio: 0.40, linkCount: 2, urgencyScore: 0.85, spamKeywordScore: 0.70 },
    clase: 1
  },
  {
    id: 3,
    subject: "Tu cuenta sera SUSPENDIDA - Verifica AHORA",
    features: { wordCount: 6, specialCharRatio: 0.10, uppercaseRatio: 0.45, linkCount: 1, urgencyScore: 0.95, spamKeywordScore: 0.80 },
    clase: 1
  },
  {
    id: 4,
    subject: "GRATIS iPhone 15!!! Click aqui para reclamar",
    features: { wordCount: 6, specialCharRatio: 0.25, uppercaseRatio: 0.50, linkCount: 2, urgencyScore: 0.70, spamKeywordScore: 0.90 },
    clase: 1
  },
  {
    id: 5,
    subject: "Enlace de descarga premio - ACTUA RAPIDO!!!",
    features: { wordCount: 6, specialCharRatio: 0.30, uppercaseRatio: 0.55, linkCount: 3, urgencyScore: 0.88, spamKeywordScore: 0.85 },
    clase: 1
  },
  {
    id: 6,
    subject: "ALERTA: Actividad sospechosa detectada $$$",
    features: { wordCount: 5, specialCharRatio: 0.20, uppercaseRatio: 0.60, linkCount: 1, urgencyScore: 0.92, spamKeywordScore: 0.75 },
    clase: 1
  },
  {
    id: 7,
    subject: "Prestamo aprobado sin revision de credito!!!",
    features: { wordCount: 6, specialCharRatio: 0.22, uppercaseRatio: 0.30, linkCount: 2, urgencyScore: 0.65, spamKeywordScore: 0.88 },
    clase: 1
  },
  {
    id: 8,
    subject: "REPLICA ROLEX 95% OFF - Envio GRATIS",
    features: { wordCount: 6, specialCharRatio: 0.18, uppercaseRatio: 0.65, linkCount: 1, urgencyScore: 0.50, spamKeywordScore: 0.92 },
    clase: 1
  },
  // HAM emails (clase = 0)
  {
    id: 9,
    subject: "Reunion de equipo manana a las 10am",
    features: { wordCount: 7, specialCharRatio: 0.02, uppercaseRatio: 0.05, linkCount: 0, urgencyScore: 0.15, spamKeywordScore: 0.05 },
    clase: 0
  },
  {
    id: 10,
    subject: "Tu factura de marzo esta disponible",
    features: { wordCount: 6, specialCharRatio: 0.03, uppercaseRatio: 0.03, linkCount: 1, urgencyScore: 0.20, spamKeywordScore: 0.10 },
    clase: 0
  },
  {
    id: 11,
    subject: "Confirmacion de tu reserva #45892",
    features: { wordCount: 5, specialCharRatio: 0.08, uppercaseRatio: 0.02, linkCount: 1, urgencyScore: 0.10, spamKeywordScore: 0.08 },
    clase: 0
  },
  {
    id: 12,
    subject: "Actualizacion del proyecto Q1 2024",
    features: { wordCount: 5, specialCharRatio: 0.05, uppercaseRatio: 0.08, linkCount: 0, urgencyScore: 0.12, spamKeywordScore: 0.05 },
    clase: 0
  },
  {
    id: 13,
    subject: "Re: Pregunta sobre el documento adjunto",
    features: { wordCount: 6, specialCharRatio: 0.04, uppercaseRatio: 0.02, linkCount: 0, urgencyScore: 0.08, spamKeywordScore: 0.03 },
    clase: 0
  },
  {
    id: 14,
    subject: "Invitacion a la presentacion del viernes",
    features: { wordCount: 6, specialCharRatio: 0.02, uppercaseRatio: 0.04, linkCount: 1, urgencyScore: 0.15, spamKeywordScore: 0.06 },
    clase: 0
  },
  {
    id: 15,
    subject: "Tu pedido ha sido enviado",
    features: { wordCount: 5, specialCharRatio: 0.01, uppercaseRatio: 0.02, linkCount: 1, urgencyScore: 0.18, spamKeywordScore: 0.12 },
    clase: 0
  },
  {
    id: 16,
    subject: "Recordatorio: Cita medica el lunes",
    features: { wordCount: 5, specialCharRatio: 0.03, uppercaseRatio: 0.03, linkCount: 0, urgencyScore: 0.25, spamKeywordScore: 0.04 },
    clase: 0
  },
]

// Spam keywords for detection
const spamKeywords = [
  'gratis', 'free', 'ganaste', 'winner', 'premio', 'prize', 'urgente', 'urgent',
  'oferta', 'offer', 'descuento', 'discount', 'click', 'ahora', 'now', 'actua',
  'suspendida', 'suspended', 'verifica', 'verify', 'alerta', 'alert', 'dinero',
  'money', 'cash', 'dollar', 'euro', 'bitcoin', 'crypto', 'lottery', 'loteria',
  'credito', 'credit', 'prestamo', 'loan', 'banco', 'bank', 'cuenta', 'account',
  'password', 'contraseña', 'replica', 'rolex', 'viagra', 'casino', 'bet', 'apuesta',
  'millones', 'millions', 'increible', 'amazing', 'garantizado', 'guaranteed',
  'limitado', 'limited', 'exclusivo', 'exclusive', 'secreto', 'secret', 'promocion'
]

const urgencyKeywords = [
  'urgente', 'urgent', 'ahora', 'now', 'inmediato', 'immediately', 'rapido', 'fast',
  'pronto', 'soon', 'ultimo', 'last', 'final', 'expira', 'expires', 'limitado', 'limited',
  'hoy', 'today', 'actua', 'act', 'no esperes', 'dont wait', 'tiempo', 'time',
  'alerta', 'alert', 'aviso', 'warning', 'importante', 'important', 'atencion', 'attention'
]

// Extract features from email content
export function extractFeatures(content: string): EmailFeatures {
  const text = content.toLowerCase()
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const wordCount = words.length
  
  // Special character ratio (!, ?, $, etc.)
  const specialChars = (content.match(/[!?$%@#&*]+/g) || []).join('').length
  const specialCharRatio = Math.min(1, specialChars / Math.max(1, content.length))
  
  // Uppercase ratio
  const uppercaseChars = (content.match(/[A-Z]/g) || []).length
  const letterChars = (content.match(/[a-zA-Z]/g) || []).length
  const uppercaseRatio = letterChars > 0 ? uppercaseChars / letterChars : 0
  
  // Link count (http, https, www, shortened urls)
  const links = (content.match(/(https?:\/\/|www\.|bit\.ly|goo\.gl|tinyurl)/gi) || []).length
  const linkCount = Math.min(5, links)
  
  // Urgency score based on urgency keywords
  let urgencyCount = 0
  urgencyKeywords.forEach(keyword => {
    if (text.includes(keyword)) urgencyCount++
  })
  const urgencyScore = Math.min(1, urgencyCount / 5)
  
  // Spam keyword score
  let spamCount = 0
  spamKeywords.forEach(keyword => {
    if (text.includes(keyword)) spamCount++
  })
  const spamKeywordScore = Math.min(1, spamCount / 8)
  
  return {
    wordCount: Math.min(100, wordCount),
    specialCharRatio,
    uppercaseRatio,
    linkCount,
    urgencyScore,
    spamKeywordScore
  }
}

// ============================================
// SVM Implementation using SMO Algorithm
// ============================================

// Standardization parameters calculated from training data
function calculateStandardizationParams() {
  const features = trainingData.map(d => [
    d.features.specialCharRatio,
    d.features.uppercaseRatio,
    d.features.linkCount / 5,
    d.features.urgencyScore,
    d.features.spamKeywordScore
  ])
  
  const means: number[] = []
  const stds: number[] = []
  
  for (let i = 0; i < 5; i++) {
    const values = features.map(f => f[i])
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const std = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length)
    means.push(mean)
    stds.push(std || 1) // Prevent division by zero
  }
  
  return { means, stds }
}

const { means, stds } = calculateStandardizationParams()

function standardize(features: EmailFeatures): number[] {
  const raw = [
    features.specialCharRatio,
    features.uppercaseRatio,
    features.linkCount / 5,
    features.urgencyScore,
    features.spamKeywordScore
  ]
  return raw.map((v, i) => (v - means[i]) / stds[i])
}

// RBF (Gaussian) Kernel: K(x,z) = exp(-gamma * ||x-z||^2)
function rbfKernel(x1: number[], x2: number[], gamma: number): number {
  let sum = 0
  for (let i = 0; i < x1.length; i++) {
    sum += (x1[i] - x2[i]) ** 2
  }
  return Math.exp(-gamma * sum)
}

// SVM Model class
class SVM {
  private alphas: number[] = []
  private b = 0
  private X: number[][] = []
  private y: number[] = []
  private C: number
  private gamma: number
  private tol: number
  private maxPasses: number

  constructor(C = 1.0, gamma = 0.5, tol = 0.001, maxPasses = 100) {
    this.C = C
    this.gamma = gamma
    this.tol = tol
    this.maxPasses = maxPasses
  }

  // SMO (Sequential Minimal Optimization) Algorithm
  fit(X: number[][], y: number[]): void {
    const n = X.length
    this.X = X
    this.y = y
    this.alphas = new Array(n).fill(0)
    this.b = 0

    let passes = 0
    while (passes < this.maxPasses) {
      let numChangedAlphas = 0

      for (let i = 0; i < n; i++) {
        const Ei = this.decisionFunction(X[i]) - y[i]

        // Check KKT conditions
        if ((y[i] * Ei < -this.tol && this.alphas[i] < this.C) ||
            (y[i] * Ei > this.tol && this.alphas[i] > 0)) {
          
          // Select j randomly (j != i)
          let j = Math.floor(Math.random() * (n - 1))
          if (j >= i) j++

          const Ej = this.decisionFunction(X[j]) - y[j]

          const alphaIOld = this.alphas[i]
          const alphaJOld = this.alphas[j]

          // Compute L and H bounds
          let L: number, H: number
          if (y[i] !== y[j]) {
            L = Math.max(0, this.alphas[j] - this.alphas[i])
            H = Math.min(this.C, this.C + this.alphas[j] - this.alphas[i])
          } else {
            L = Math.max(0, this.alphas[i] + this.alphas[j] - this.C)
            H = Math.min(this.C, this.alphas[i] + this.alphas[j])
          }

          if (L === H) continue

          // Compute eta
          const Kii = rbfKernel(X[i], X[i], this.gamma)
          const Kjj = rbfKernel(X[j], X[j], this.gamma)
          const Kij = rbfKernel(X[i], X[j], this.gamma)
          const eta = 2 * Kij - Kii - Kjj

          if (eta >= 0) continue

          // Update alpha_j
          this.alphas[j] = alphaJOld - (y[j] * (Ei - Ej)) / eta
          this.alphas[j] = Math.min(H, Math.max(L, this.alphas[j]))

          if (Math.abs(this.alphas[j] - alphaJOld) < 1e-5) continue

          // Update alpha_i
          this.alphas[i] = alphaIOld + y[i] * y[j] * (alphaJOld - this.alphas[j])

          // Compute bias terms
          const b1 = this.b - Ei - y[i] * (this.alphas[i] - alphaIOld) * Kii -
                     y[j] * (this.alphas[j] - alphaJOld) * Kij
          const b2 = this.b - Ej - y[i] * (this.alphas[i] - alphaIOld) * Kij -
                     y[j] * (this.alphas[j] - alphaJOld) * Kjj

          if (this.alphas[i] > 0 && this.alphas[i] < this.C) {
            this.b = b1
          } else if (this.alphas[j] > 0 && this.alphas[j] < this.C) {
            this.b = b2
          } else {
            this.b = (b1 + b2) / 2
          }

          numChangedAlphas++
        }
      }

      if (numChangedAlphas === 0) {
        passes++
      } else {
        passes = 0
      }
    }
  }

  // Decision function: f(x) = sum(alpha_i * y_i * K(x_i, x)) + b
  decisionFunction(x: number[]): number {
    let sum = 0
    for (let i = 0; i < this.X.length; i++) {
      if (this.alphas[i] > 0) {
        sum += this.alphas[i] * this.y[i] * rbfKernel(this.X[i], x, this.gamma)
      }
    }
    return sum + this.b
  }

  // Predict class (-1 or 1)
  predict(x: number[]): number {
    return this.decisionFunction(x) >= 0 ? 1 : -1
  }

  // Get confidence based on distance from hyperplane
  getConfidence(x: number[]): number {
    const decision = Math.abs(this.decisionFunction(x))
    // Sigmoid transformation to get probability-like confidence
    const confidence = 1 / (1 + Math.exp(-decision * 2))
    return Math.min(0.99, Math.max(0.51, confidence))
  }

  // Get support vectors (points with alpha > 0)
  getSupportVectors(): { index: number; alpha: number }[] {
    const svs: { index: number; alpha: number }[] = []
    for (let i = 0; i < this.alphas.length; i++) {
      if (this.alphas[i] > 1e-5) {
        svs.push({ index: i, alpha: this.alphas[i] })
      }
    }
    return svs
  }

  getBias(): number {
    return this.b
  }
}

// Prepare training data
const X = trainingData.map(d => standardize(d.features))
const y = trainingData.map(d => (d.clase === 1 ? 1 : -1))

// Train the SVM model
const svmModel = new SVM(1.0, 0.8, 0.001, 300)
svmModel.fit(X, y)

// Export classification function
export function classify(content: string): { 
  prediction: number
  confidence: number
  features: EmailFeatures
  label: string
} {
  const features = extractFeatures(content)
  const point = standardize(features)
  const predictionRaw = svmModel.predict(point)
  const prediction = predictionRaw === 1 ? 1 : 0
  const confidence = svmModel.getConfidence(point) * 100
  const label = prediction === 1 ? 'SPAM' : 'HAM'

  return { 
    prediction, 
    confidence: Math.round(confidence * 100) / 100,
    features,
    label
  }
}

// Get support vectors info for visualization
export function getSupportVectorsInfo(): TrainingEmail[] {
  const svs = svmModel.getSupportVectors()
  return svs.map(sv => trainingData[sv.index]).filter(Boolean)
}

// Generate decision boundary points for visualization (2D projection using spamKeywordScore vs urgencyScore)
export function getDecisionBoundaryPoints(): { x: number; y: number; class: number }[] {
  const points: { x: number; y: number; class: number }[] = []

  // Use spam keyword score vs urgency score for 2D visualization
  for (let spamScore = 0; spamScore <= 1; spamScore += 0.05) {
    for (let urgencyScore = 0; urgencyScore <= 1; urgencyScore += 0.05) {
      const features: EmailFeatures = {
        wordCount: 10,
        specialCharRatio: 0.15,
        uppercaseRatio: 0.25,
        linkCount: 1,
        urgencyScore,
        spamKeywordScore: spamScore
      }
      const point = standardize(features)
      const prediction = svmModel.predict(point) === 1 ? 1 : 0
      points.push({ x: spamScore * 100, y: urgencyScore * 100, class: prediction })
    }
  }

  return points
}

// Get model metrics
export function getModelMetrics(): { supportVectorCount: number; bias: number; accuracy: number } {
  const svCount = svmModel.getSupportVectors().length
  const bias = svmModel.getBias()
  
  // Calculate training accuracy
  let correct = 0
  for (let i = 0; i < trainingData.length; i++) {
    const features = trainingData[i].features
    const point = standardize(features)
    const prediction = svmModel.predict(point) === 1 ? 1 : 0
    if (prediction === trainingData[i].clase) correct++
  }
  const accuracy = (correct / trainingData.length) * 100

  return { 
    supportVectorCount: svCount, 
    bias: Math.round(bias * 1000) / 1000, 
    accuracy: Math.round(accuracy * 10) / 10 
  }
}

// Get training data for chart visualization
export function getChartData(): { x: number; y: number; clase: number; subject: string }[] {
  return trainingData.map(d => ({
    x: d.features.spamKeywordScore * 100,
    y: d.features.urgencyScore * 100,
    clase: d.clase,
    subject: d.subject
  }))
}
