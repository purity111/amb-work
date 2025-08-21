import { useEffect } from "react"

export function useScrollPosition(
    effect: (scrollTop: number) => void,
    deps: unknown[],
    elementRef: React.RefObject<HTMLElement>
) {
    useEffect(() => {
        const element = elementRef.current
        if (!element) return
        const handler = () => {
            effect(element.scrollTop)
        }

        element.addEventListener('scroll', handler)
        return () => element.removeEventListener('scroll', handler)
    }, deps)
}