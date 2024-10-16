import React from 'react'
import { render, screen } from '@testing-library/react'
import Popup from '../../src/popup/Popup'
import { useMessages } from '../../src/popup/context'

jest.mock('../../src/popup/context', () => ({
  useMessages: jest.fn(),
}))

describe('Popup Component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the MessageList when there are messages', () => {
    ;(useMessages as jest.Mock).mockReturnValue([
      {
        messages: [
          {
            id: 'msg1',
            content: 'Test Message 1',
            priority: 'high',
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
        hasMessages: true,
        sortBy: 'unread',
      },
      {
        updateMessage: jest.fn(),
        sortMessages: jest.fn(),
      },
    ])

    render(<Popup />)

    expect(screen.getByText('Test Message 1')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Messages/i }),
    ).toBeInTheDocument()
  })

  it('should render the EmptyMessages component when there are no messages', () => {
    ;(useMessages as jest.Mock).mockReturnValue([
      {
        messages: [],
        hasMessages: false,
        sortBy: 'unread',
      },
      {
        updateMessage: jest.fn(),
        sortMessages: jest.fn(),
      },
    ])

    render(<Popup />)

    // Check that the EmptyMessages component is rendered
    expect(
      screen.getByText(/It looks like there are no messages at the moment./i),
    ).toBeInTheDocument()
  })

  it('should render the SortControl when there are messages', () => {
    // Mock the state returned by useMessages to simulate messages available
    ;(useMessages as jest.Mock).mockReturnValue([
      {
        messages: [
          {
            id: 'msg1',
            content: 'Test Message 1',
            priority: 'high',
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
        hasMessages: true,
        sortBy: 'unread',
      },
      {
        updateMessage: jest.fn(),
        sortMessages: jest.fn(),
      },
    ])

    render(<Popup />)

    // Check that the SortControl is rendered
    expect(
      screen.getByRole('button', { name: /Sort by Unread/i }),
    ).toBeInTheDocument()
  })

  it('should not render SortControl when there are no messages', () => {
    // Mock the state returned by useMessages to simulate no messages
    ;(useMessages as jest.Mock).mockReturnValue([
      {
        messages: [],
        hasMessages: false,
        sortBy: 'unread',
      },
      {
        updateMessage: jest.fn(),
        sortMessages: jest.fn(),
      },
    ])

    render(<Popup />)

    // Ensure SortControl is not rendered
    expect(
      screen.queryByRole('button', { name: /Sort by Unread/i }),
    ).not.toBeInTheDocument()
  })
})
