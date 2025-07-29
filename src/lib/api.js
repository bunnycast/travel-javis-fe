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

        const routeResponse = "어니언 안국까지는 경복궁에서 도보로 약 10분 거리입니다. 자세한 경로는 네이버 지도를 참고해주세요: [네이버 지도 링크](https://map.naver.com/p/directions/14134997.4830335,4519704.4159527,광화문,13161322,PLACE_POI/14135444.8538031,4520282.9093815,블루보틀%20삼청%20카페,1942921803,PLACE_POI/-/walk?c=16.00,0,0,0,dh)";
        const routeKeywords = ["경로", "가는 길"];

        // --- 시나리오별 Mock 응답 ---

        // 4. /chat (자연어 입력) - 시나리오 강제
        if (url.includes("/chat") && method === "post") {
            const prompt = config.data ? JSON.parse(config.data).prompt : "";
            let botResponse = "죄송합니다. 이해하지 못했습니다.";

            // 경로 관련 질문 최우선 처리
            if (routeKeywords.some(keyword => prompt.includes(keyword))) {
                botResponse = routeResponse;
            } else if (prompt.includes("안녕 너는 누구야?")) {
                botResponse = "안녕하세요! 저는 여행자비스입니다. 당신의 여행을 돕기 위해 만들어진 AI 챗봇이에요. 무엇이든 물어보세요!";
            } else if (prompt.includes("나는 지금 서울을 여행하는 여행자야")) {
                botResponse = "서울을 여행 중이시군요! 멋진 선택입니다. 서울의 어떤 점이 가장 궁금하신가요? 맛집, 관광지, 아니면 특별한 경험을 찾고 계신가요?";
            } else if (prompt.includes("내가 지금 어디를 여행하고 있다고?")) {
                botResponse = "네, 당신은 지금 서울을 여행하고 계십니다. 서울의 매력에 푹 빠져보세요!";
            } else if (prompt.includes("홍대 근처에 갈만한 곳을 알려줘")) {
                botResponse = "홍대 근처에는 다양한 매력적인 장소들이 많습니다. 예를 들어, 홍대 거리의 독특한 상점들과 버스킹 공연, 연남동의 아기자기한 카페 골목, 그리고 젊음의 에너지가 넘치는 클럽들이 있습니다. 어떤 종류의 장소를 선호하시나요?";
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

        // 5. /analyze (사진 기반 질문) - 시나리오 강제
        if (url.includes("/analyze") && method === "post") {
            const question = config.data.get('question');
            let botResponse = "사진 분석 결과입니다. 시연을 위해 미리 정의된 답변을 제공합니다.";

            // 경로 관련 질문 최우선 처리
            if (routeKeywords.some(keyword => question.includes(keyword))) {
                botResponse = routeResponse;
            } else if (question.includes("길 가다가 찍었는데 여기가 어디야?")) {
                botResponse = "이곳은 경복궁입니다. 조선 왕조의 법궁으로, 서울의 대표적인 고궁입니다. 아름다운 건축미와 정원이 특징입니다.";
            } else if (question.includes("이 근처에 갈만한 분위기 좋은 카페를 알려줘")) {
                botResponse = "경복궁 근처 추천 카페입니다:\n\n1.  **블루보틀 삼청**: 한옥 분위기의 베이커리 카페로, 경복궁 산책 후 접근하기 좋습니다. 높은 층고와 모던한 분위기가 특징입니다.\n2.  **페이퍼마쉐**: 단독 건물에 루프탑/테라스가 있는 고급스럽고 조용한 분위기의 카페입니다. 다양한 디저트와 음료를 즐길 수 있습니다.\n3.  **펠트커피 광화문점**: 지하 공간에 위치하여 조용하고 쾌적하며, 핸드드립 커피와 오트라떼가 유명합니다. 커피에 집중할 수 있는 미니멀한 분위기입니다.";
            } else if (question.includes("첫번째 카페가 좋아보이는데 가는 길을 알려줘")) {
                botResponse = routeResponse;
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

        // 2. /conversations (대화 목록 조회) - 제목 자동 생성 반영
        if (url.includes("/conversations") && method === "get") {
            const mockConversations = [
                { id: "conv1", title: "홍대 여행 추천 정보", created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
                { id: "conv2", title: "경복궁 근처 분위기 좋은 카페 추천", created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
                { id: "conv3", title: "제주도 맛집", created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
                { id: "conv4", title: "유럽 여행", created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
                { id: "conv5", title: "새로운 대화", created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
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

        // 대화 요약 (PDF 다운로드 시뮬레이션)
        if (url.includes("/export/pdf") && method === "post") {
            // 실제 PDF 파일은 public 폴더에 미리 업로드되어 있어야 합니다.
            const pdfUrl = "/경복궁_근처_분위기_좋은_카페_추천.pdf";
            window.open(pdfUrl, '_blank'); // 새 탭에서 PDF 열기 (다운로드 시뮬레이션)
            return Promise.resolve({
                data: { message: "PDF 다운로드 요청이 처리되었습니다." },
                status: 200,
                statusText: "OK",
                headers: { ...config.headers, 'Content-Type': 'application/json' },
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