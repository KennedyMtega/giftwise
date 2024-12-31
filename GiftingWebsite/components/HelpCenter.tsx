import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
  { 
    question: 'How do I create a gift list?',
    answer: 'To create a gift list, go to your profile and click on "Create New List". You can then add items, set preferences, and share the list with friends and family.'
  },
  {
    question: 'Can I contribute to someone else\'s gift?',
    answer: 'Yes! When viewing a friend\'s gift list, you\'ll see an option to contribute to any gift. You can choose how much you want to contribute.'
  },
  {
    question: 'How do refunds work?',
    answer: 'If you need a refund, please contact our support team within 14 days of purchase. We\'ll guide you through the process and issue a refund to your original payment method.'
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Absolutely. We use industry-standard encryption to protect your payment information. We never store your full credit card details on our servers.'
  },
]

export function HelpCenter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Help Center</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

