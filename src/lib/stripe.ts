import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export const createCheckoutSession = async (priceId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
      }),
    })

    const session = await response.json()
    
    if (session.error) {
      throw new Error(session.error)
    }

    const stripe = await stripePromise
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      })
      
      if (error) {
        throw new Error(error.message)
      }
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Alternative: Use Stripe Payment Links for fully static approach
export const redirectToStripePaymentLink = (paymentLinkId: string) => {
  window.location.href = `https://buy.stripe.com/${paymentLinkId}`
}
