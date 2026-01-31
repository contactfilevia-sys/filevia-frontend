export interface Tool {
  slug: string
  name: string
  description: string
  fromFormat: string
  toFormat: string
  icon: string
  color: string
}

export type ServiceStatus = 'active' | 'coming-soon'

export interface ConversionStep {
  step: number
  title: string
  description: string
  icon: string
}

export interface FAQ {
  question: string
  answer: string
}
