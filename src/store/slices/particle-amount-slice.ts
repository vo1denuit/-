import { createSlice } from '@reduxjs/toolkit';

interface ParticleAmountState {
    particleAmount: number;
}

const initialState: ParticleAmountState = {
    particleAmount: 60, // 여러 게임의 설치 매니저를 배열로 관리
};

const gameInstallerSlice = createSlice({
    name: 'gameInstaller',
    initialState,
    reducers: {
        addDream: (state) => {
            state.particleAmount += 1;
        },
    },
});

export const { addDream } =
    gameInstallerSlice.actions;

export default gameInstallerSlice.reducer;