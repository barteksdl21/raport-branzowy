"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2 } from "lucide-react"

interface ReportFormProps {
  defaultReport: string
}

export function ReportForm({ defaultReport }: ReportFormProps) {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    report: "meat",
    consent: false,
    marketing: false,
  })
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, report: value }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormState((prev) => ({ ...prev, [name]: checked }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }
  
  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-primary">Dziękujemy!</h3>
        <p className="text-gray-600">
          Twój raport został wysłany na podany adres email. Sprawdź swoją skrzynkę odbiorczą.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4">
          Pobierz inny raport
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Pobierz raport branżowy</h3>
      <p className="text-gray-600 text-sm">Wypełnij formularz, aby otrzymać szczegółowy raport na swój adres e-mail.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Imię *</Label>
            <Input 
              id="firstName" 
              name="firstName" 
              value={formState.firstName}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nazwisko *</Label>
            <Input 
              id="lastName" 
              name="lastName" 
              value={formState.lastName}
              onChange={handleChange}
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formState.email}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Nazwa firmy *</Label>
          <Input 
            id="company" 
            name="company" 
            value={formState.company}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="report">Wybierz raport *</Label>
          <Select defaultValue="meat" onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz raport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meat">Raport branży mięsnej</SelectItem>
              <SelectItem value="dairy">Raport branży mleczarskiej</SelectItem>
              <SelectItem value="fruits">Raport branży owocowo-warzywnej</SelectItem>
              <SelectItem value="seafood">Raport branży rybnej</SelectItem>
              <SelectItem value="grain">Raport branży zbożowej</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="consent" 
              checked={formState.consent}
              onCheckedChange={(checked) => handleCheckboxChange("consent", checked as boolean)}
              required 
            />
            <Label htmlFor="consent" className="text-sm">
              Wyrażam zgodę na przetwarzanie moich danych osobowych w celu otrzymania raportu *
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="marketing" 
              checked={formState.marketing}
              onCheckedChange={(checked) => handleCheckboxChange("marketing", checked as boolean)}
            />
            <Label htmlFor="marketing" className="text-sm">
              Wyrażam zgodę na otrzymywanie informacji marketingowych od Eurofins Polska
            </Label>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-eurofins-orange hover:bg-eurofins-orange/90 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wysyłanie..." : "Pobierz raport"}
        </Button>
        
        <p className="text-xs text-gray-500">
          * Pola wymagane. Twoje dane są chronione zgodnie z naszą <a href="#" className="underline">polityką prywatności</a>.
        </p>
      </form>
    </div>
  )
}
