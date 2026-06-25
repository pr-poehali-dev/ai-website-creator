export interface GeneratedSection {
  type: string;
  title: string;
  content: string;
  icon: string;
}

export interface GeneratedSite {
  siteName: string;
  siteType: string;
  industry: string;
  tagline: string;
  palette: { from: string; to: string; name: string };
  sections: GeneratedSection[];
  buttons: string[];
  features: string[];
  pages: string[];
  confidence: number;
  reasoning: string[];
}

export interface AIModel {
  id: string;
  name: string;
  desc: string;
  iq: string;
  speed: string;
  icon: string;
  badge?: string;
}

export const AI_MODELS: AIModel[] = [
  { id: 'nebula-ultra', name: 'Nebula Ultra', desc: 'Понимает все слова русского языка. IQ 999999999.', iq: '999 999 999', speed: 'Молниеносно', icon: 'Sparkles', badge: 'TOP' },
  { id: 'nebula-pro', name: 'Nebula Pro', desc: 'Баланс скорости и качества для большинства задач.', iq: '7 500 000', speed: 'Очень быстро', icon: 'Zap' },
  { id: 'nebula-creative', name: 'Nebula Creative', desc: 'Креативные тексты и нестандартный дизайн.', iq: '4 200 000', speed: 'Быстро', icon: 'Palette' },
  { id: 'nebula-lite', name: 'Nebula Lite', desc: 'Лёгкая модель для простых лендингов.', iq: '850 000', speed: 'Мгновенно', icon: 'Feather' },
];

const PALETTES = [
  { from: 'from-violet-500', to: 'to-fuchsia-500', name: 'Космос' },
  { from: 'from-cyan-400', to: 'to-blue-600', name: 'Океан' },
  { from: 'from-amber-400', to: 'to-orange-600', name: 'Закат' },
  { from: 'from-emerald-400', to: 'to-teal-600', name: 'Лес' },
  { from: 'from-rose-400', to: 'to-pink-600', name: 'Сакура' },
  { from: 'from-indigo-500', to: 'to-purple-600', name: 'Ночь' },
];

interface Industry {
  keys: string[];
  industry: string;
  icon: string;
  palette: number;
  features: string[];
  buttons: string[];
  sections: { type: string; title: string; content: string; icon: string }[];
}

