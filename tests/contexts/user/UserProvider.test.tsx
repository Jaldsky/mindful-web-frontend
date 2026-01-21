import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProvider } from '../../../src/contexts/user/UserProvider';
import { useUser } from '../../../src/contexts/hooks';
import { STORAGE_KEYS } from '../../../src/constants';

const TestComponent = () => {
  const { userId, setUserId, generateUserId } = useUser();

  return (
    <div>
      <div data-testid="userId">{userId || 'null'}</div>
      <button onClick={() => setUserId('test-id-123')}>Set ID</button>
      <button onClick={() => generateUserId()}>Generate ID</button>
    </div>
  );
};

describe('UserProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with null userId when no stored value', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Should auto-generate on mount
    await waitFor(() => {
      const userId = screen.getByTestId('userId').textContent;
      expect(userId).not.toBe('null');
    });
  });

  it('initializes with stored userId from localStorage', async () => {
    const storedId = 'stored-user-id-123';
    localStorage.setItem(STORAGE_KEYS.USER_ID, storedId);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('userId')).toHaveTextContent(storedId);
    });
  });

  it('auto-generates userId on mount if not present', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      const userId = screen.getByTestId('userId').textContent;
      expect(userId).not.toBe('null');
      expect(userId?.length).toBeGreaterThan(0);
    });
  });

  it('saves userId to localStorage when set', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setButton = screen.getByText('Set ID');
    setButton.click();

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEYS.USER_ID)).toBe('test-id-123');
    });
  });

  it('updates userId state when setUserId is called', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setButton = screen.getByText('Set ID');
    setButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('userId')).toHaveTextContent('test-id-123');
    });
  });

  it('generates new userId when generateUserId is called', async () => {
    const storedId = 'initial-id';
    localStorage.setItem(STORAGE_KEYS.USER_ID, storedId);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('userId')).toHaveTextContent(storedId);
    });

    const generateButton = screen.getByText('Generate ID');
    generateButton.click();

    await waitFor(() => {
      const newUserId = screen.getByTestId('userId').textContent;
      expect(newUserId).not.toBe(storedId);
      expect(newUserId).not.toBe('null');
    });
  });

  it('saves generated userId to localStorage', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const generateButton = screen.getByText('Generate ID');
    generateButton.click();

    await waitFor(() => {
      const storedId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      expect(storedId).not.toBeNull();
      expect(storedId?.length).toBeGreaterThan(0);
    });
  });

  it('generateUserId returns the new ID', async () => {
    const TestGenerateReturn = () => {
      const { generateUserId } = useUser();
      const [generatedId, setGeneratedId] = React.useState<string>('');

      return (
        <div>
          <div data-testid="generatedId">{generatedId}</div>
          <button
            onClick={() => {
              const id = generateUserId();
              setGeneratedId(id);
            }}
          >
            Generate
          </button>
        </div>
      );
    };

    render(
      <UserProvider>
        <TestGenerateReturn />
      </UserProvider>
    );

    const button = screen.getByText('Generate');
    button.click();

    await waitFor(() => {
      const generatedId = screen.getByTestId('generatedId').textContent;
      expect(generatedId?.length).toBeGreaterThan(0);
    });
  });

  it('persists userId across re-renders', async () => {
    const { rerender } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setButton = screen.getByText('Set ID');
    setButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('userId')).toHaveTextContent('test-id-123');
    });

    rerender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('userId')).toHaveTextContent('test-id-123');
    });
  });

  it('provides all context functions', () => {
    const TestContextMethods = () => {
      const context = useUser();
      return (
        <div>
          <div data-testid="hasUserId">{context.userId !== undefined ? 'yes' : 'no'}</div>
          <div data-testid="hasSetUserId">{typeof context.setUserId === 'function' ? 'yes' : 'no'}</div>
          <div data-testid="hasGenerateUserId">{typeof context.generateUserId === 'function' ? 'yes' : 'no'}</div>
        </div>
      );
    };

    render(
      <UserProvider>
        <TestContextMethods />
      </UserProvider>
    );

    expect(screen.getByTestId('hasUserId')).toHaveTextContent('yes');
    expect(screen.getByTestId('hasSetUserId')).toHaveTextContent('yes');
    expect(screen.getByTestId('hasGenerateUserId')).toHaveTextContent('yes');
  });

  it('does not regenerate ID if one already exists', async () => {
    const existingId = 'existing-id-123';
    localStorage.setItem(STORAGE_KEYS.USER_ID, existingId);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('userId')).toHaveTextContent(existingId);
    });

    // Wait a bit to ensure no auto-generation happens
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(screen.getByTestId('userId')).toHaveTextContent(existingId);
    expect(localStorage.getItem(STORAGE_KEYS.USER_ID)).toBe(existingId);
  });
});
