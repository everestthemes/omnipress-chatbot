## Chat bot integration with filament and laravel

<!-- =============================================== -->
    BACKEND FILAMENT
<!-- =============================================== -->

### Filament (filament/pages/ChatbotSettings.php)

```php
    namespace App\Filament\Pages;

    use App\Models\ChatbotSetting;
    use Filament\Forms\Components\Checkbox;
    use Filament\Forms\Components\ColorPicker;
    use Filament\Forms\Components\Tabs\Tab;
    use Filament\Forms\Components\Toggle;
    use Filament\Forms\Form;
    use Filament\Pages\Page;
    use Filament\Actions\Action;
    use Filament\Forms\Contracts\HasForms;
    use Filament\Notifications\Notification;
    use Filament\Forms\Concerns\InteractsWithForms;
    use Filament\Forms\Components\{TextInput, Tabs};

    class ChatbotSettings extends Page implements HasForms
    {
        use InteractsWithForms;

        protected static ?string $navigationIcon = 'heroicon-o-building-office-2';

        protected static ?int $navigationSort = 80;

        protected static string $view = 'filament.pages.chatbot_settings';

        protected static ?string $slug = 'chatbot_settings';

        protected static ?string $navigationGroup = 'Chatbot Settings';

        public ?array $data = array();

        public function mount(): void
        {
            $this->data = array(
                'api_key'          => '',
                'is_enabled'       => false,
                'primary_color'    => '',
                'text_color'       => '',
                'background_color' => '',
                'company_name'     => '',
                'company_url'      => '',
                'company_slug'     => '',
                'support_email'    => '',
            );

            $school = ChatbotSetting::first();
            if ($school) {
                $this->form->fill($school->toArray());
            }
        }

        protected function getFormActions(): array
        {
            return array(
                Action::make('save')
                ->label('Save')
                ->submit('save')
                ->keyBindings(array( 'mod+s' )),
            );
        }


        public function save()
        {
            $data = $this->form->getState();

            $chatbot_setting = ChatbotSetting::firstOrNew(
                array(
                'id' => 1,
                )
            );

            $chatbot_setting->updateOrCreate(
                array(
                'id' => 1,
                ),
                $data
            );

            Notification::make()
            ->title('Chatbot Settings updated successfully!')
            ->success()
            ->send();
        }

        public function form(Form $form): Form
        {
            $tabs_items = array(
                'General'             => array(
                    'api_key'    => array(
                        'type'        => 'password',
                        'id'          => 'api_key',
                        'label'       => 'API Key',
                        'placeholder' => 'API Key',
                        'required'    => false,
                    ),
                    'is_enabled' => array(
                        'type'        => 'checkbox',
                        'id'          => 'is_enabled',
                        'label'       => 'Is Enabled',
                        'placeholder' => 'Is Enabled',
                        'required'    => false,
                    ),

                ),
                'Theme Customization' => array(
                    'primary_color'    => array(
                        'type'        => 'color',
                        'id'          => 'primary_color',
                        'label'       => 'Primary Color',
                        'placeholder' => 'Primary Color',
                        'required'    => false,
                    ),
                    'text_color'       => array(
                        'type'        => 'color',
                        'id'          => 'text_color',
                        'label'       => 'Text Color',
                        'placeholder' => 'Text Color',
                        'required'    => false,
                    ),
                ),
                'Client Info'         => array(
                    'company_name'  => array(
                        'type'        => 'text',
                        'id'          => 'company_name',
                        'label'       => 'Company Name',
                        'placeholder' => 'Company Name',
                        'required'    => true,
                    ),
                    'company_slug' => array(
                        'type'        => 'text',
                        'id'          => 'company_slug',
                        'label'       => 'Company Slug',
                        'placeholder' => 'Company Slug',
                        'required'    => true,
                    ),
                    'company_url'   => array(
                        'type'        => 'url',
                        'id'          => 'company_url',
                        'label'       => 'Company URL',
                        'placeholder' => 'Company URL',
                        'required'    => true,
                    ),
                    'support_email' => array(
                        'type'        => 'email',
                        'id'          => 'support_email',
                        'label'       => 'Support Email',
                        'placeholder' => 'Support Email',
                        'required'    => true,
                    ),

                ),
            );

            $tabs = array();

            foreach ($tabs_items as $key => $value) {
                $schema = array();

                foreach ($value as $input_key => $input) {
                    if ($input['type'] == 'color') {
                        $schema[] = ColorPicker::make($input_key)->placeholder($input['placeholder'])
                        ->label($input['label'])
                        ->live(onBlur: true);
                    } elseif ($input['type'] == 'checkbox') {
                        $schema[] = Toggle::make($input_key)
                        ->label($input['label'])
                        ->onColor('primary')
                        ->offColor('gray');
                    } else {
                        $schema[] = TextInput::make($input_key)->placeholder($input['placeholder'])->type($input['type'])
                        ->label($input['label'])
                        ->required()->minLength(2)->maxLength(255)
                        ->live(onBlur: true);
                    }
                }

                $tabs[] = Tab::make($key)->schema($schema);
            }


            return $form
            ->statePath('data')
            ->model(ChatbotSetting::first())
                ->schema(
                    array(
                        Tabs::make('settings')->columnSpanFull()->schema($tabs),
                    )
                )->columns(6);
        }
    }
```

