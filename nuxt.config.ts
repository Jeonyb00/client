export default defineNuxtConfig({
  ssr: false, // 서버 사이드 렌더링 비활성화
  typescript: {
    strict: true,
  },
  nitro: {
    devProxy: {
      '/ws': {
        target: 'http://localhost:3001', // WebSocket 서버 주소 (http 사용)
        ws: true, // WebSocket 지원 활성화
        changeOrigin: true, // Origin 헤더를 WebSocket 서버에 맞게 변경
      },
    },
  },
  compatibilityDate: '2024-12-02', // 호환성 설정
});
