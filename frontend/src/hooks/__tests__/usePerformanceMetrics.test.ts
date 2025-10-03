import { renderHook, act } from '@testing-library/react';
import { usePerformanceMetrics } from '../usePerformanceMetrics';

// Mock do performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1024 * 1024 * 10,
    totalJSHeapSize: 1024 * 1024 * 20,
    jsHeapSizeLimit: 1024 * 1024 * 100
  }
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
});

// Mock do PerformanceObserver
const mockPerformanceObserver = jest.fn();
mockPerformanceObserver.mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));
window.PerformanceObserver = mockPerformanceObserver as unknown as typeof PerformanceObserver;

// Mock do navigator.connection
Object.defineProperty(navigator, 'connection', {
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50
  },
  writable: true
});

describe('usePerformanceMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty metrics', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    
    expect(result.current.metrics).toEqual([]);
    expect(result.current.isSupported).toBe(true);
  });

  it('adds custom metrics', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    
    act(() => {
      result.current.addMetric('test-metric', 100, 'timing');
    });
    
    expect(result.current.metrics).toHaveLength(1);
    expect(result.current.metrics[0].name).toBe('test-metric');
    expect(result.current.metrics[0].value).toBe(100);
  });

  it('measures synchronous function execution time', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    
    const testFn = jest.fn(() => {
      // Simulate some work
      for (let i = 0; i < 1000; i++) {
        Math.random();
      }
    });
    
    act(() => {
      result.current.measureTime('test-function', testFn);
    });
    
    expect(testFn).toHaveBeenCalled();
    expect(result.current.metrics).toHaveLength(1);
    expect(result.current.metrics[0].name).toBe('test-function');
  });

  it('measures asynchronous function execution time', async () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    
    const testAsyncFn = jest.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'result';
    });
    
    let resultValue;
    await act(async () => {
      resultValue = await result.current.measureAsyncTime('test-async-function', testAsyncFn);
    });
    
    expect(testAsyncFn).toHaveBeenCalled();
    expect(resultValue).toBe('result');
    expect(result.current.metrics).toHaveLength(1);
    expect(result.current.metrics[0].name).toBe('test-async-function');
  });

  it('filters metrics by type', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    
    act(() => {
      result.current.addMetric('timing-metric', 100, 'timing');
      result.current.addMetric('gauge-metric', 200, 'gauge');
      result.current.addMetric('counter-metric', 300, 'counter');
    });
    
    const timingMetrics = result.current.getMetricsByType('timing');
    const gaugeMetrics = result.current.getMetricsByType('gauge');
    
    expect(timingMetrics).toHaveLength(1);
    expect(timingMetrics[0].name).toBe('timing-metric');
    expect(gaugeMetrics).toHaveLength(1);
    expect(gaugeMetrics[0].name).toBe('gauge-metric');
  });

  it('filters metrics by name', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    
    act(() => {
      result.current.addMetric('test-metric', 100, 'timing');
      result.current.addMetric('test-metric', 200, 'gauge');
      result.current.addMetric('other-metric', 300, 'timing');
    });
    
    const testMetrics = result.current.getMetricsByName('test-metric');
    
    expect(testMetrics).toHaveLength(2);
    expect(testMetrics.every(m => m.name === 'test-metric')).toBe(true);
  });

  it('calculates statistics correctly', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    
    act(() => {
      result.current.addMetric('timing-1', 100, 'timing');
      result.current.addMetric('timing-2', 200, 'timing');
      result.current.addMetric('gauge-1', 300, 'gauge');
    });
    
    const stats = result.current.getStats();
    
    expect(stats.total).toBe(3);
    expect(stats.timing.count).toBe(2);
    expect(stats.timing.average).toBe(150);
    expect(stats.timing.min).toBe(100);
    expect(stats.timing.max).toBe(200);
    expect(stats.gauge.count).toBe(1);
    expect(stats.gauge.latest).toBe(300);
  });

  it('clears metrics', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    
    act(() => {
      result.current.addMetric('test-metric', 100, 'timing');
    });
    
    expect(result.current.metrics).toHaveLength(1);
    
    act(() => {
      result.current.clearMetrics();
    });
    
    expect(result.current.metrics).toHaveLength(0);
  });
});
