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

        // --- 시나리오별 Mock 응답 ---

        // 1. 네이버 소셜 로그인 (성공 시 토큰 반환)
        if (url.includes("/auth/naver/callback") && method === "get") {
            return Promise.resolve({
                data: {
                    access_token: "mock_naver_access_token_12345",
                    token_type: "bearer",
                },
                status: 200,
                statusText: "OK",
                headers: config.headers,
                config: config,
                request: config.request,
            });
        }

        // 2. /conversations (대화 목록 조회)
        if (url.includes("/conversations") && method === "get") {
            const mockConversations = [
                { id: "conv1", title: "안녕하세요", created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
                { id: "conv2", title: "여행 계획", created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
                { id: "conv3", title: "제주도 맛집", created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
                { id: "conv4", title: "유럽 여행", created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
                { id: "conv5", title: "경복궁 근처 카페 검색", created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
            ];
            return Promise.resolve({
                data: { conversations: mockConversations },
                status: 200,
                statusText: "OK",
                headers: config.headers,
                config: config,
                request: config.request,
            });
        }

        // 3. /conversations/{conversation_id}/full (특정 대화 내용 조회)
        if (url.includes("/conversations/") && url.endsWith("/full") && method === "get") {
            const convId = url.split("/conversations/")[1].split("/full")[0];
            const mockMessages = [
                { id: "msg1", content: "안녕하세요! 무엇을 도와드릴까요?", sender: "bot", type: "text" },
                { id: "msg2", content: "경복궁 근처 카페를 찾고 있어요.", sender: "user", type: "text" },
                { id: "msg3", content: "네, 경복궁 근처에는 다양한 카페들이 있습니다. 어떤 분위기를 선호하시나요?", sender: "bot", type: "text" },
            ];
            return Promise.resolve({
                data: { messages: mockMessages },
                status: 200,
                statusText: "OK",
                headers: config.headers,
                config: config,
                request: config.request,
            });
        }

        // 4. /chat (자연어 입력)
        if (url.includes("/chat") && method === "post") {
            const prompt = config.data ? JSON.parse(config.data).prompt : "";
            let botResponse = "죄송합니다. 이해하지 못했습니다.";

            if (prompt.includes("경복궁")) {
                botResponse = "경복궁은 조선 왕조의 법궁으로, 서울의 대표적인 고궁입니다. 아름다운 건축물과 정원이 특징입니다.";
            } else if (prompt.includes("카페 리스트")) {
                botResponse = "경복궁 근처 추천 카페:\n1. **어니언 안국**: 한옥 분위기의 베이커리 카페\n2. **프릳츠 커피 컴퍼니**: 레트로 감성의 로스터리 카페\n3. **레이어드 안국**: 아기자기한 디저트가 유명한 카페";
            } else if (prompt.includes("첫번째 카페까지 갈려면")) {
                botResponse = "어니언 안국까지는 경복궁에서 도보로 약 10분 거리입니다. 자세한 경로는 네이버 지도를 참고해주세요: [네이버 지도 링크](https://map.naver.com/v5/search/%EC%96%B4%EB%8B%88%EC%96%B8%20%EC%95%88%EA%B5%AD)";
            } else {
                botResponse = `"${prompt}"에 대한 답변입니다. 시연을 위해 미리 정의된 답변을 제공합니다.`;
            }

            return Promise.resolve({
                data: { answer: botResponse },
                status: 200,
                statusText: "OK",
                headers: config.headers,
                config: config,
                request: config.request,
            });
        }

        // 5. /analyze (사진 기반 질문)
        if (url.includes("/analyze") && method === "post") {
            const question = config.data.get('question');
            let botResponse = "사진 분석 결과입니다. 시연을 위해 미리 정의된 답변을 제공합니다.";

            if (question.includes("이 장소가 어디야?")) {
                botResponse = "이곳은 경복궁입니다. 조선의 대표적인 궁궐로, 아름다운 건축미를 자랑합니다.";
            } else if (question.includes("이 근처에 갈 만한 카페 리스트를 알려줘")) {
                botResponse = "경복궁 근처 추천 카페:\n1. **어니언 안국**: 한옥 분위기의 베이커리 카페\n2. **프릳츠 커피 컴퍼니**: 레트로 감성의 로스터리 카페\n3. **레이어드 안국**: 아기자기한 디저트가 유명한 카페";
            } else if (question.includes("여기서 첫번째 카페까지 갈려면 어떻게 해야해?")) {
                botResponse = "어니언 안국까지는 경복궁에서 도보로 약 10분 거리입니다. 자세한 경로는 네이버 지도를 참고해주세요: [네이버 지도 링크](https://map.naver.com/v5/search/%EC%96%B4%EB%8B%88%EC%96%B8%20%EC%95%88%EA%B5%AD)";
            }

            return Promise.resolve({
                data: { answer: botResponse },
                status: 200,
                statusText: "OK",
                headers: config.headers,
                config: config,
                request: config.request,
            });
        }

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

        // 8. /auth/accounts/me (마이페이지 프로필 정보)
        if (url.includes("/auth/accounts/me") && method === "get") {
            return Promise.resolve({
                data: {
                    nickname: "시연용 사용자",
                    email: "demo@example.com",
                    profileImage: "https://via.placeholder.com/150", // 임시 이미지 URL
                },
                status: 200,
                statusText: "OK",
                headers: config.headers,
                config: config,
                request: config.request,
            });
        }

        // 9. 로그아웃 (성공 응답)
        if (url.includes("/auth/logout") && method === "post") {
            localStorage.removeItem("accessToken"); // 로컬 스토리지에서 토큰 제거
            return Promise.resolve({
                data: { message: "로그아웃 성공" },
                status: 200,
                statusText: "OK",
                headers: config.headers,
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
