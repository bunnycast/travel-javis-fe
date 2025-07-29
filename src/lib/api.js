// frontend/src/lib/api.js
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 프로덕션에서 https://javis.shop/api
    withCredentials: false, // 토큰을 헤더로 보낼 것이므로 false
});

// 요청마다 Authorization 자동 첨부
api.interceptors.request.use((config) => {
    const t = localStorage.getItem("accessToken");
    if (t) config.headers["Authorization"] = `Bearer ${t}`;
    return config;
});

// --- 시연용 Mock API 설정 시작 ---
const IS_DEMO_MODE = true; // 시연 모드 활성화/비활성화 토글

if (IS_DEMO_MODE) {
    api.interceptors.request.use(async (config) => {
        const url = config.url;
        const method = config.method.toLowerCase();

        console.log(`[DEMO MODE] Intercepting: ${method.toUpperCase()} ${url}`);

        // --- 시나리오별 Mock 응답 (유지할 부분만) ---

        // 6. /conversations/{conversation_id} (대화 제목 수정)
        if (url.includes("/conversations/") && method === "put") {
            return Promise.resolve({
                data: { message: "대화 제목이 성공적으로 변경되었습니다." },
                status: 200,
                statusText: "OK",
                headers: config.headers,
                config: config,
                request: config.request,
            });
        }

        // 7. /conversations/{conversation_id} (대화 삭제)
        if (url.includes("/conversations/") && method === "delete") {
            return Promise.resolve({
                data: { message: "대화가 성공적으로 삭제되었습니다." },
                status: 204, // No Content
                statusText: "No Content",
                headers: config.headers,
                config: config,
                request: config.request,
            });
        }

        // 대화 요약 (PDF 다운로드 시뮬레이션)
        if (url.includes("/export/pdf") && method === "post") {
            // 실제 PDF 파일은 public 폴더에 미리 업로드되어 있어야 합니다.
            const pdfUrl = "/conversationSummarized_250729.pdf";
            
            // 임시 <a> 태그를 생성하여 다운로드 속성을 부여하고 클릭
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = "conversationSummarized_250729.pdf"; // 다운로드될 파일 이름
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return Promise.resolve({
                data: { message: "PDF 다운로드 요청이 처리되었습니다." },
                status: 200,
                statusText: "OK",
                headers: { ...config.headers, 'Content-Type': 'application/json' },
                config: config,
                request: config.request,
            });
        }

        // 기본적으로 실제 요청을 계속 진행
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
}
// --- 시연용 Mock API 설정 끝 ---