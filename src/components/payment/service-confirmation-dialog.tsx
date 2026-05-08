import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Check, X, IndianRupee, CreditCard, Users, Clock, Shield, Star } from 'lucide-react'

export interface ServiceRequirement {
  id: string
  name: string
  included: boolean
  description?: string
}

export interface AdditionalService {
  id: string
  name: string
  price: number
  description: string
  selected: boolean
}

export interface ServiceDetails {
  planName: string
  basePrice: number
  basePriceInr: number
  currency: string
  requirements: ServiceRequirement[]
  additionalServices: AdditionalService[]
  totalAmount: number
  totalAmountInr: number
  paymentMethod: 'stripe' | 'razorpay'
}

interface ServiceConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  serviceDetails: ServiceDetails
  onConfirm: (updatedDetails: ServiceDetails) => void
  onBack: () => void
}

export function ServiceConfirmationDialog({
  isOpen,
  onClose,
  serviceDetails,
  onConfirm,
  onBack
}: ServiceConfirmationDialogProps) {
  const [updatedServices, setUpdatedServices] = useState<AdditionalService[]>(
    serviceDetails.additionalServices
  )

  const toggleAdditionalService = (serviceId: string) => {
    setUpdatedServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, selected: !service.selected }
          : service
      )
    )
  }

  const calculateTotal = () => {
    const additionalTotal = updatedServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.price, 0)
    
    return {
      baseAmount: serviceDetails.basePrice,
      baseAmountInr: serviceDetails.basePriceInr,
      additionalAmount: additionalTotal,
      additionalAmountInr: Math.round(additionalTotal * 83), // Approximate conversion rate
      totalAmount: serviceDetails.basePrice + additionalTotal,
      totalAmountInr: serviceDetails.basePriceInr + Math.round(additionalTotal * 83)
    }
  }

  const totals = calculateTotal()

  const handleConfirm = () => {
    const updatedDetails: ServiceDetails = {
      ...serviceDetails,
      additionalServices: updatedServices,
      totalAmount: totals.totalAmount,
      totalAmountInr: totals.totalAmountInr
    }
    onConfirm(updatedDetails)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Confirm Your Service Selection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{serviceDetails.planName} Plan</h3>
                  <p className="text-muted-foreground">Review your selected services</p>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {serviceDetails.currency === 'USD' ? '$' : '₹'}
                  {serviceDetails.currency === 'USD' ? totals.totalAmount : totals.totalAmountInr}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Core Requirements */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Core Services Included
            </h4>
            <div className="grid gap-3">
              {serviceDetails.requirements.map((req) => (
                <div
                  key={req.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  {req.included ? (
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{req.name}</p>
                    {req.description && (
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Additional Services (Optional)
            </h4>
            <div className="grid gap-3">
              {updatedServices.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    service.selected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleAdditionalService(service.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium">{service.name}</p>
                        <Badge variant="outline">
                          ${service.price} / ₹{Math.round(service.price * 83)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <div className="ml-4">
                      {service.selected ? (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-border" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pricing Breakdown */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pricing Breakdown
            </h4>
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Base Price ({serviceDetails.planName})</span>
                  <span>
                    {serviceDetails.currency === 'USD' ? '$' : '₹'}
                    {serviceDetails.currency === 'USD' ? totals.baseAmount : totals.baseAmountInr}
                  </span>
                </div>
                
                {totals.additionalAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Additional Services</span>
                    <span>
                      +{serviceDetails.currency === 'USD' ? '$' : '₹'}
                      {serviceDetails.currency === 'USD' ? totals.additionalAmount : totals.additionalAmountInr}
                    </span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-primary">
                    {serviceDetails.currency === 'USD' ? '$' : '₹'}
                    {serviceDetails.currency === 'USD' ? totals.totalAmount : totals.totalAmountInr}
                  </span>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  {serviceDetails.currency === 'USD' 
                    ? `≈ ₹${totals.totalAmountInr} for Indian customers`
                    : `≈ $${(totals.totalAmountInr / 83).toFixed(2)} for international customers`
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              What You Get
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Expert Support</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Quick Delivery</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Secure Payment</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Quality Guaranteed</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              ← Back to Plans
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              size="lg"
            >
              Proceed to Payment →
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