const INDUSTRIES: Industry[] = [
  {
    keys: ['кофе', 'кофейн', 'кафе', 'ресторан', 'еда', 'пицц', 'суши', 'бар', 'кухн', 'меню', 'бистро', 'пекарн', 'кондитер', 'столов'],
    industry: 'Еда и рестораны', icon: 'Coffee', palette: 2,
    features: ['Онлайн-меню', 'Бронирование столика', 'Доставка', 'Программа лояльности'],
    buttons: ['Забронировать стол', 'Посмотреть меню', 'Заказать доставку'],
    sections: [
      { type: 'hero', title: 'Вкус, который запоминается', content: 'Свежие блюда каждый день. Уютная атмосфера и забота в каждой детали.', icon: 'UtensilsCrossed' },
      { type: 'menu', title: 'Наше меню', content: 'Авторские блюда из локальных продуктов по доступным ценам.', icon: 'BookOpen' },
      { type: 'booking', title: 'Забронируйте столик', content: 'Выберите дату и время — мы всё подготовим к вашему приходу.', icon: 'CalendarCheck' },
    ],
  },
  {
    keys: ['магазин', 'товар', 'купить', 'продаж', 'шоп', 'каталог', 'корзин', 'одежд', 'обув', 'космет', 'электрон', 'маркет', 'бутик'],
    industry: 'Интернет-магазин', icon: 'ShoppingBag', palette: 1,
    features: ['Каталог товаров', 'Корзина и оплата', 'Фильтры', 'Отзывы покупателей'],
    buttons: ['В корзину', 'Купить сейчас', 'Открыть каталог'],
    sections: [
      { type: 'hero', title: 'Покупки, которые радуют', content: 'Тысячи товаров с быстрой доставкой и честными ценами.', icon: 'ShoppingCart' },
      { type: 'catalog', title: 'Каталог', content: 'Удобные фильтры помогут найти именно то, что вы ищете.', icon: 'LayoutGrid' },
      { type: 'reviews', title: 'Отзывы покупателей', content: 'Более 10 000 довольных клиентов рекомендуют нас.', icon: 'Star' },
    ],
  },
  {
    keys: ['портфолио', 'фотограф', 'дизайнер', 'художник', 'работы', 'галере', 'креатив', 'студи', 'арт', 'иллюстра'],
    industry: 'Портфолио', icon: 'Image', palette: 5,
    features: ['Галерея работ', 'Форма заказа', 'Обо мне', 'Контакты'],
    buttons: ['Смотреть работы', 'Связаться', 'Заказать проект'],
    sections: [
      { type: 'hero', title: 'Творчество без границ', content: 'Избранные работы, которые говорят сами за себя.', icon: 'Sparkle' },
      { type: 'gallery', title: 'Галерея', content: 'Подборка лучших проектов в высоком качестве.', icon: 'Images' },
      { type: 'about', title: 'Обо мне', content: 'История, подход к работе и ценности.', icon: 'User' },
    ],
  },
  {
    keys: ['курс', 'обучени', 'школ', 'образован', 'урок', 'тренинг', 'вебинар', 'универ', 'студент', 'учеб', 'репетитор', 'академи'],
    industry: 'Образование', icon: 'GraduationCap', palette: 3,
    features: ['Каталог курсов', 'Запись на обучение', 'Личный кабинет', 'Сертификаты'],
    buttons: ['Записаться на курс', 'Начать обучение', 'Получить программу'],
    sections: [
      { type: 'hero', title: 'Знания, меняющие жизнь', content: 'Практические курсы от экспертов с поддержкой на каждом шаге.', icon: 'BookMarked' },
      { type: 'courses', title: 'Программы обучения', content: 'Выберите направление и начните учиться уже сегодня.', icon: 'Library' },
      { type: 'enroll', title: 'Запишитесь', content: 'Оставьте заявку — куратор свяжется с вами в течение часа.', icon: 'ClipboardCheck' },
    ],
  },
  {
    keys: ['клиник', 'врач', 'медицин', 'здоров', 'стоматолог', 'больниц', 'лечени', 'доктор', 'аптек', 'красот', 'салон', 'спа', 'массаж'],
    industry: 'Медицина и красота', icon: 'HeartPulse', palette: 4,
    features: ['Онлайн-запись', 'Услуги и цены', 'Наши специалисты', 'Отзывы'],
    buttons: ['Записаться на приём', 'Узнать цены', 'Выбрать врача'],
    sections: [
      { type: 'hero', title: 'Забота о вас каждый день', content: 'Опытные специалисты и современное оборудование.', icon: 'Stethoscope' },
      { type: 'services', title: 'Услуги', content: 'Полный спектр процедур с прозрачными ценами.', icon: 'ListChecks' },
      { type: 'appointment', title: 'Запись на приём', content: 'Выберите удобное время онлайн за минуту.', icon: 'CalendarPlus' },
    ],
  },
  {
    keys: ['it', 'стартап', 'технолог', 'разработ', 'приложени', 'софт', 'сервис', 'saas', 'продукт', 'b2b', 'компани', 'бизнес', 'агентств'],
    industry: 'IT и бизнес', icon: 'Cpu', palette: 0,
    features: ['Описание продукта', 'Тарифы', 'Демо-запрос', 'Кейсы клиентов'],
    buttons: ['Попробовать бесплатно', 'Запросить демо', 'Выбрать тариф'],
    sections: [
      { type: 'hero', title: 'Технологии для роста', content: 'Современное решение, которое экономит ваше время и деньги.', icon: 'Rocket' },
      { type: 'features', title: 'Возможности', content: 'Всё необходимое в одном понятном интерфейсе.', icon: 'Boxes' },
      { type: 'pricing', title: 'Тарифы', content: 'Гибкие планы для команд любого размера.', icon: 'CreditCard' },
    ],
  },
];

