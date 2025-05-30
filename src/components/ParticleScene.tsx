// ParticleScene.tsx

"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import type * as THREE from "three"
import { useWheel } from "../hooks/useWheel"
import type { ParticleData } from "./ParticleSystem"
import { useSelector } from "react-redux"
import { type particleContent } from "../types/DreamContents.ts";
import type { RootState } from "../store";

// 파티클 개수 설정
const PARTICLE_COUNT = 60
// 파티클이 흩어질 수 있는 최대 범위
const SCATTER_RANGE = 60
// 파티클 움직임 속도 범위
const SPEED_RANGE = 0.03
// 파티클 크기 - 직교 카메라에 맞게 조정
const PARTICLE_SIZE = 0.8
// 줌 감도 조정
const ZOOM_SENSITIVITY = 0.7
// 최대/최소 줌 레벨
const MAX_ZOOM = 50
const MIN_ZOOM = 20
// 위치 전환 부드러움 정도 (값이 클수록 더 부드러움)
const POSITION_SMOOTHNESS = 0.10

interface ParticleSceneProps {
    onParticleClick: (particle: ParticleData) => void
    onZoomChange: (zoom: number) => void
    initialZoom: number
}

export function ParticleScene({ onParticleClick, onZoomChange, initialZoom }: ParticleSceneProps) {
    const { camera } = useThree()
    const [zoomLevel, setZoomLevel] = useState(0)
    // const [currentZoom, setCurrentZoom] = useState(initialZoom)
    const { wheelDelta } = useWheel()
    const particlesRef = useRef<THREE.Group>(null)
    const prevZoomLevelRef = useRef(zoomLevel) // 이전 줌 레벨 저장용 ref

    const PARTICLE_CONTENTS: particleContent[] = useSelector((state: RootState) => state.particleContent.particleContents);

    // 파티클 데이터 생성
    const particles = useMemo(() => {
        const result = []

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // 랜덤한 위치에 파티클 배치
            const x = (Math.random() - 0.5) * SCATTER_RANGE
            const y = (Math.random() - 0.5) * SCATTER_RANGE
            const z = 0 // 직교 카메라에서는 z 위치가 크기에 영향을 주지 않음

            // 랜덤한 속도 벡터 생성
            const vx = (Math.random() - 0.5) * SPEED_RANGE
            const vy = (Math.random() - 0.5) * SPEED_RANGE
            const vz = 0 // z축 이동 없음

            // 콘텐츠 선택 (순환하면서 사용)
            const contentIndex = i % PARTICLE_CONTENTS.length
            const content = PARTICLE_CONTENTS[contentIndex]

            result.push({
                id: i,
                initialX: x,
                initialY: y,
                initialZ: z,
                velocityX: vx,
                velocityY: vy,
                velocityZ: vz,
                title: content.title,
                viewer: content.viewer ?? "",
                description: content.description,
                color: content.color,
            })
        }

        return result
    }, [])

    // 마우스 휠 이벤트에 따라 줌 레벨 조정 - 직교 카메라용으로 수정
    useEffect(() => {
        if (wheelDelta === 0) return

        // 이전 줌 레벨 저장
        prevZoomLevelRef.current = zoomLevel

        // 휠 델타가 양수면 줌아웃(줌 감소), 음수면 줌인(줌 증가)
        const newZoomLevel = Math.max(0, Math.min(1, zoomLevel + wheelDelta * ZOOM_SENSITIVITY * 0.01))
        setZoomLevel(newZoomLevel)

        // 줌 레벨에 따라 직교 카메라 줌 조정
        // 줌인할수록 줌 값이 작아지고, 줌아웃할수록 줌 값이 커짐
        const newZoom = MAX_ZOOM - newZoomLevel * (MAX_ZOOM - MIN_ZOOM)
        //setCurrentZoom(newZoom)

        // 부모 컴포넌트에 줌 변경 알림
        onZoomChange(newZoom)

        // 직교 카메라 업데이트
        const orthoCam = camera as THREE.OrthographicCamera
        orthoCam.zoom = newZoom / initialZoom
        orthoCam.updateProjectionMatrix()
        // if (camera.isOrthographicCamera) {
        //     const orthoCam = camera as THREE.OrthographicCamera
        //     orthoCam.zoom = newZoom / initialZoom
        //     orthoCam.updateProjectionMatrix()
        // }
    }, [wheelDelta, zoomLevel, camera, initialZoom, onZoomChange])

    // 파티클 클릭 핸들러
    const handleClick = (id: number) => {
        const particle = particles.find((p) => p.id === id)
        if (particle) {
            onParticleClick({
                id: particle.id,
                title: particle.title,
                viewer: particle.viewer,
                description: particle.description,
                color: particle.color,
            })
        }
    }

    return (
        <group ref={particlesRef}>
            {particles.map((particle) => (
                <Particle
                    key={particle.id}
                    id={particle.id}
                    initialX={particle.initialX}
                    initialY={particle.initialY}
                    initialZ={particle.initialZ}
                    velocityX={particle.velocityX}
                    velocityY={particle.velocityY}
                    velocityZ={particle.velocityZ}
                    color={particle.color}
                    title={particle.title}
                    description={particle.description}
                    zoomLevel={zoomLevel}
                    prevZoomLevel={prevZoomLevelRef.current}
                    onClick={() => handleClick(particle.id)}
                />
            ))}
        </group>
    )
}

