# MANA AI Assistant - دستیار هوشمند مانا

**MANA AI Assistant** یک دستیار هوش مصنوعی پیشرفته و چند منظوره است که با استفاده از چندین مدل هوش مصنوعی به کاربران در مدیریت زندگی روزمره، افزایش بهره‌وری و بهبود تجربه دیجیتال کمک می‌کند.

> MANA - کاهش اصطکاک در زندگی روزمره با هوش مصنوعی

## 🧠 ویژگی‌های کلیدی

### موتور هوش مصنوعی چند مدلی
- پشتیبانی از چند مدل AI: سبک (رایگان)، قوی (Pro) و آفلاین
- امکان انتخاب مدل توسط کاربر
- مدیریت مصرف توکن و سیستم fallback زمانی که API قطع شد

### سیستم چت هوشمند
- چت متنی با AI
- تاریخچه چت و دسته‌بندی گفتگوها (کاری، شخصی، فال و سرگرمی)
- پاسخ با لحن‌های مختلف (رسمی، خودمونی، دوستانه، طنز، حرفه‌ای)

### برنامه‌ریزی کارها
- افزودن کارهای روزانه با زمان‌بندی و یادآوری
- اولویت‌بندی (کم/متوسط/زیاد) و وضعیت انجام
- پیشنهاد هوشمند برای تقسیم کارهای بزرگ و یادآوری

#### SmartTopTasks (۳ کار برتر)
- انتخاب و رتبه‌بندی ۳ کار مهم امروز به‌صورت خودکار توسط هوش مصنوعی
- ذخیره محلی فهرست کارها در `localStorage` با کلید `mana_tasks` (قابل استفاده توسط ویجت خانگی و `TaskManager`)

### هوش کلیپ‌بورد (ویژگی اصلی)
- مانیتور کردن کپی شدن متن
- تشخیص نوع متن (پیام، کامنت، ایمیل، کپشن، متن رسمی)
- پیشنهاد فوری برای اصلاح متن، پاسخ پیشنهادی، خلاصه‌سازی و تغییر لحن
- قابل فعال/غیرفعال شدن توسط کاربر

### آیکون شناور
- آیکون شناور همیشه در دسترس روی صفحه
- باز شدن سریع مانا، انیمیشن‌های زنده، قابلیت Drag & Drop
- حالت مزاحم نشو و تنظیم شفافیت و اندازه

### پاسخ آماده شبکه‌های اجتماعی
- پاسخ برای اینستاگرام، تلگرام، واتساپ و توییتر (X)
- تشخیص لحن پیام و پیشنهاد چند جواب مختلف
- کپی سریع و ذخیره جواب‌های محبوب

### فال حافظ هوشمند
- انتخاب تصادفی غزل و تفسیر AI متناسب با حال کاربر و سوالش
- فال روزانه، ذخیره و اشتراک فال

### تولید محتوا
- تولید کپشن اینستاگرام، بیو پروفایل، هشتگ، متن تبلیغاتی کوتاه، استوری متنی

## 🛠️ فناوری‌های استفاده شده

- **Frontend**: React, TypeScript
- **UI Framework**: Tailwind CSS
- **State Management**: React hooks, Zustand
- **AI Integration**: Google Gemini API
- **Build Tool**: Vite
- **Architecture**: Modular, component-based design

## 🚀 نحوه راه‌اندازی

1. کلون کردن مخزن:
```bash
git clone <URL_MOTAZEN>
```

2. نصب وابستگی‌ها:
```bash
cd MANA-AI-Assistant
npm install
```

3. تنظیم متغیرهای محیطی:
```bash
cp .env.example .env
# سپس کلید API گمینی خود را در فایل .env وارد کنید
```

4. اجرای برنامه در حالت توسعه:
```bash
npm run dev
```

5. برای ساخت نسخه تولید:
```bash
npm run build
```

## 📋 ساختار پروژه

```
MANA-AI-Assistant/
├── components/          # کامپوننت‌های React
├── services/            # سرویس‌های AI و API
├── src/
│   ├── components/      # کامپوننت‌های اصلی
│   ├── core/            # موتورهای اصلی (AI، چت، کلیپ‌بورد)
│   ├── features/        # ویژگی‌های خاص (فال حافظ، صبح/شب مانا، تسک‌ها)
│   ├── onboarding/      # فرآیند آموزش کاربر
│   ├── services/        # سرویس‌های کمکی
│   ├── store/           # مدیریت حالت (اگر وجود داشته باشد)
│   ├── types/           # تعاریف نوع TypeScript
│   └── ui/              # کامپوننت‌های رابط کاربری
├── public/              # فایل‌های عمومی
└── ...
```

## 🤝 مشارکت

مشارکت‌های شما در بهبود این پروژه بسیار استقبال می‌شود! لطفاً یک Issue برای گزارش باگ یا یک Pull Request برای اضافه کردن ویژگی جدید ایجاد کنید.

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است - برای جزئیات بیشتر فایل [LICENSE](LICENSE) را ببینید.

---

## MANA AI Assistant - Intelligent AI Assistant

**MANA AI Assistant** is an advanced, multi-purpose AI assistant that helps users manage daily life, increase productivity, and improve digital experience using multiple AI models.

> MANA - Reducing friction in daily life with AI

## 🧠 Key Features

### Multi-Model AI Engine
- Support for multiple AI models: Light (free), Powerful (Pro), and offline
- Ability to select model by user
- Token usage management and fallback system when API is down

### Smart Chat System
- Text chat with AI
- Chat history and categorized conversations (work, personal, fortune telling & entertainment)
- Response with different tones (formal, casual, friendly, humorous, professional)

### Task Planning
- Adding daily tasks with scheduling and reminders
- Prioritization (low/medium/high) and completion status
- Intelligent suggestions for breaking down large tasks and reminders

#### SmartTopTasks (Top 3 Tasks)
- Automatically select and rank the top 3 most important tasks for today using AI
- Local task list is stored in `localStorage` under the key `mana_tasks` (used by the Home widget and `TaskManager`)

### Clipboard Intelligence (Signature Feature)
- Monitoring text copying
- Text type detection (message, comment, email, caption, formal text)
- Immediate suggestions for text correction, suggested responses, summarization, and tone changes
- User-activatable/deactivatable

### Floating Icon
- Always accessible floating icon on screen
- Quick opening of MANA, live animations, drag & drop capability
- Do not disturb mode and transparency/size adjustment

### Social Media Response Suggestions
- Responses for Instagram, Telegram, WhatsApp, and Twitter (X)
- Message tone detection and multiple response suggestions
- Quick copy and saving of favorite responses

### Intelligent Hafez Fortune
- Random ghazal selection and AI interpretation based on user mood and questions
- Daily fortune, saving, and sharing of fortunes

### Content Generation
- Instagram caption generation, bio, hashtags, short advertising text, story text

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript
- **UI Framework**: Tailwind CSS
- **State Management**: React hooks, Zustand
- **AI Integration**: Google Gemini API
- **Build Tool**: Vite
- **Architecture**: Modular, component-based design

## 🚀 Setup Instructions

1. Clone the repository:
```bash
git clone <URL_MOTAZEN>
```

2. Install dependencies:
```bash
cd MANA-AI-Assistant
npm install
```

3. Set environment variables:
```bash
cp .env.example .env
# Then enter your Gemini API key in the .env file
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 🤝 Contributing

Your contributions to improve this project are welcome! Please create an Issue for bug reports or a Pull Request to add new features.

## 📄 License

This project is released under the MIT License - see the [LICENSE](LICENSE) file for details.