
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/chat', (req, res, ctx) => {
    const { message } = req.body;
    return HttpResponse.json({
        id: new Date().getTime(),
        text: `'${message}' 라고 하셨네요! 저는 Mock API 봇입니다.`,
        sender: 'bot'
    })
  }),
];