after that create views blade file for filament inside `resources/views/filament/resources/user-resource/pages/chatbot.blade.php` Which is required blade file to display the chatbot settings in filament.



<!-- =============================================== -->
        BACKEND CORE LARAVEL
<!-- =============================================== -->

## app/Models/ChatbotSetting.php

```php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Model;

    class ChatbotSetting extends Model
    {
        protected $fillable = [
            'api_key',
            'is_enabled',
            'company_slug',
            'primary_color',
            'text_color',
            'background_color',
            'company_name',
            'company_url',
            'support_email',
        ];

        public static function defaultChatbotSettings(): array
        {
            return [
                'api_key'          => '',
                'is_enabled'       => false,
                'company_slug'     => '',
                'primary_color'    => '',
                'text_color'       => '',
                'background_color' => '',
                'company_name'     => '',
                'company_url'      => '',
                'support_email'    => '',
            ];
        }


        protected function casts(): array
        {
            return [
                'is_enabled' => 'boolean',
            ];
        }
    }
```
## Http/Controllers/ChatController.php
```php
namespace App\Http\Controllers;

use App\Models\ChatbotSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    public const API_URL = 'http://localhost:3000/api/generate/chatbot';

    public function chat(Request $request)
    {
        $chatbot_setting = ChatbotSetting::first();
        $data = $request->all();

        $client = [
            'slug' => $chatbot_setting->company_slug,
            'name' => $chatbot_setting->company_name,
            'email' => $chatbot_setting->support_email,
        ];

        // Start Chat with LLM.
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $chatbot_setting->api_key,
        ])->post(self::API_URL, [
            'messages' => $data['messages'],
            'question' => $data['question'],
            'client' => $client,
        ]);


        if ($response->failed()) {
            return response()->json([
                'status' => 'error',
                'success' => false,
                'message' => $data['messages'],
            ], $response->status());
        }

        return response()->json([
            'status' => 'success',
            'success' => true,
            'data' => $response->json(),
        ]);
    }
}
```

# After creating Model in the

`php artisan make:model ChatbotSetting --migration`

- then added newly created migration file add this provided code:

```php
    <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        /**
        * Run the migrations.
        */
        public function up(): void
        {
            if (!Schema::hasTable('chatbot_settings')) {
                Schema::create('chatbot_settings', function (Blueprint $table) {
                    $table->id();
                    $table->timestamps();
                    $table->string('api_key')->nullable();
                    $table->boolean('is_enabled')->default(false);
                    $table->string('primary_color')->nullable();
                    $table->string('text_color')->nullable();
                    $table->string('background_color')->nullable();
                    $table->string('company_name')->nullable();
                    $table->string('company_url')->nullable();
                    $table->string('company_slug')->nullable();
                    $table->string('support_email')->nullable();
                });
            }
        }

        /**
        * Reverse the migrations.
        */
        public function down(): void
        {
            Schema::dropIfExists('chatbot_settings');
        }
    };
```

## Seeding Data
For Seeding data `ChatbotSetting::firstOrCreate(ChatbotSetting::defaultChatbotSettings());`

<!-- =============================================== -->
# Frontend
<!-- =============================================== -->


