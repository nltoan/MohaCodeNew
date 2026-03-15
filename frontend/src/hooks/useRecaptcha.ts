import { APP_CONFIG } from '@/configs'
import { useEffect, useState } from 'react'
const showBadge = () => {
  const grecaptcha = (window as any).grecaptcha;
  if (!grecaptcha) return
  grecaptcha.ready(() => {
    const badge = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement
    if (!badge) return
    badge.style.display = 'block'
    badge.style.zIndex = '1'
  })
}

const hideBadge = () => {
  const grecaptcha = (window as any).grecaptcha;
  if (!grecaptcha) return
  grecaptcha.ready(() => {
    const badge = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement
    if (!badge) return
    badge.style.display = 'none'
  })
}

const useReCaptcha = (): { reCaptchaLoaded: boolean; generateReCaptchaToken: (action: string) => Promise<string> } => {
  const [reCaptchaLoaded, setReCaptchaLoaded] = useState(false)
  const grecaptcha = (window as any).grecaptcha;

  // Load ReCaptcha script
  useEffect(() => {
    if (typeof window === 'undefined' || reCaptchaLoaded) return
    if (grecaptcha) {
      showBadge()
      setReCaptchaLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.google.com/recaptcha/api.js?render=${APP_CONFIG.recaptcha.token}`
    script.addEventListener('load', () => {
      setReCaptchaLoaded(true)
      showBadge()
    })
    document.body.appendChild(script)
  }, [reCaptchaLoaded])

  // Hide badge when unmount
  useEffect(() => hideBadge, [])

  // Get token
  const generateReCaptchaToken = (action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!reCaptchaLoaded) return reject(new Error('ReCaptcha not loaded'))
      if (typeof window === 'undefined' || !grecaptcha) {
        setReCaptchaLoaded(false)
        return reject(new Error('ReCaptcha not loaded'))
      }
      grecaptcha.ready(() => {
        grecaptcha.execute(APP_CONFIG.recaptcha.token, { action }).then((token: string) => {
          localStorage.setItem(APP_CONFIG.recaptcha.key, token)
          resolve(token)
        })
      })
    })
  }

  return { reCaptchaLoaded, generateReCaptchaToken }
}

export default useReCaptcha
