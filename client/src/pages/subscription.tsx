import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: 'Forever',
    features: [
      'Basic kernel customization',
      'Community support',
      '5 builds per month',
      'Standard device support'
    ],
    limitations: true
  },
  {
    id: '3_month',
    name: 'Pro (3 Months)',
    price: 30,
    duration: '3 months',
    features: [
      'Advanced kernel features',
      'NetHunter integration',
      'Unlimited builds',
      'Premium device support',
      'Priority support',
      'Custom ROMs',
      'TWRP customization'
    ],
    popular: false
  },
  {
    id: '6_month',
    name: 'Pro (6 Months)',
    price: 50,
    duration: '6 months',
    features: [
      'Everything in 3-month plan',
      'Advanced debugging tools',
      'Custom driver integration',
      'Exclusive templates',
      '25% savings vs 3-month'
    ],
    popular: true
  },
  {
    id: '12_month',
    name: 'Pro (12 Months)',
    price: 95,
    duration: '12 months',
    features: [
      'Everything in 6-month plan',
      'One-on-one consultation',
      'Custom feature requests',
      'Beta access to new tools',
      '50% savings vs 3-month'
    ],
    popular: false
  }
];

function CheckoutForm({ plan }: { plan: typeof subscriptionPlans[0] }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?payment=success&plan=${plan.id}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-emerald-400 mb-2">{plan.name}</h3>
        <p className="text-2xl font-bold text-white">${plan.price}</p>
        <p className="text-slate-400">for {plan.duration}</p>
      </div>
      
      <PaymentElement 
        options={{
          layout: "tabs"
        }}
      />
      
      <Button 
        type="submit" 
        disabled={!stripe} 
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        Subscribe to {plan.name}
      </Button>
    </form>
  );
}

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<typeof subscriptionPlans[0] | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const { toast } = useToast();

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (plan: typeof subscriptionPlans[0]) => {
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount: plan.price,
        plan: plan.id,
      });
      return response;
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (plan: typeof subscriptionPlans[0]) => {
    if (plan.id === 'free') {
      toast({
        title: "Free Plan Selected",
        description: "You're already on the free plan!",
      });
      return;
    }
    
    setSelectedPlan(plan);
    createPaymentIntentMutation.mutate(plan);
  };

  if (selectedPlan && clientSecret) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-400 mb-2">Complete Your Subscription</h1>
            <p className="text-slate-300">Secure payment powered by Stripe</p>
          </div>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#10b981',
                    },
                  },
                }}
              >
                <CheckoutForm plan={selectedPlan} />
              </Elements>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedPlan(null);
                setClientSecret('');
              }}
              className="text-slate-400 hover:text-white"
            >
              ← Back to Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-400 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-slate-300">Unlock the full potential of Android customization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`bg-slate-900 border-slate-700 relative ${
                plan.popular ? 'ring-2 ring-emerald-500' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="text-emerald-400">{plan.name}</CardTitle>
                <CardDescription className="text-slate-400">
                  Perfect for {plan.id === 'free' ? 'getting started' : 'serious developers'}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400">/{plan.duration}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={createPaymentIntentMutation.isPending}
                  className={`w-full ${
                    plan.id === 'free' 
                      ? 'bg-slate-700 hover:bg-slate-600' 
                      : plan.popular
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {plan.id === 'free' ? 'Current Plan' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">All plans include:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-300">
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Secure Stripe payments</span>
            <span>✓ Instant activation</span>
          </div>
        </div>
      </div>
    </div>
  );
}