create blade component inside `resources/views/components/chatbot.blade.php` and added this code
```html
<!-- Chat Container -->
@if ($is_enabled)
<div style="{{ $style }}" id="chatContainer" class="fixed bottom-5 right-5 z-[10000000] font-sans">
    <style>
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes ripple {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }

            100% {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }

        @keyframes pulse-dot {
            0%,
            100% {
                opacity: 1;
                transform: scale(1);
            }

            50% {
                opacity: 0.5;
                transform: scale(1.1);
            }
        }

        @keyframes loading-bounce {

            0%,
            80%,
            100% {
                transform: scale(0.8);
                opacity: 0.5;
            }

            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        .chat-popup-enter {
            animation: slideUp 0.3s ease-out;
        }

        .ripple-effect {
            animation: ripple 2s infinite;
        }

        .pulse-dot {
            animation: pulse-dot 2s infinite;
        }

        .loading-bounce {
            animation: loading-bounce 1.4s ease-in-out infinite both;
        }

        .loading-bounce:nth-child(1) {
            animation-delay: -0.32s;
        }

        .loading-bounce:nth-child(2) {
            animation-delay: -0.16s;
        }

        .loading-bounce:nth-child(3) {
            animation-delay: 0s;
        }

        .chat-icon-button:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 12px 35px rgba(79, 70, 229, 0.5);
        }

        .chat-icon-button:hover .button-inner {
            transform: scale(1.1);
        }

        .chat-icon-button:active {
            transform: translateY(0) scale(0.95);
        }

        .gradient-bg {
            background: var(--color-primary, linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%));
            color:var(--color-text, #fff);
        }

        body.chat-open {
            margin-right: 350px;
            transition: margin-right 0.3s ease-in-out;
        }

        body.chat-maximized {
            margin-right: 400px;
        }
    </style>
    @vite('resources/js/chatbot.js')

    <!-- Chat Button (when closed) -->
    <button id="chatToggleBtn" class="chat-icon-button w-28 h-12 rounded border-none cursor-pointer flex items-center justify-center gradient-bg shadow-lg transition-all duration-300 ease-out relative overflow-hidden">
        <div class="button-inner flex items-center justify-center relative z-10 transition-transform duration-200 ease-out">
            <span class="mr-2">Ask AI</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                <path d="M20 2v4" />
                <path d="M22 4h-4" />
                <circle cx="4" cy="20" r="2" />
            </svg>
        </div>
        <div class="absolute top-1/2 left-1/2 w-full h-full rounded-full bg-white/10 transform -translate-x-1/2 -translate-y-1/2 scale-0 ripple-effect"></div>
    </button>

    <!-- Chat Popup (when open) -->
    <div id="chatPopup" class="hidden chat-popup-enter fixed bottom-0 right-0 h-screen bg-white shadow-xl flex flex-col overflow-hidden" style="width: 450px; max-width: 100vw;">
        <!-- Header -->
        <div class="gradient-bg p-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles">
                        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                        <path d="M20 2v4" />
                        <path d="M22 4h-4" />
                        <circle cx="4" cy="20" r="2" />
                    </svg>

                    <span class="font-semibold text-base inline-block ml-1">AI Assistant</span>
                    <div class="w-2 h-2 rounded-full bg-green-400 ml-2 pulse-dot"></div>
                </div>

                <div class="flex gap-1">
                    <button id="maximizeBtn"
                        class="bg-white/20 border-none rounded-lg w-7 h-7 cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-white/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize2-icon lucide-maximize-2">
                            <path d="M15 3h6v6" />
                            <path d="m21 3-7 7" />
                            <path d="m3 21 7-7" />
                            <path d="M9 21H3v-6" />
                        </svg>
                    </button>
                    <button id="closeBtn" class="bg-white/20 border-none rounded-lg w-7 h-7 cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-white/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Messages Container -->
        <div id="messagesContainer" class="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-gray-50">
            <!-- Placeholder when no messages -->
            <div id="placeholder" class="text-gray-600 text-sm">
                Ask me questions ...
            </div>
        </div>


        <!-- Input Container -->
        <div class="bg-white relative p-4 pb-0 flex items-center gap-2.5 border-t border-gray-300">
            <textarea id="messageInput" rows="4" placeholder="Ask me questions ..." class="flex-1 border border-gray-300 rounded-2xl px-4 py-2.5 text-sm outline-none bg-gray-100 transition-all duration-200 resize-none focus:border-indigo-600" style="height: auto;"></textarea>
            <button id="sendBtn" class="w-10 h-10 absolute right-7 bottom-5 p-0 rounded-full gradient-bg border-none cursor-pointer flex items-center justify-center transition-all duration-200 flex-shrink-0 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal-icon lucide-send-horizontal">
                    <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                    <path d="M6 12h16" />
                </svg>
            </button>
            <!-- add powered by -->
        </div>
        <p class="text-xs text-gray-500 text-end p-3">Powered by <a class="text-primary hover:underline font-semibold" href="https://omnipress.ai" target="_blank">Omnipress AI</a></p>
    </div>
</div>
@endif;

```

