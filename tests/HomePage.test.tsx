import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import HomePage from '../app/page'
import { ReactNode } from 'react'

vi.mock('next/font/google', () => {
  return {
    Inter: () => ({ className: 'inter' }),
  }
})

vi.mock('@clerk/nextjs', () => {
  // Create an mockedFunctions object to match the functions we are importing from the @nextjs/clerk package in the ClerkComponent component.
  const mockedFunctions = {
    auth: () =>
      new Promise((resolve) =>
        resolve({ userId: 'user_2NNEqL2nrIRdJ194ndJqAHwEfxC' })
      ),
    ClerkProvider: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
    useUser: () => ({
      isSignedIn: true,
      user: {
        id: 'user_2NNEqL2nrIRdJ194ndJqAHwEfxC',
        fullName: 'Charles Harris',
      },
    }),
  }

  return mockedFunctions
})

// HomePage is a Server Component
test('should render HomePage', async () => {
  render(<HomePage />)
  expect(screen.getByText('The best journal app, period.')).toBeInTheDocument()
})
