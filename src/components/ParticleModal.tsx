"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { ParticleData } from "./ParticleSystem"
import "./ParticleModal.css"

interface ParticleModalProps {
    particle: ParticleData
    onClose: () => void
}

export function ParticleModal({ particle, onClose }: ParticleModalProps) {
    const [isVisible, setIsVisible] = useState(false)

    // 모달 표시 애니메이션
    useEffect(() => {
        setIsVisible(true)
    }, [])

    // 모달 닫기 함수
    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 300) // 애니메이션 후 실제 닫기
    }

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div
                className={`modal-container ${isVisible ? "visible" : "hidden"}`}
                onClick={(e) => e.stopPropagation()}
                style={{ borderTop: `4px solid ${particle.color}` }}
            >
                <div className="modal-header">
                    <h3 className="modal-title">{particle.title}</h3>
                    <button onClick={handleClose} className="modal-close-button">
                        <X size={20} color="#4a5568" /> {/* X 아이콘 색상 명시적 설정 */}
                    </button>
                </div>

                <div className="modal-content">
                    <p>{particle.description}</p>
                    <p className="modal-viewer"><strong>-</strong> {particle.viewer}</p>

                </div>

                <div className="modal-footer">
                    <button onClick={handleClose} className="modal-button" style={{ backgroundColor: particle.color }}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    )
}
