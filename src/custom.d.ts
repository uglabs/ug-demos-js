// W3C Screen Wake Lock API
// https://w3c.github.io/screen-wake-lock/

interface WakeLock {
  request(type: 'screen'): Promise<WakeLockSentinel>
}

interface WakeLockSentinel extends EventTarget {
  readonly released: boolean
  readonly type: 'screen'
  release(): Promise<void>
  onrelease: ((this: WakeLockSentinel, ev: Event) => any) | null
}

interface Navigator {
  readonly wakeLock: WakeLock
}
