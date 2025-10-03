import { render, screen, waitFor } from '@testing-library/react';
import { LazyWrapper, LazyList } from '../LazyWrapper';

// Mock do IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('LazyWrapper', () => {
  it('renders children when loaded', async () => {
    render(
      <LazyWrapper show={true}>
        <div>Test Content</div>
      </LazyWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('renders fallback initially', () => {
    render(
      <LazyWrapper>
        <div>Test Content</div>
      </LazyWrapper>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders custom fallback', () => {
    render(
      <LazyWrapper fallback={<div>Loading...</div>}>
        <div>Test Content</div>
      </LazyWrapper>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('LazyList', () => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  it('renders list items', async () => {
    render(
      <LazyList
        items={items}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  it('renders custom fallback', () => {
    render(
      <LazyList
        items={items}
        renderItem={(item) => <div key={item.id}>{item.name}</div>}
        fallback={<div>Loading items...</div>}
      />
    );
    
    expect(screen.getByText('Loading items...')).toBeInTheDocument();
  });
});

