import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import { useState } from 'react'
import { Toaster } from 'sonner'

import { Inter } from '@/utils'

const App = ({ Component, pageProps }: AppProps) => {
  const [client] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <main className={`antialiased ${Inter.className}`} data-theme="kaggle">
        <Toaster richColors={true} />
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  )
}

export default App
