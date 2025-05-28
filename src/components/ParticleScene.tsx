"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import type * as THREE from "three"
import { useWheel } from "../hooks/useWheel"
import type { ParticleData } from "./ParticleSystem"

// 파티클 콘텐츠 데이터
const PARTICLE_CONTENTS = [
    {
        title: "무제",
        viewer: "쥐",
        description: "더는 만나지 않는 친구와 횡단보도를 건너며 아주 아주 크게 웃는 꿈을 꾸었다.",
        color: "#183c3c",
    },
    {
        title: "수업 종료",
        viewer: "나상현",
        description: "학교 체육 선생님이 구르기 시범을 보여주시다 그만 목뼈가 부러지셔서 돌아가셨어요.  ",
        color: "#0c1e",
    },
    {
        title: "기웃거리다 다른 세계",
        viewer: "최예진",
        description: "옛날에 살던 동네 골목을 걷고 있었음. 자주 가던 빌딩 앞에 흑인 몇 명이 앉아있길래 뭔가 싶어서 기웃거렸더니 들어오라고 했음. 그래서 들어갔더니, 안에 외국인이랑 한국인이랑 키 작은 난쟁이들이 섞여 있는 클럽 같은 데가 나왔음. 거기서 좀 놀고 있었는데, 꼭대기 층으로 올라가보라고 해서 올라감.  꼭대기 층은 사장실처럼 생긴 방이었고, 안에는 장난감이 잔뜩 있었음. 그 방에는 난쟁이 사장이 있었고, 나한테 슈퍼마리오 굴뚝처럼 생긴 통로로 들어가보라고 했음. 그래서 들어갔더니 갑자기 내가 알던 평범한 지하철역으로 나와버렸음.",
        color: "#183c3c",
    },
    {
        title: "체육관",
        viewer: "나상현",
        description: "체육관에서 운동하고 있는데 체육관 구석에서 코브라 뱀들이 한 100마리..? 나와서 공격했어요",
        color: "#768C8C",
    },
    {
        title: "터전",
        viewer: "베햄베",
        description: "시리즈로 꾸는 꿈이 있다. 2000년대 주택 같은 곳이 배경. 노란 장판에 하얀 한지같은 벽지가 발라져있는 집이다. 나는 무언가에 쫓겨 한 방으로 들어간다. 분명 처음 가보는 곳인데 나는 이곳의 비밀을 알고있다. 세로로 길다란 짙은 갈색의 나무 옷장을 연다. 두개의 단으로 나뉘어져있는데 윗부분은 좁다. 나는 그곳이 옆방으로 향하는 문이라는 걸 안다. 겨우 겨우 기어서 넘어가면 옆방이 나온다. 그렇게 잠에서 깼다. 이어졌던 꿈에서는 어김없이 그 옷장으로 도망을 갔는데 연결된 방이 아주 큰 한옥이였다. 여러개의 방이 있었고 나는 옛날부터 이곳에 살았었다. 여기저기 쏘다니며 집을 구경한다. 그러다 또 꿈에서 깬다.",
        color: "#313c15",
    },
    {
        title: "디지털 아트",
        view: "배점이",
        description: "팔을 양 옆으로 벌려 새처럼 나는 손짓을 하면 날 수 있었다. 체공 높이가 그리 높진 않았지만 노력하면 5층 높이의 건물 정도는 뛰어넘을 수 있었다. 기분이 너무 좋았다. 날 수 있다는 사실 자체로도 좋았지만, 지구상에서 나만 가진 능력이라는 점에서 오는 우월감 역시 이에 크게 작용했다. 기억 나는 건 이게 다다.",
        color: "#AFC1C4",
    },
    {
        title: "무제",
        viewer: "박스",
        description: "초등학교생 때 운동장에서 달리지않고 공중에 뜬 상태로 운동장을 질주하던 꿈",
        color: "#AFC1C4",
    },
    {
        title: "최해린",
        description: "꿈 일기  예전에 살던 자취방에서 뭔가 정리하는 꿈을 꿨다. 그리고 거기엔 ㅇㅇ언니가 있었고.. 마지막에는 빌라 1층에서 케이크를 먹었다. ",
        color: "#768C8C",
    },
    {
        title: "바다",
        viewer: "이태경",
        description: "금색 밀밭에 있는 오두막에서 나오는 나 ",
        color: "#fb8500",
    },
    {
        title: "모르겠어요",
        viewer: "현",
        description: "여행을 가야 하는데 화장하느라 비행기 시간을 놓쳐서 못 갔어요ㅜ 같이 가기로 한 친구한테 엄청 혼날 줄 알았는데 그냥 웃고 넘어가서 얼떨떨해 하다가 꿈에서 깼습니다..",
        color: "#3c3915",
    },
    {
        title: "그리움.",
        viewer: "청본(靑本)",
        description: "눈을 뜨자, 돌아가신 사촌 누나가 보였다. 그녀가 귀신임을 나는 직감적으로 알 수 있었다. 차갑고 무표정한 얼굴. 몹시 추워 보였다. 나는 겁에 질린 채 손에 들린 우산으로 그녀를 툭툭 쳤다. / 그 순간 어디선가 중절모를 쓴 낯선 할아버지가 다가와 내 어깨를 툭 치고 지나갔다. 허공에는 과일 몇 개와 두툼한 돈다발이 흩어졌다. 그제야 나는 내가 어디에 있는지를 둘러보았다. / 갈색 나무로 된 계단 위 옥탑방으로 향하는 길목이었다. 나는 천천히 계단을 내려갔다. 그때 난간 너머로 펼쳐진 광활함 속 수많은 영혼들을 마주하고야 말았다. 그러다 한 귀신이 내 눈앞으로 얼굴을 들이밀었다. 나는 비명을 지를 틈도 없이 현실로 돌아왔다. / 얼마 후 우리 가족은 한겨울의 폭설을 뚫고 친가 쪽 산소에 성묘를 다녀왔다. 초라한 누나와 그 곁의 할아버지 묘엔 육중한 눈덩이와 무거운 나무더미가 겹겹이 쌓여 있었다. / 그래서였을까. 누나와 할아버지가 내 꿈에 찾아온 이유는 무엇이었을까. 늘 성묘길에 함께했던 영가들이 내게 찾아온 건 단지 이 때문이었을까. 지난 겨울. / 땀으로 범벅되어 흩어진 혼몽을 되새기며.",
        color: "#1e100a",
    },
    {
        title: "첩보",
        viewer: "임동하",
        description: "오늘 꾼 꿈인데요 제가 동기 한명과 특수요원으로 첩보작전 중에 들켜서 독맞는 꿈을 꿨어요 그러다 깼습니다",
        color: "#0a141e",
    },
    {
        title: "동심",
        viewer: "임동하",
        description: "제가 포켓몬세상에서 포켓몬 코디네이터가 되는 꿈을 꿨습니다",
        color: "#25153c",
    },
    {
        title: "동심",
        viewer: "이솔민",
        description: "악몽을 꾸게 되면, 저는 항상 같은 꿈을 꿉니다. 이래도 되나 싶을 정도의 무채색 세상에서 한눈에 다 담을 수 없는 커다란 구의 형체에 끊임없이 쫒기고 깔리기를 반복합니다. 그러다가 공중에 허우적거리다가 시커먼 구들에게 괴롭힘을 당합니다. 이처럼 제 악몽은 무채색의 세상에서 다양한 시커먼 구들에게 여러가지 방법으로 괴롭힘을 끊임없이 당하다가 깨어나게 됩니다. ",
        color: "#19153c",
    },
    {
        title: "월행",
        viewer: "임동하",
        description: "제가 광덕공원에서 빗자루 타고 날아가는꿈을 꿨는데요 나무위에 멈추려고 했는데 안멈춰서 달까지 갔습니다",
        color: "##180a1e",
    },
        {
        title: "악어 아저씨 그렇게 배가 고프시다면 저를 드세요",
        viewer: "김주성",
        description: "내가 사랑하는 사촌동생이 악어 아저씨에게 먹혀 신체의 반이 사라진 것을 목격한 꿈",
        color: "##1e0a1c",
    },
    {
        title: "진드기병?",
        viewer: "임동하",
        description: "피크닉하는데 누워있다가 분홍색 손이 달린 사마귀랑 자벌레 합친거같이 생긴 벌래가 세마리있어서 파닥파닥 거리면서 기어가길래서 무서워서 깼습니다",
        color: "#e63946",
    },
    {
        title: "스테이지 다이브",
        viewer: "임동하",
        description: "제가 공연하다가 스테이지 다이브를 해서 관객들이 행가래로 날려줬습니다 근데 천장뚫고 하늘로 날아가서 용이랑 싸우는 이상한 꿈입니다",
        color: "#3c152d",
    },
    {
        title: "그침의 지속",
        viewer: "윤주",
        description: "어떤 숲속 같은 집에 가족인것 같은 사람들이 들어가 서로 인사를 나누고 있었다. 근데 거기서 어떤 여자 아이를 기점으로 그림으로 변하는구나 생각이 들었는데 그때 실재했던것들이 수채화로 된 그림처럼 변해갔다. 그래서 인사를 나눈이유가 곧 그림으로 변하면 멈추게 되니까 미리 서로에게 인사를 나눴구나 싶었다. 초록색 숲에서부터 파란색으로 그림이 마무리 됐다",
        color: "#642237",
    },            
]

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
    const [currentZoom, setCurrentZoom] = useState(initialZoom)
    const { wheelDelta } = useWheel()
    const particlesRef = useRef<THREE.Group>(null)
    const prevZoomLevelRef = useRef(zoomLevel) // 이전 줌 레벨 저장용 ref

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
                viewer: content.viewer,
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
        setCurrentZoom(newZoom)

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
                      id,
                      initialX,
                      initialY,
                      initialZ,
                      velocityX,
                      velocityY,
                      velocityZ,
                      color,
                      title,
                      description,
                      zoomLevel,
                      prevZoomLevel,
                      onClick,
                  }: ParticleProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [flowSpeed] = useState(() => 0.005 + Math.random() * 0.015)


    // 초기 위치와 속도를 기본 타입으로 관리
    const [posX, setPosX] = useState(initialX)
    const [posY, setPosY] = useState(initialY)
    const [posZ, setPosZ] = useState(initialZ)
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
    meshRef.current.position.set(newPosX, newPosY, posZ)

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
