import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GiftWise - Your Comprehensive Gift-Giving Website',
  description: 'Find the perfect gift for any occasion with GiftWise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-grow container mx-auto px-4 py-8 w-full">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

