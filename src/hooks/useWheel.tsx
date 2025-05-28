"use client"

import { useState, useEffect, useRef } from "react"

export function useWheel() {
    const [wheelDelta, setWheelDelta] = useState(0)
    const timeoutRef = useRef<number | null>(null)

    useEffect(() => {
        // 마우스 휠 이벤트 핸들러
        const handleWheel = (event: WheelEvent) => {
            // 기본 이벤트 방지
            event.preventDefault()

            // 휠 이벤트의 deltaY 값을 정규화 (-1 또는 1)
            // 작은 값으로 설정하여 감도 조절
            const delta = Math.sign(event.deltaY) * -1 * 0.2

            setWheelDelta(delta)

            // 이전 타임아웃 취소
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current)
            }

            // 새 타임아웃 설정
            timeoutRef.current = window.setTimeout(() => {
                setWheelDelta(0)
            }, 100) as unknown as number
        }

        // 이벤트 리스너 등록
        const element = document.documentElement
        element.addEventListener("wheel", handleWheel, { passive: false })

        // 이벤트 리스너 정리
        return () => {
            element.removeEventListener("wheel", handleWheel)
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return { wheelDelta }
}
