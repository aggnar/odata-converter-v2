import './globals.css'

export const metadata = {
  title: 'OData Metadata Parser',
  description: 'Parse OData metadata to JSON objects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}