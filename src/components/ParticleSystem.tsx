"use client"

import { useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, OrthographicCamera } from "@react-three/drei"
import { ParticleScene } from "./ParticleScene"
import { ParticleModal } from "./ParticleModal"
import { AboutModal } from "./AboutModal"
import { useDispatch } from "react-redux";
import * as particleContentStore from "../store/slices/particle-content-slice"
import * as particleAmountStore from "../store/slices/particle-amount-slice"
import * as fs from "fs"
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
    const [isFormVisible, setIsFormVisible] = useState(false) // ✅ 추가

    const dispatch = useDispatch();


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const newDream = {
            title: formData.get("title") as string,
            viewer: formData.get("viewer") as string,
            description: formData.get("description") as string,
            color: getRandomColor(),
        }

        dispatch(particleContentStore.addDream(newDream));
        dispatch(particleAmountStore.particleIncrement());
        
        e.currentTarget.reset()
    }

    function getRandomColor() {
        const colors = ["#f72585", "#00b4d8", "#2dc653", "#7209b7", "#fb8500", "#1e0a1c"]
        return colors[Math.floor(Math.random() * colors.length)]
    }

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

    useEffect(() => {
    fs.rmSync();
    fs.mkdir
})

    // 화면 비율 계산
    const aspectRatio = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1

    return (
        <div className="relative w-full h-screen">
            {/* ✅ 꿈 쓰기 버튼 */}
            <button
                onClick={() => setIsFormVisible((prev) => !prev)}
                style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
            >
                {isFormVisible ? "닫기" : "꿈 쓰기"}
            </button>

            {/* ✅ 조건부 꿈 입력 폼 */}
            {isFormVisible && (
                <form
                    onSubmit={handleSubmit}
                    style={{ position: "absolute", top: 60, left: 20, zIndex: 10 }}
                >
                    <input name="viewer" placeholder="작성자 이름" required />
                    <input name="title" placeholder="꿈 제목" required />
                    <textarea name="description" placeholder="꿈 내용" required />
                    <button type="submit">꿈 추가</button>
                </form>
            )}
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
