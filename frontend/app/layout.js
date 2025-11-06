import './globals.css'

export const metadata = {
  title: 'TIMVEST - APEX FINANCIAL HUB',
  description: 'Professional Business Setup & Compliance Services',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}