After creating that view components blade file also create `view/components/Chatbot.php` With this code
```php
<?php

namespace App\View\Components;

use App\Models\ChatbotSetting;
use Illuminate\View\Component;

class Chatbot extends Component
{
    public $button_title;
    public $style;
    public $is_enabled;

    /**
     * Construct function
     *
     */
    public function __construct()
    {

        $chatbot_setting = ChatbotSetting::first();
        $style = $chatbot_setting->style;
        $is_enabled = $chatbot_setting->is_enabled;
        $style = '';

        if ($chatbot_setting['primary_color']) {
            $style .= '--color-primary:' . $chatbot_setting['primary_color'] . ';';
        }

        if ($chatbot_setting['secondary_color']) {
            $style .= '--color-secondary:' . $chatbot_setting['secondary_color'] . ';';
        }


        if ($chatbot_setting['text_color']) {
            $style .= '--color-text:' . $chatbot_setting['text_color'] . ';';
        }

        $this->style = $style;
        $this->is_enabled = $is_enabled;
        $this->button_title = $chatbot_setting->button_title;
    }

    public function render()
    {
        return view('components.chatbot');
    }
}
```


then in you root layout blade file include this code  `<x-chatbot />` to use this recently created component



after that create
## Frontend interaction javascript

create one js file the resource directory and enqueue it in main layout blade file which js file available every pages of the website