const DEFAULT_INDUSTRY: Industry = {
  keys: [], industry: 'Универсальный сайт', icon: 'Globe', palette: 0,
  features: ['Главный экран', 'О проекте', 'Услуги', 'Контакты'],
  buttons: ['Узнать больше', 'Связаться с нами', 'Оставить заявку'],
  sections: [
    { type: 'hero', title: 'Добро пожаловать', content: 'Современный сайт, созданный специально под вашу идею.', icon: 'Home' },
    { type: 'about', title: 'О нас', content: 'Расскажите миру о том, что делает вас особенными.', icon: 'Info' },
    { type: 'contact', title: 'Контакты', content: 'Свяжитесь с нами удобным способом.', icon: 'Mail' },
  ],
};

const STOP = new Set(['и','в','на','с','для','по','из','о','а','но','что','как','это','сайт','хочу','нужен','сделай','создай','мне','под','от','до']);

function extractName(prompt: string): string {
  const quoted = prompt.match(/[«"]([^»"]+)[»"]/);
  if (quoted) return quoted[1];
  const words = prompt.split(/[\s,.]+/).filter((w) => w.length > 2 && !STOP.has(w.toLowerCase()));
  const cap = words.find((w) => /^[А-ЯA-Z]/.test(w));
  if (cap) return cap;
  return words[0] ? words[0][0].toUpperCase() + words[0].slice(1) : 'Мой Сайт';
}

function detectSiteType(p: string): string {
  if (/лендинг|landing|одностранич|посадочн/.test(p)) return 'Лендинг';
  if (/магазин|каталог|товар|купить|корзин/.test(p)) return 'Интернет-магазин';
  if (/портфолио|галере|работы/.test(p)) return 'Портфолио';
  if (/блог|статьи|новости/.test(p)) return 'Блог';
  if (/визитк|компани|организ/.test(p)) return 'Сайт-визитка';
  return 'Многостраничный сайт';
}

// "Понимает все слова русского языка" — анализ по морфемам и ключам
export function analyzePrompt(prompt: string, modelId: string): GeneratedSite {
  const p = prompt.toLowerCase().trim();
  const reasoning: string[] = [];

  let best = DEFAULT_INDUSTRY;
  let bestScore = 0;
  for (const ind of INDUSTRIES) {
    const score = ind.keys.reduce((acc, k) => acc + (p.includes(k) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = ind; }
  }

  reasoning.push(`Распознано слов: ${p.split(/\s+/).filter(Boolean).length}`);
  reasoning.push(bestScore > 0 ? `Тематика определена: «${best.industry}»` : 'Тематика общая — собираю универсальный шаблон');

  const siteType = detectSiteType(p);
  reasoning.push(`Тип сайта: ${siteType}`);

  // цвет по ключевым словам
  let paletteIdx = best.palette;
  if (/синий|голуб|море|вод/.test(p)) paletteIdx = 1;
  else if (/красн|оранж|тепл|огон/.test(p)) paletteIdx = 2;
  else if (/зелён|зелен|эко|природ/.test(p)) paletteIdx = 3;
  else if (/розов|нежн|девич/.test(p)) paletteIdx = 4;
  else if (/фиолет|космос|тёмн|темн/.test(p)) paletteIdx = 5;
  if (paletteIdx !== best.palette) reasoning.push(`Палитра подобрана по описанию: «${PALETTES[paletteIdx].name}»`);

  const model = AI_MODELS.find((m) => m.id === modelId) || AI_MODELS[0];
  const confidence = modelId === 'nebula-ultra'
    ? Math.min(99.9, 88 + bestScore * 4)
    : Math.min(96, 72 + bestScore * 5);
  reasoning.push(`Модель «${model.name}» · уверенность ${confidence.toFixed(1)}%`);

  const siteName = extractName(prompt);
  reasoning.push(`Название проекта: «${siteName}»`);

  return {
    siteName,
    siteType,
    industry: best.industry,
    tagline: best.sections[0].content,
    palette: PALETTES[paletteIdx],
    sections: best.sections,
    buttons: best.buttons,
    features: best.features,
    pages: ['Главная', ...best.sections.slice(1).map((s) => s.title), 'Контакты'],
    confidence,
    reasoning,
  };
}
