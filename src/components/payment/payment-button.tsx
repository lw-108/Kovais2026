import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createCheckoutSession, redirectToStripePaymentLink } from '@/lib/stripe'
import { Loader2, CreditCard } from 'lucide-react'

interface PaymentButtonProps {
  priceId?: string
  paymentLinkId?: string
  amount: string
  className?: string
}

export function PaymentButton({ 
  priceId, 
  paymentLinkId, 
  amount, 
  className 
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      if (paymentLinkId) {
        // Static approach - redirect to Stripe Payment Link
        redirectToStripePaymentLink(paymentLinkId)
      } else if (priceId) {
        // Dynamic approach - create checkout session
        await createCheckoutSession(priceId)
      } else {
        throw new Error('No payment method configured')
      }
    } catch (error) {
      console.error('Payment error:', error)
      // You can add toast notification here
      alert('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay {amount}
        </>
      )}
    </Button>
  )
}
