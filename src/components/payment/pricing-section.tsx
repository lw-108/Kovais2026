import { IndianPaymentMethods } from './indian-payment-methods'
import { ServiceConfirmationDialog, type ServiceDetails } from './service-confirmation-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, IndianRupee, CreditCard } from 'lucide-react'
import { useState } from 'react'

interface PricingPlan {
  name: string
  price: string
  priceInr: number
  description: string
  features: string[]
  paymentLinkId?: string
  priceId?: string
  popular?: boolean
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Basic',
    price: '$9',
    priceInr: 749,
    description: 'Perfect for getting started',
    features: [
      'Basic recognition features',
      'Email support',
      '1 year access'
    ],
    paymentLinkId: 'bEaW0m2k9m2k9m2k9m2k' // Replace with actual Stripe Payment Link ID
  },
  {
    name: 'Professional',
    price: '$29',
    priceInr: 2399,
    description: 'Best for growing businesses',
    features: [
      'Advanced recognition features',
      'Priority support',
      '3 years access',
      'Custom branding'
    ],
    paymentLinkId: '9kW0m2k9m2k9m2k9m2k9m', // Replace with actual Stripe Payment Link ID
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$99',
    priceInr: 8199,
    description: 'For large organizations',
    features: [
      'All features included',
      'Dedicated support',
      'Lifetime access',
      'Custom integrations',
      'API access'
    ],
    paymentLinkId: 'aEaW0m2k9m2k9m2k9m2k' // Replace with actual Stripe Payment Link ID
  }
]

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [showIndianPayments, setShowIndianPayments] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe')
  const [confirmedServiceDetails, setConfirmedServiceDetails] = useState<ServiceDetails | null>(null)

  const handlePayment = (plan: PricingPlan, method: 'stripe' | 'razorpay') => {
    setSelectedPlan(plan)
    setPaymentMethod(method)
    setShowConfirmation(true)
  }

  const handleConfirmationConfirm = (serviceDetails: ServiceDetails) => {
    setConfirmedServiceDetails(serviceDetails)
    setShowConfirmation(false)
    
    if (paymentMethod === 'razorpay') {
      setShowIndianPayments(true)
    } else {
      // Handle Stripe payment here
      console.log('Processing Stripe payment:', serviceDetails)
    }
  }

  const handlePaymentSuccess = () => {
    setShowIndianPayments(false)
    setSelectedPlan(null)
    setConfirmedServiceDetails(null)
  }

  const createServiceDetails = (plan: PricingPlan): ServiceDetails => {
    return {
      planName: plan.name,
      basePrice: parseInt(plan.price.replace('$', '')),
      basePriceInr: plan.priceInr,
      currency: paymentMethod === 'stripe' ? 'USD' : 'INR',
      paymentMethod,
      requirements: [
        {
          id: 'recognition',
          name: 'Recognition Services',
          included: true,
          description: 'Professional recognition and award services'
        },
        {
          id: 'support',
          name: 'Email Support',
          included: true,
          description: 'Dedicated email support throughout the process'
        },
        {
          id: 'duration',
          name: plan.name === 'Enterprise' ? 'Lifetime Access' : `${plan.name === 'Basic' ? '1' : '3'} Year Access`,
          included: true,
          description: 'Full access to all recognition features'
        },
        ...(plan.name === 'Professional' || plan.name === 'Enterprise' ? [
          {
            id: 'priority',
            name: 'Priority Support',
            included: true,
            description: 'Fast-track support with priority handling'
          }
        ] : []),
        ...(plan.name === 'Enterprise' ? [
          {
            id: 'branding',
            name: 'Custom Branding',
            included: true,
            description: 'Personalized branding and customization'
          },
          {
            id: 'api',
            name: 'API Access',
            included: true,
            description: 'Full API access for integrations'
          }
        ] : [])
      ],
      additionalServices: [
        {
          id: 'rush-delivery',
          name: 'Rush Delivery (24-48 hours)',
          price: 49,
          description: 'Get your recognition processed within 24-48 hours',
          selected: false
        },
        {
          id: 'consultation',
          name: 'Expert Consultation (1 hour)',
          price: 99,
          description: 'One-on-one consultation with recognition experts',
          selected: false
        },
        {
          id: 'certificate',
          name: 'Premium Certificate Package',
          price: 29,
          description: 'Physical certificate + digital versions + framing',
          selected: false
        },
        {
          id: 'media',
          name: 'Media Promotion Package',
          price: 199,
          description: 'Press release distribution and media promotion',
          selected: false
        }
      ],
      totalAmount: parseInt(plan.price.replace('$', '')),
      totalAmountInr: plan.priceInr
    }
  }

  if (showIndianPayments && confirmedServiceDetails) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Complete Your Payment</h2>
            <p className="text-muted-foreground">
              {confirmedServiceDetails.planName} Plan - ₹{confirmedServiceDetails.totalAmountInr}
            </p>
          </div>
          
          <IndianPaymentMethods
            amount={confirmedServiceDetails.totalAmountInr}
            description={`${confirmedServiceDetails.planName} Plan - Kovais 2026 Recognition`}
            onSuccess={handlePaymentSuccess}
          />
          
          <div className="text-center mt-6">
            <button
              onClick={() => setShowIndianPayments(false)}
              className="text-muted-foreground hover:text-foreground underline"
            >
              ← Back to confirmation
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your recognition needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="space-y-2 mt-4">
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-muted-foreground">/one-time</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-lg text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    <span>{plan.priceInr}</span>
                    <span className="text-sm">/one-time</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handlePayment(plan, 'stripe')}
                    className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pay with Card
                  </button>
                  <button
                    onClick={() => handlePayment(plan, 'razorpay')}
                    className="w-full py-2 px-4 border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <IndianRupee className="h-4 w-4" />
                    Pay with Indian Methods
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Confirmation Dialog */}
      {selectedPlan && (
        <ServiceConfirmationDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          serviceDetails={createServiceDetails(selectedPlan)}
          onConfirm={handleConfirmationConfirm}
          onBack={() => setShowConfirmation(false)}
        />
      )}
    </section>
  )
}