interface ParticleProps {
    id: number
    initialX: number
    initialY: number
    initialZ: number
    velocityX: number
    velocityY: number
    velocityZ: number
    color: string
    title: string
    description: string
    zoomLevel: number
    prevZoomLevel: number
    onClick: () => void
}

function Particle({
    // id,
    initialX,
    initialY,
    initialZ,
    velocityX,
    velocityY,
    // velocityZ,
    color,
    // title,
    // description,
    zoomLevel,
    //prevZoomLevel,
    onClick,
}: ParticleProps) {


    const meshRef = useRef<THREE.Mesh>(null)
    const [flowSpeed] = useState(() => 0.005 + Math.random() * 0.015)


    // 초기 위치와 속도를 기본 타입으로 관리
    const [posX, setPosX] = useState(initialX)
    const [posY, setPosY] = useState(initialY)
    //const [posZ, setPosZ] = useState(initialZ)
    const [velX, setVelX] = useState(velocityX)
    const [velY, setVelY] = useState(velocityY)
    // const [velZ, setVelZ] = useState(velocityZ)

    // 목표 위치 상태 추가 (부드러운 전환을 위함)
    const [targetX, setTargetX] = useState(initialX)
    const [targetY, setTargetY] = useState(initialY)

    // 호버 상태 관리
    const [hovered, setHovered] = useState(false)

    // 줌 레벨 변화에 따라 목표 위치 업데이트
    useEffect(() => {
        // 줌 레벨에 따른 목표 위치 계산
        if (zoomLevel > 0.5) {
            // 줌인 상태: 중앙으로 모이기
            const centerFactor = (zoomLevel - 0.5) * 2 // 0~1 범위로 정규화
            setTargetX(initialX * (1 - centerFactor))
            setTargetY(initialY * (1 - centerFactor))
        } else {
            // 줌아웃 상태: 원래 위치 주변에서 움직이기
            setTargetX(posX + velX)
            setTargetY(posY + velY)

            // 경계 체크 및 반사
            if (Math.abs(posX + velX) > SCATTER_RANGE / 2) {
                setVelX(velX * -1)
                setTargetX(posX + velX * -1)
            }
            if (Math.abs(posY + velY) > SCATTER_RANGE / 2) {
                setVelY(velY * -1)
                setTargetY(posY + velY * -1)
            }
        }
    }, [zoomLevel, initialX, initialY, posX, posY, velX, velY])

    // 파티클 애니메이션 업데이트
   useFrame(() => {
    if (!meshRef.current) return

    let newPosX = posX
    let newPosY = posY

    if (zoomLevel === 0) {
        // 기본 상태: 파티클마다 흐르는 속도 다르게 적용!
        const nextX = posX + flowSpeed
        newPosX = nextX > SCATTER_RANGE / 2 ? -SCATTER_RANGE / 2 : nextX
    } else {
        // 줌 상태: 기존 위치로 수렴
        newPosX = posX + (targetX - posX) * POSITION_SMOOTHNESS
        newPosY = posY + (targetY - posY) * POSITION_SMOOTHNESS
    }

    setPosX(newPosX)
    setPosY(newPosY)
    // meshRef.current.position.set(newPosX, newPosY, posZ)
    meshRef.current.position.set(newPosX, newPosY, 0)

    const scale = hovered ? 1.2 : 1
    meshRef.current.scale.set(scale, scale, scale)
})



    return (
        <mesh
            ref={meshRef}
            position={[initialX, initialY, initialZ]}
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            onPointerOver={(e) => {
                e.stopPropagation()
                document.body.style.cursor = "pointer"
                setHovered(true)
            }}
            onPointerOut={(e) => {
                e.stopPropagation()
                document.body.style.cursor = "auto"
                setHovered(false)
            }}
        >
            <boxGeometry args={[PARTICLE_SIZE, PARTICLE_SIZE, PARTICLE_SIZE]} />
            <meshStandardMaterial
                color={color}
                emissive={hovered ? color : "#000000"}
                emissiveIntensity={hovered ? 0.5 : 0}
            />
        </mesh>
    )
}
