import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RazorpayPayment } from '@/lib/razorpay'
import { 
  Smartphone, 
  CreditCard, 
  Building2, 
  Wallet, 
  Loader2,
  CheckCircle
} from 'lucide-react'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  popular?: boolean
  action: (amount: number, description: string) => Promise<void>
}

interface IndianPaymentMethodsProps {
  amount: number
  description: string
  onSuccess?: () => void
}

export function IndianPaymentMethods({ amount, description, onSuccess }: IndianPaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Pay using UPI apps like GPay, PhonePe, Paytm',
      popular: true,
      action: RazorpayPayment.initiateUPIPayment
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Visa, Mastercard, RuPay, American Express',
      action: RazorpayPayment.initiateCardPayment
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="h-6 w-6" />,
      description: 'All major Indian banks supported',
      action: RazorpayPayment.initiateNetBankingPayment
    },
    {
      id: 'wallet',
      name: 'Wallets',
      icon: <Wallet className="h-6 w-6" />,
      description: 'Paytm, PhonePe, Amazon Pay, and more',
      action: RazorpayPayment.initiatePayment
    }
  ]

  const handlePayment = async (method: PaymentMethod) => {
    setSelectedMethod(method.id)
    setIsProcessing(true)
    
    try {
      await method.action(amount, description)
      setPaymentSuccess(true)
      onSuccess?.()
    } catch (error) {
      console.error('Payment error:', error)
      // You can add toast notification here
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
      setSelectedMethod('')
    }
  }

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold">Payment Successful!</h3>
              <p className="text-muted-foreground">Thank you for your purchase.</p>
            </div>
            <Button 
              onClick={() => setPaymentSuccess(false)}
              variant="outline"
              className="w-full"
            >
              Make Another Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Choose Payment Method</h3>
        <p className="text-muted-foreground">
          Select your preferred payment method for ₹{amount}
        </p>
      </div>

      <div className="grid gap-3">
        {paymentMethods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMethod === method.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => !isProcessing && handlePayment(method)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {method.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {method.name}
                      {method.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {method.description}
                    </CardDescription>
                  </div>
                </div>
                {isProcessing && selectedMethod === method.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Button size="sm" disabled={isProcessing}>
                    Pay ₹{amount}
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>Secured by Razorpay • 100% Secure Payments</p>
        <p>All Indian payment methods supported</p>
      </div>
    </div>
  )
}
