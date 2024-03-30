import { RefObject } from 'react'

import { useEventListener } from './use-event-listener'

type Handler = (event: MouseEvent) => void

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
): void {
  useEventListener(mouseEvent, event => {
    const el = ref?.current
    if (!el || (event instanceof MouseEvent && el.contains(event.target as Node))) {
      return
    }
    handler(event as MouseEvent)

   
  })
}