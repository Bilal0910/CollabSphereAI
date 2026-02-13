import SubscribeButton from '@/components/buttons/checkout'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Code, Download, Palette, Sparkles, Zap } from 'lucide-react'
import React from 'react'

const plans = [
  {
    name: 'Standard Plan',
    price: '$9.99',
    credits: '10 Monthly Credits',
    badge: 'Most Popular',
    description: 'Perfect for freelancers and creators starting out.',
    features: [
      'AI-Powered Design Generation',
      'Premium Asset Exports',
      'Advanced Processing',
      '10 Monthly Credits',
      'Simple Credit System',
    ],
  },
  {
    name: 'Pro Plan',
    price: '$19.99',
    credits: '50 Monthly Credits',
    badge: 'Best Value',
    description: 'For professionals who need more power and higher limits.',
    features: [
      'Everything in Standard',
      'Priority Processing',
      'Higher Export Limits',
      '50 Monthly Credits',
      'Faster AI Tasks',
    ],
  },
  {
    name: 'Pro Plus Plan',
    price: '$39.99',
    credits: '150 Monthly Credits',
    badge: 'Power Users',
    description: 'Built for agencies and teams shipping at scale.',
    features: [
      'Everything in Pro',
      'Ultra-fast AI Processing',
      'Bulk Exports',
      '150 Monthly Credits',
      'Priority Support',
    ],
  },
  {
    name: 'Premium Plan',
    price: '$79.99',
    credits: 'Unlimited Credits',
    badge: 'All Access',
    description: 'Unlimited creativity with maximum performance.',
    features: [
      'Everything in Pro Plus',
      'Unlimited Credits',
      'Dedicated Support',
      'Early Feature Access',
      'Custom AI Models',
    ],
  },
]


const Page = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-primary/60 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            Unlock CollabSphereAI Premium
          </h1>

          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Transform your design workflow with AI-powered tools and unlimited
            creativity
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  {plans.map((plan) => (
    <Card
      key={plan.name}
      className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] shadow-xl saturate-150"
    >
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-3">
          <Badge
            variant="secondary"
            className="bg-primary/20 text-primary border-primary/30 px-3 py-1 text-xs font-medium rounded-full"
          >
            {plan.badge}
          </Badge>
        </div>

        <CardTitle className="text-2xl font-bold text-foreground mb-2">
          {plan.name}
        </CardTitle>

        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-bold text-foreground">{plan.price}</span>
          <span className="text-muted-foreground text-base">/month</span>
        </div>

        <CardDescription className="text-muted-foreground text-sm mt-2">
          {plan.credits}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-6">
        <p className="text-muted-foreground text-sm text-center">
          {plan.description}
        </p>

        <div className="space-y-2">
          {plan.features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]"
            >
              <Check className="w-4 h-4 text-primary" />
              <p className="text-sm text-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 px-6 pb-6">
        <SubscribeButton />

        <p className="text-muted-foreground text-xs text-center">
          Cancel anytime • No setup fees • Instant access
        </p>
      </CardFooter>
    </Card>
  ))}
</div>


        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-muted-foreground text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-400" />
              <span>Secure Payment</span>
            </div>

            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-400" />
              <span>30-Day Guarantee</span>
            </div>

            <div className="flex items-center gap-2">
              <Check className="w-3 h-3" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

      </div>
    </div >
  )
}


export default Page