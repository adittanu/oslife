<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    public function conversations(Request $request)
    {
        $conversations = ChatMessage::where('user_id', $request->user()->id)
            ->selectRaw('conversation_id, MIN(content) as first_message, MAX(created_at) as last_at')
            ->groupBy('conversation_id')
            ->orderByDesc('last_at')
            ->limit(20)
            ->get();

        return response()->json($conversations);
    }

    public function messages(Request $request, string $conversationId)
    {
        $messages = ChatMessage::where('user_id', $request->user()->id)
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at')
            ->get(['role', 'content', 'created_at']);

        return response()->json($messages);
    }

    public function send(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'conversation_id' => 'nullable|string',
        ]);

        $user = $request->user();
        $conversationId = $request->conversation_id ?: Str::uuid()->toString();

        // Save user message
        ChatMessage::create([
            'user_id' => $user->id,
            'conversation_id' => $conversationId,
            'role' => 'user',
            'content' => $request->message,
        ]);

        // Get conversation history
        $history = ChatMessage::where('user_id', $user->id)
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at')
            ->get(['role', 'content'])
            ->map(fn($m) => ['role' => $m->role, 'content' => $m->content])
            ->toArray();

        $systemPrompt = $this->buildSystemPrompt($user);

        set_time_limit(120);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.ai.api_key'),
            'Content-Type' => 'application/json',
        ])->timeout(90)->connectTimeout(10)->post(config('services.ai.base_url') . '/chat/completions', [
            'model' => config('services.ai.model'),
            'max_tokens' => 1024,
            'messages' => array_merge(
                [['role' => 'system', 'content' => $systemPrompt]],
                $history
            ),
        ]);

        $content = $response->json('choices.0.message.content', '');

        if ($content) {
            ChatMessage::create([
                'user_id' => $user->id,
                'conversation_id' => $conversationId,
                'role' => 'assistant',
                'content' => $content,
            ]);
        }

        return response()->json([
            'content' => $content ?: 'Sorry, I could not generate a response.',
            'conversation_id' => $conversationId,
        ]);
    }

    private function buildSystemPrompt($user): string
    {
        $name = $user->name ?? 'User';
        $mode = $user->default_mode ?? 'life';
        $today = now()->translatedFormat('l, d F Y');
        $time = now()->format('H:i');

        return <<<PROMPT
You are a helpful personal AI assistant for "{$name}" inside their Mosiku digital journal app.
You are warm, supportive, and concise. You speak in a friendly tone.

Current date: {$today}
Current time: {$time}
Current mode: {$mode}

Your capabilities:
- Help with daily planning and productivity
- Provide motivation and encouragement
- Help organize thoughts and ideas
- Assist with goal setting and tracking
- Give suggestions for habits and routines
- Help with time management

Guidelines:
- Keep responses concise (2-4 paragraphs max unless asked for more)
- Use the user's name occasionally to feel personal
- Be encouraging and positive
- If the user writes in Indonesian (Bahasa), reply in Indonesian
- If they write in English, reply in English
- You can use simple markdown formatting
PROMPT;
    }
}
