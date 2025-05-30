import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { PARTICLE_CONTENTS, type particleContent } from "../../types/DreamContents";

interface ParticleContentState {
    particleContents: particleContent[];
}

const initialState: ParticleContentState = {
    particleContents: PARTICLE_CONTENTS, // 여러 게임의 설치 매니저를 배열로 관리
};

const particleContentSlice = createSlice({
    name: 'platform',
    initialState,
    reducers: {
        addDream: (state, action: PayloadAction<particleContent>) => {
            state.particleContents.push(action.payload);
        },
    },
});

export const { addDream } =
    particleContentSlice.actions;

export default particleContentSlice.reducer;