```javascript
    import { markdown } from "markdown";

    window.addEventListener("DOMContentLoaded", () => {
        // State variables
        let isOpen = false;
        let isMaximized = false;
        let isLoading = false;
        let messages = [];

        // DOM elements
        const chatContainer = document.getElementById("chatContainer");
        const chatToggleBtn = document.getElementById("chatToggleBtn");
        const chatPopup = document.getElementById("chatPopup");
        const closeBtn = document.getElementById("closeBtn");
        const maximizeBtn = document.getElementById("maximizeBtn");
        const sendBtn = document.getElementById("sendBtn");
        const messageInput = document.getElementById("messageInput");
        const messagesContainer = document.getElementById("messagesContainer");
        const placeholder = document.getElementById("placeholder");

        // Chat API function (replace with your actual API endpoint)
        async function chatApi(data) {
            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                return await response.json();
            } catch (error) {
                return { success: false, error: "Network error" };
            }
        }

        // Toggle chat popup
        function toggleChat() {
            isOpen = !isOpen;

            if (isOpen) {
                chatToggleBtn.classList.add("hidden");
                chatPopup.classList.remove("hidden");
                document.body.classList.add("chat-open");

                if (isMaximized) {
                    document.body.classList.add("chat-maximized");
                }

                messageInput.focus();
            } else {
                chatToggleBtn.classList.remove("hidden");
                chatPopup.classList.add("hidden");
                document.body.classList.remove("chat-open", "chat-maximized");
            }
        }

        // Toggle maximize
        function toggleMaximize() {
            isMaximized = !isMaximized;

            if (isMaximized) {
                chatPopup.style.width = "700px";
                document.body.classList.add("chat-maximized");
                maximizeBtn.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minimize2-icon lucide-minimize-2"><path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/></svg>';
            } else {
                chatPopup.style.width = "450px";
                document.body.classList.remove("chat-maximized");
                maximizeBtn.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize2-icon lucide-maximize-2"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg>';
            }
        }

        // Create message element
        function createMessageElement(message) {
            const isUser = message.role === "user";

            const messageDiv = document.createElement("div");
            messageDiv.className = `flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`;

            const avatar = document.createElement("div");
            avatar.className =
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold gradient-bg flex-shrink-0";
            avatar.textContent = isUser ? "U" : "AI";

            const messageContent = document.createElement("div");
            messageContent.className = `max-w-3/4 px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                isUser
                    ? "gradient-bg text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md border border-gray-300"
            }`;

            if (isUser) {
                messageContent.textContent = message.content;
            } else {
                messageContent.innerHTML = markdown.toHTML(message.content);
                // Style links
                const links = messageContent.querySelectorAll("a");
                links.forEach((link) => {
                    link.className = "text-indigo-600 hover:text-indigo-800";
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                });
            }

            if (isUser) {
                messageDiv.appendChild(messageContent);
                messageDiv.appendChild(avatar);
            } else {
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(messageContent);
            }

            return messageDiv;
        }

        // Create loading element
        function createLoadingElement() {
            const loadingDiv = document.createElement("div");
            loadingDiv.className = "flex items-end gap-2 justify-start";
            loadingDiv.id = "loadingMessage";

            const avatar = document.createElement("div");
            avatar.className =
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold gradient-bg flex-shrink-0";
            avatar.textContent = "AI";

            const messageContent = document.createElement("div");
            messageContent.className =
                "bg-white border border-gray-300 rounded-2xl rounded-bl-md px-4 py-3 max-w-3/4";

            const dotsContainer = document.createElement("div");
            dotsContainer.className = "flex gap-1 items-center";

            for (let i = 0; i < 3; i++) {
                const dot = document.createElement("div");
                dot.className = "w-2 h-2 rounded-full gradient-bg loading-bounce";
                dotsContainer.appendChild(dot);
            }

            messageContent.appendChild(dotsContainer);
            loadingDiv.appendChild(avatar);
            loadingDiv.appendChild(messageContent);

            return loadingDiv;
        }

        // Update messages display
        function updateMessagesDisplay() {
            messagesContainer.innerHTML = "";

            if (messages.length > 0) {
                placeholder.style.display = "none";

                messages.forEach((message) => {
                    const messageElement = createMessageElement(message);
                    messagesContainer.appendChild(messageElement);
                });

                if (isLoading) {
                    const loadingElement = createLoadingElement();
                    messagesContainer.appendChild(loadingElement);
                }
            } else {
                placeholder.style.display = "block";
            }

            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Send message
        async function sendMessage() {
            const message = messageInput.value.trim();

            if (!message || isLoading) return;

            try {
                setLoading(true);

                // we are preparing data for api call before pushing user message we are send the question instead of formatted messages which parse in server side
                // we are push the current user message temporarly to show the message in UI until we get the response from API
                const paylod = {
                    messages: [...messages],
                    question: message,
                };

                messages.push({ content: message, role: "user" });

                messageInput.value = "";

                updateMessagesDisplay();

                // Call API
                const response = await chatApi(paylod);

                if (response.success && response.data?.messages) {
                    messages = [...response.data.messages];
                }

                updateMessagesDisplay();
            } catch (error) {
                messages.push({
                    content: "Sorry, I encountered an error. Please try again.",
                    role: "assistant",
                });
                updateMessagesDisplay();
            } finally {
                setLoading(false);
            }
        }

        // Set loading state
        function setLoading(loading) {
            isLoading = loading;

            sendBtn.disabled = loading || !messageInput.value.trim();
            sendBtn.classList.toggle("opacity-50", sendBtn.disabled);
            sendBtn.classList.toggle("cursor-not-allowed", sendBtn.disabled);

            messageInput.disabled = loading;
            messageInput.classList.toggle("opacity-60", loading);
            messageInput.classList.toggle("cursor-not-allowed", loading);
            messageInput.placeholder = loading ? "AI is thinking..." : "Ask me...";

            // Update example questions

            updateMessagesDisplay();
        }

        // Update send button state based on input
        function updateSendButton() {
            const hasValue = messageInput.value.trim().length > 0;
            sendBtn.disabled = !hasValue || isLoading;
            sendBtn.classList.toggle("opacity-50", sendBtn.disabled);
            sendBtn.classList.toggle("cursor-not-allowed", sendBtn.disabled);
        }

        // Event listeners
        chatToggleBtn.addEventListener("click", toggleChat);
        closeBtn.addEventListener("click", toggleChat);
        maximizeBtn.addEventListener("click", toggleMaximize);
        sendBtn.addEventListener("click", sendMessage);

        // Input event listeners
        messageInput.addEventListener("input", updateSendButton);
        messageInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Example question clicks
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("example-question") && !isLoading) {
                const question = e.target.getAttribute("data-question");
                messageInput.value = question;
                updateSendButton();
                messageInput.focus();
            }
        });

        // Initialize
        updateSendButton();
    });
```
