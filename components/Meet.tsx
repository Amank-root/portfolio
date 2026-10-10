'use client'
import { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

export default function Meet() {
  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: 'meet' })
      cal('floatingButton', {
        calLink: 'amank-root/meet',
        config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'auto' },
        buttonColor: '#994e33',
        buttonTextColor: '#faf8f5',
      })
      cal('ui', {
        theme: 'auto',
        cssVarsPerTheme: { light: { 'cal-brand': '#994e33' }, dark: { 'cal-brand': '#994e33' } },
        hideEventTypeDetails: true,
        layout: 'month_view',
      })
    })()
  }, [])
  return <></>
}
