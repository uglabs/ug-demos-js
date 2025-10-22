/**
 * Helps to prevent the screen from dimming on some devices.
 * Request should be called upon user tap (Safari’s policy)
 */
export class ScreenWakeLock {
  private wakeLock: WakeLockSentinel | null = null

  async request() {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen')
        this.wakeLock.addEventListener('release', () => {
          console.log('Screen Wake Lock was released')
        })
        console.log('Screen Wake Lock is active')
      } catch (err) {
        if (err instanceof Error) {
          console.error(`${err.name}, ${err.message}`)
        }else {
          console.error(err)
        }
      }
    } else {
      console.log('Screen Wake Lock API not supported')
    }
  }

  async release() {
    if (this.wakeLock) {
      await this.wakeLock.release()
      this.wakeLock = null
    }
  }
}
