"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import "./AboutModal.css"

interface AboutModalProps {
    onClose: () => void
}

export function AboutModal({ onClose }: AboutModalProps) {
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
        <div className="about-modal-overlay" onClick={handleClose}>
            <div className={`about-modal-container ${isVisible ? "visible" : "hidden"}`} onClick={(e) => e.stopPropagation()}>
                <div className="about-modal-header">
                    <h2 className="about-modal-title">작품소개</h2>
                    <button onClick={handleClose} className="about-modal-close-button">
                        <X size={24} color="#4a5568" />
                    </button>
                </div>

                <div className="about-modal-content">
                    <h2><strong>무의식의 파편을 픽셀로 수집하다.</strong></h2>
                    <p>
                        본 프로젝트는 사용자의 무의식 속에서 포착된 꿈의 기억을 디지털 언어로 환원시키는 작업입니다. 
                        이 과정에서 픽셀pixel 이라는 최소 단위의 시각 언어를 사용해 꿈의 단편을 가시화 합니디. 픽셀은 데이터이자 조형이며, 가장 단순하지만 동시에 가장 확장 가능한 표현 형식입니다.
<br /><br />

                        꿈은 본질적으로 흐릿하고, 단어로 온전히 옮기기 어려운 감각의 집합입니다. 이에 픽셀은 그런 비언어적 기억을 담는 그릇이 됩니다.
                        각 꿈은 '도트 dots'로 환산되어 웹 기반의 공간 위에 저장되며, 관람자는 꿈 하나하나를 확대하거나 축소하며 그 구조와 색, 형태를 유추할 수 있습니다.
                        <br /><br />

                        픽셀은 단순히 복고적 미학이나 게임적 감수성에 그치는 것이 아닌, 기억과 꿈, 무의식을 최소 단위로 해체하고 재구성하는 방식으로서 기능합니다. 이 작은 점들은 하나의 감정, 하나의 장면, 혹은 하나의 인물이 될 수 있으며, 그 조합은 오직 한 사람의 꿈으로만 완성됩니다.
<br /><br />

                        기억의 선명도와 감정의 온도에 따라 각 도트의 색을 결정하여 아카이빙 하는 전시는 관람객이 다른 사람의 꿈을 탐색하고, 마치 픽셀 세계 안에서 수집된 꿈을 감상하는 것을 통해 무의식의 흔적을 마주하게 됩니다. 
                    
<br /><br />
<br /><br />
                        *사이트 작동이 되지 않는다면 새로고침 부탁드립니다.
                        <br /> made by 전보현(@vo1denuit)
                        <br /> special thanks to 이재혁(@bmplatina)
                    
            
                    </p>

                    {/* <h3>기술적 구현</h3>
                    <p>
                        이 작품은 React와 Three.js를 기반으로 구현되었으며, 직교 카메라(Orthographic Camera)를 사용하여 원근감 없이
                        파티클을 표현합니다. 각 파티클은 고유한 움직임과 색상을 가지고 있으며, 사용자의 마우스 휠 동작에 따라 위치가
                        동적으로 변화합니다.
                    </p>

                    <h3>작품의 의미</h3>
                    <p>
                        이 작품은 개인과 집단의 관계, 그리고 관점에 따라 변화하는 세계관을 시각적으로 표현합니다. 줌아웃된
                        상태에서는 각 파티클이 독립적으로 움직이며 개인의 자유와 다양성을 상징합니다. 줌인하면 파티클들이 중앙으로
                        모이는 과정은 개인이 하나의 집단으로 수렴되는 사회적 현상을 은유합니다.
                    </p>

                    <h3>상호작용 방법</h3>
                    <p>
                        <strong>마우스 휠:</strong> 줌인/줌아웃하여 파티클의 움직임 패턴 변경
                        <br />
                        <strong>파티클 클릭:</strong> 각 파티클에 담긴 고유한 정보 확인
                        <br />
                        <strong>호버:</strong> 파티클 위에 마우스를 올리면 크기가 커지고 빛이 납니다
                    </p>

                    <h3>작가 노트</h3>
                    <p>
                        현대 사회에서 우리는 끊임없이 개인과 집단 사이의 균형을 찾아가고 있습니다. 때로는 자유롭게 움직이고, 때로는
                        하나의 목표를 향해 모이는 파티클들처럼, 우리의 삶도 다양한 상황과 관점에 따라 변화합니다. 이 작품을 통해
                        관객들이 자신의 위치와 관점에 대해 생각해보는 계기가 되길 바랍니다.
                    </p>

                    <p className="about-modal-quote">"우리는 모두 별처럼 빛나지만, 함께 모일 때 은하를 이룹니다."</p>
                </div>

                <div className="about-modal-footer">
                */}
                </div>
            </div>
        </div>
    )
}
