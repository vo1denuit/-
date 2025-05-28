"use client"

import { useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, OrthographicCamera } from "@react-three/drei"
import { ParticleScene } from "./ParticleScene"
import { ParticleModal } from "./ParticleModal"
import { AboutModal } from "./AboutModal"

import "./ParticleSystem.css"

// 파티클 데이터 인터페이스
export interface ParticleData {
    id: number
    title: string
    viewer: string
    description: string
    color: string
}

// 화면 크기에 맞게 직교 카메라 조정하는 컴포넌트
function ResponsiveOrthographicCamera() {
    const { gl } = useThree()

    useEffect(() => {
        // 초기 설정
        updateSize()

        // 화면 크기 변경 시 이벤트 리스너
        function handleResize() {
            updateSize()
        }

        // 렌더러 크기 업데이트
        function updateSize() {
            gl.setSize(window.innerWidth, window.innerHeight)
            gl.setPixelRatio(window.devicePixelRatio)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [gl])

    return null
}

export function ParticleSystem() {
    const [selectedParticle, setSelectedParticle] = useState<ParticleData | null>(null)
    const [zoom, setZoom] = useState(40) // 직교 카메라의 초기 줌 레벨
    const [showAboutModal, setShowAboutModal] = useState(false)

    const handleParticleClick = (particle: ParticleData) => {
        console.log("파티클 클릭됨:", particle.id, particle.title)
        setSelectedParticle(particle)
    }

    // 줌 레벨 변경 핸들러 (ParticleScene에서 호출)
    const handleZoomChange = (newZoom: number) => {
        setZoom(newZoom)
    }

    // 작품 설명 모달 열기
    const handleOpenAboutModal = () => {
        setShowAboutModal(true)
    }

    // 화면 비율 계산
    const aspectRatio = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1

    return (
        <div className="relative w-full h-screen">
            <Canvas
                style={{ width: "100%", height: "100%", background: "#bdc3c6" }}
                dpr={window.devicePixelRatio} // 디바이스 픽셀 비율 설정
                gl={{ antialias: true }}
            >
                {/* 직교 카메라 설정 */}
                <OrthographicCamera
                    makeDefault
                    zoom={zoom}
                    position={[0, 0, 1000]}
                    left={(-aspectRatio * zoom) / 2}
                    right={(aspectRatio * zoom) / 2}
                    top={zoom / 2}
                    bottom={-zoom / 2}
                    near={0.1}
                    far={2000}
                />
                <ResponsiveOrthographicCamera />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <ParticleScene onParticleClick={handleParticleClick} onZoomChange={handleZoomChange} initialZoom={zoom} />
                <OrbitControls enableRotate={false} enablePan={false} />
            </Canvas>

            {/* 파티클 정보 모달 */}
            {selectedParticle && <ParticleModal particle={selectedParticle} onClose={() => setSelectedParticle(null)} />}

            {/* 작품 설명 모달 */}
            {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}

            {/* 푸터 영역 */}
            <footer className="footer">
                <button className="about-button" onClick={handleOpenAboutModal}>
                    작품 설명
                </button>
            </footer>
        </div>
    )
}
