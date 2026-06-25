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
  description: string;
  palette: { from: string; to: string; name: string; hex: string };
  sections: GeneratedSection[];
  buttons: string[];
  features: string[];
  pages: string[];
  navItems: string[];
  phone: string;
  address: string;
  email: string;
  stats: { value: string; label: string }[];
  confidence: number;
  reasoning: string[];
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
}

export interface AIModel {
  id: string;
  name: string;
  desc: string;
  iq: string;
  speed: string;
  icon: string;
  badge?: string;
  delay: number;
}

export const AI_MODELS: AIModel[] = [
  { id: 'nebula-ultra', name: 'Nebula Ultra', desc: 'IQ 999 999 999 — понимает все слова русского языка, все падежи и формы.', iq: '999 999 999', speed: 'Молниеносно', icon: 'Sparkles', badge: 'TOP', delay: 280 },
  { id: 'nebula-pro', name: 'Nebula Pro', desc: 'Глубокое понимание контекста. Лучший выбор для бизнеса.', iq: '7 500 000', speed: 'Очень быстро', icon: 'Zap', delay: 420 },
  { id: 'nebula-creative', name: 'Nebula Creative', desc: 'Нестандартные решения и яркие тексты для творческих проектов.', iq: '4 200 000', speed: 'Быстро', icon: 'Palette', delay: 560 },
  { id: 'nebula-lite', name: 'Nebula Lite', desc: 'Простые лендинги за секунды без лишних деталей.', iq: '850 000', speed: 'Мгновенно', icon: 'Feather', delay: 380 },
];

const PALETTES = [
  { from: 'from-violet-500', to: 'to-fuchsia-500', name: 'Космос', hex: '#8b5cf6' },
  { from: 'from-cyan-400', to: 'to-blue-600', name: 'Океан', hex: '#22d3ee' },
  { from: 'from-amber-400', to: 'to-orange-600', name: 'Закат', hex: '#f59e0b' },
  { from: 'from-emerald-400', to: 'to-teal-600', name: 'Лес', hex: '#34d399' },
  { from: 'from-rose-400', to: 'to-pink-600', name: 'Сакура', hex: '#fb7185' },
  { from: 'from-indigo-500', to: 'to-purple-600', name: 'Ночь', hex: '#6366f1' },
  { from: 'from-yellow-400', to: 'to-amber-500', name: 'Солнце', hex: '#facc15' },
  { from: 'from-slate-400', to: 'to-slate-700', name: 'Металл', hex: '#94a3b8' },
];

// ─── Морфологическая нормализация русских слов ───────────────────────────────
// Срезаем окончания по таблице, чтобы понимать все падежи/формы слова
const ENDINGS = [
  'ующего','ующему','ующими','ующего','ующей','ующих',
  'ованных','ованному','ованного','ованная','ованные',
  'ающего','ающему','ающими','ающих','ающий','ающая',
  'овского','овскому','овские','овских',
  'ческого','ческому','ческими','ческих','ческий','ческая','ческие',
  'ственных','ственному','ственного','ственные','ственный',
  'ельного','ельному','ельными','ельных','ельный','ельная',
  'ального','альному','альными','альных','альный','альная',
  'ового','овому','овыми','овых','овый','овая','овые',
  'ивать','ывать','евать','овать',
  'ившись','авшись','евшись',
  'ившим','авшим','евшим',
  'ились','авшие','евшие',
  'ются','ются','ются',
  'ится','ется','ться',
  'иями','ями','ием',
  'ами','ями','ями',
  'ого','ому','ими','ыми','ого',
  'ие','ия','ей','ей',
  'ой','ый','ий','ая','яя',
  'их','ых',
  'ет','ют','ит','ят',
  'ть','чь','ся',
  'ах','ях',
  'ов','ев',
  'ом','ем','ём',
  'ую','юю',
  'ен','ён',
  'ам','ям',
  'ал','ял','ил',
  'ла','ло','ли',
  'ши','вши',
];

function normalize(word: string): string {
  const w = word.toLowerCase();
  if (w.length <= 4) return w;
  for (const e of ENDINGS) {
    if (w.endsWith(e) && w.length - e.length >= 3) {
      return w.slice(0, w.length - e.length);
    }
  }
  return w;
}

// ─── Промпт → массив нормализованных токенов ─────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,.!?:;()«»"'-]+/)
    .filter((w) => w.length > 1)
    .map(normalize);
}

// ─── Отраслевые концепты: корни слов + синонимы + смежные понятия ────────────
interface Industry {
  concepts: string[];   // нормализованные корни — сравниваем с normalize(слово)
  industry: string;
  icon: string;
  palette: number;
  features: string[];
  buttons: string[];
  sections: { type: string; title: string; content: string; icon: string }[];
  stats: { value: string; label: string }[];
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  address: string;
  phone: string;
  email: string;
}

const INDUSTRIES: Industry[] = [
  {
    concepts: [
      // кофе и напитки
      'кофе','кофейн','капучин','латте','эспрессо','американ','мокк',
      // еда общее
      'кафе','ресторан','еда','пицц','суш','роллов','бургер','сэндвич',
      'блин','вафл','десерт','торт','пирог','выпечк','хлеб','кондитер','пекарн',
      // напитки
      'бар','паб','чай','смузи','сок','коктейл',
      // сервис
      'меню','блюд','завтрак','обед','ужин','брunch','бизнес-ланч','ланч',
      'доставк','навынос','столик','бронир','резервир','официант','повар','шеф',
      // интерьер/атмосфера
      'уют','атмосфер','терраc','веранд','беседк',
    ],
    industry: 'Еда и рестораны', icon: 'Coffee', palette: 2,
    heroTitle: 'Вкус, который запоминается',
    heroSubtitle: 'Авторская кухня из свежих продуктов. Уютная атмосфера и забота в каждой детали.',
    ctaText: 'Забронировать столик',
    stats: [{ value: '500+', label: 'блюд в меню' }, { value: '4.9★', label: 'рейтинг' }, { value: '8 лет', label: 'на рынке' }],
    features: ['Онлайн-меню', 'Бронирование стола', 'Доставка на дом', 'Программа лояльности'],
    buttons: ['Забронировать стол', 'Открыть меню', 'Заказать доставку'],
    address: 'ул. Гастрономов, 12',
    phone: '+7 (495) 123-45-67',
    email: 'hello@restaurant.ru',
    sections: [
      { type: 'hero', title: 'Вкус, который запоминается', content: 'Авторская кухня, живая музыка и уют для всей семьи.', icon: 'UtensilsCrossed' },
      { type: 'menu', title: 'Наше меню', content: 'Сезонные блюда из фермерских продуктов по авторским рецептам.', icon: 'BookOpen' },
      { type: 'booking', title: 'Забронировать столик', content: 'Выберите дату и время — мы всё подготовим к вашему визиту.', icon: 'CalendarCheck' },
    ],
  },
  {
    concepts: [
      // торговля
      'магазин','шоп','маркет','бутик','лавк','универмаг','торговл',
      // действия
      'купить','покупк','заказ','доставк','продаж','продава','торгова',
      // товары
      'товар','продукт','вещ','изделие','аксессуар','украшен','бижутер',
      // одежда
      'одежд','платье','брюки','джинс','куртк','пальто','костюм','рубашк','юбк','блузк',
      // обувь
      'обувь','туфл','кроссовк','ботинк','сапог','кед',
      // косметика
      'космет','парфюм','духи','крем','тушь','помад','тоник','сывороткa','уход',
      // электроника
      'электроник','телефон','ноутбук','планшет','гаджет','техник',
      // другие товары
      'книга','игрушк','спорт','тренажер','велосипед','самокат',
      // e-commerce
      'каталог','корзин','оплат','скидк','акци','распродаж','сертификат',
    ],
    industry: 'Интернет-магазин', icon: 'ShoppingBag', palette: 1,
    heroTitle: 'Покупки, которые радуют',
    heroSubtitle: 'Тысячи товаров с быстрой доставкой по всей России. Честные цены и удобный возврат.',
    ctaText: 'Открыть каталог',
    stats: [{ value: '10 000+', label: 'товаров' }, { value: '2 дня', label: 'доставка' }, { value: '98%', label: 'довольных' }],
    features: ['Каталог с фильтрами', 'Корзина и оплата', 'Отслеживание заказа', 'Программа лояльности'],
    buttons: ['Открыть каталог', 'Купить сейчас', 'В корзину'],
    address: 'Склад: Логистическая, 1',
    phone: '+7 (800) 555-00-11',
    email: 'shop@store.ru',
    sections: [
      { type: 'hero', title: 'Покупки, которые радуют', content: 'Тысячи товаров с доставкой до двери за 2 дня.', icon: 'ShoppingCart' },
      { type: 'catalog', title: 'Каталог', content: 'Умные фильтры и рекомендации помогут найти нужное.', icon: 'LayoutGrid' },
      { type: 'reviews', title: 'Отзывы покупателей', content: 'Более 50 000 довольных клиентов рекомендуют нас.', icon: 'Star' },
    ],
  },
  {
    concepts: [
      // творчество
      'портфолио','галере','выставк','работ','проект','кейс',
      // профессии
      'фотограф','дизайнер','художник','иллюстратор','аниматор','видеограф',
      'режиссер','актер','музыкант','певец','певиц','модел',
      // стиль/арт
      'арт','креатив','творч','искусств','живопись','скульптур','график',
      'ретушь','постобработк','монтаж','съемк','съёмк',
      // жанры фото
      'свадьб','репортаж','предметн','пейзаж','портрет','лукбук',
    ],
    industry: 'Портфолио и творчество', icon: 'Image', palette: 5,
    heroTitle: 'Творчество без границ',
    heroSubtitle: 'Избранные работы, которые говорят сами за себя. Каждый проект — история.',
    ctaText: 'Смотреть работы',
    stats: [{ value: '300+', label: 'проектов' }, { value: '7 лет', label: 'опыта' }, { value: '50+', label: 'клиентов' }],
    features: ['Галерея проектов', 'Форма заявки', 'Обо мне', 'Мои услуги'],
    buttons: ['Смотреть работы', 'Заказать проект', 'Связаться'],
    address: 'Работаю удалённо и на выезде',
    phone: '+7 (916) 777-88-99',
    email: 'photo@studio.ru',
    sections: [
      { type: 'hero', title: 'Творчество без границ', content: 'Фотографирую, создаю, вдохновляю.', icon: 'Sparkle' },
      { type: 'gallery', title: 'Избранные работы', content: 'Лучшие проекты — от концепции до финала.', icon: 'Images' },
      { type: 'about', title: 'Обо мне', content: 'Мой путь, подход к работе и ценности.', icon: 'User' },
    ],
  },
  {
    concepts: [
      // обучение
      'курс','обучен','учёб','учеб','образован','знани','навык','умени',
      'школ','академи','институт','универ','колледж','лицей',
      // процесс
      'урок','занятие','лекци','семинар','тренинг','вебинар','мастер-класс','воркшоп',
      // участники
      'студент','учащийс','ученик','слушател','выпускник','преподавател','учител','репетитор',
      // предметы
      'математик','физик','химия','биологи','история','литератур','русский',
      'английский','немецкий','китайский','программирован','python','javascript',
      // результаты
      'сертификат','диплом','квалификац','карьер','профессия',
    ],
    industry: 'Образование', icon: 'GraduationCap', palette: 3,
    heroTitle: 'Знания, которые меняют жизнь',
    heroSubtitle: 'Практические курсы от действующих экспертов с поддержкой на каждом шаге обучения.',
    ctaText: 'Начать обучение',
    stats: [{ value: '15 000+', label: 'выпускников' }, { value: '97%', label: 'трудоустройство' }, { value: '120+', label: 'курсов' }],
    features: ['Каталог курсов', 'Личный кабинет', 'Сертификаты', 'Поддержка куратора'],
    buttons: ['Начать обучение', 'Посмотреть программу', 'Записаться'],
    address: 'Онлайн + Офис в Москве',
    phone: '+7 (800) 200-99-00',
    email: 'learn@school.ru',
    sections: [
      { type: 'hero', title: 'Знания, которые меняют жизнь', content: 'Практические курсы с трудоустройством после обучения.', icon: 'BookMarked' },
      { type: 'courses', title: 'Программы', content: 'Выберите направление — начнёте учиться уже сегодня.', icon: 'Library' },
      { type: 'enroll', title: 'Записаться', content: 'Оставьте заявку — куратор свяжется за 5 минут.', icon: 'ClipboardCheck' },
    ],
  },
  {
    concepts: [
      // медицина
      'клиник','больниц','медицин','здоровь','здоров','лечен','диагностик',
      'врач','доктор','хирург','терапевт','педиатр','кардиолог','невролог',
      'стоматолог','зубной','ортодонт','имплант','отбелива',
      'аптек','лекарств','препарат','витамин',
      // красота
      'красот','салон','спа','spa','массаж','маникюр','педикюр','эпиляц',
      'косметолог','ботокс','филлер','уход за лицом','уход за кожей',
      'парикмахер','стрижк','окрашива','волос','прическ',
      // фитнес
      'фитнес','спортзал','тренажер','йога','пилатес','бассейн','crossfit',
    ],
    industry: 'Медицина и красота', icon: 'HeartPulse', palette: 4,
    heroTitle: 'Забота о вас каждый день',
    heroSubtitle: 'Опытные специалисты, современное оборудование и комфорт на каждом этапе.',
    ctaText: 'Записаться на приём',
    stats: [{ value: '20+', label: 'специалистов' }, { value: '5000+', label: 'пациентов' }, { value: '10 лет', label: 'опыта' }],
    features: ['Онлайн-запись', 'Услуги и цены', 'Наши врачи', 'Личный кабинет'],
    buttons: ['Записаться на приём', 'Смотреть услуги', 'Узнать цены'],
    address: 'ул. Здоровья, 5, Москва',
    phone: '+7 (495) 999-44-55',
    email: 'info@clinic.ru',
    sections: [
      { type: 'hero', title: 'Забота о вас каждый день', content: 'Лечение и профилактика по международным стандартам.', icon: 'Stethoscope' },
      { type: 'services', title: 'Услуги', content: 'Полный спектр медицинских и косметологических процедур.', icon: 'ListChecks' },
      { type: 'appointment', title: 'Запись онлайн', content: 'Выберите удобное время — подтвердим за минуту.', icon: 'CalendarPlus' },
    ],
  },
  {
    concepts: [
      // строительство
      'строительств','ремонт','отделк','монтаж','прокладк','сантехник','электрик',
      'строитель','прораб','бригад','бетон','кирпич','арматур',
      'квартир','дом','коттедж','офис','помещени',
      // мебель
      'мебел','кухн','шкаф','диван','кровать','стол','стул','корпусн',
      // интерьер
      'интерьер','дизайн интерьер','декор','оформлен','планировк','перепланировк',
    ],
    industry: 'Строительство и ремонт', icon: 'Hammer', palette: 2,
    heroTitle: 'Строим с душой — на века',
    heroSubtitle: 'Профессиональные бригады, точные сроки и гарантия на все виды работ.',
    ctaText: 'Получить смету',
    stats: [{ value: '500+', label: 'объектов' }, { value: '12 лет', label: 'опыта' }, { value: '100%', label: 'в срок' }],
    features: ['Бесплатная смета', 'Бригада под ключ', 'Гарантия 3 года', '3D-проект'],
    buttons: ['Получить смету', 'Смотреть проекты', 'Позвонить'],
    address: 'ул. Строителей, 8, Москва',
    phone: '+7 (495) 888-22-33',
    email: 'build@company.ru',
    sections: [
      { type: 'hero', title: 'Строим с душой — на века', content: 'Ремонт под ключ с гарантией качества и фиксированной ценой.', icon: 'Building2' },
      { type: 'services', title: 'Услуги', content: 'Полный цикл: от дизайн-проекта до финишной уборки.', icon: 'Wrench' },
      { type: 'portfolio', title: 'Наши объекты', content: 'Реализованные проекты с фотоотчётами.', icon: 'Images' },
    ],
  },
  {
    concepts: [
      // IT
      'it','программирован','разработк','разработ','приложен','сайт','веб',
      'код','backend','frontend','fullstack','devops','api','база данных',
      'python','javascript','react','vue','flutter','swift','kotlin',
      // продукты
      'стартап','продукт','сервис','платформ','saas','crm','erp',
      'автоматизац','цифровизац','цифров','трансформац',
      // бизнес
      'бизнес','компани','организац','корпорац','холдинг','агентств',
      'консалтинг','аутсорс','аутстаф',
      // маркетинг
      'маркетинг','реклам','smm','seo','таргет','контекст','email-маркетинг',
    ],
    industry: 'IT и бизнес', icon: 'Cpu', palette: 0,
    heroTitle: 'Технологии для роста вашего бизнеса',
    heroSubtitle: 'Разрабатываем продукты, которые решают реальные задачи и масштабируются с вами.',
    ctaText: 'Запросить демо',
    stats: [{ value: '200+', label: 'проектов' }, { value: '50+', label: 'клиентов' }, { value: '5 лет', label: 'на рынке' }],
    features: ['Разработка под ключ', 'Поддержка 24/7', 'Интеграции', 'Аналитика'],
    buttons: ['Запросить демо', 'Выбрать тариф', 'Попробовать бесплатно'],
    address: 'Кластер Сколково, Москва',
    phone: '+7 (495) 777-11-22',
    email: 'hello@tech.ru',
    sections: [
      { type: 'hero', title: 'Технологии для роста', content: 'Решение, которое экономит время и деньги с первого дня.', icon: 'Rocket' },
      { type: 'features', title: 'Возможности', content: 'Всё необходимое в одном понятном интерфейсе.', icon: 'Boxes' },
      { type: 'pricing', title: 'Тарифы', content: 'Гибкие планы для команд любого размера.', icon: 'CreditCard' },
    ],
  },
  {
    concepts: [
      // недвижимость
      'недвижимост','квартир','дом','коттедж','таунхаус','апартамент',
      'аренд','снять','сдать','продать','купить квартир',
      'риелтор','агентств недвижимост','застройщик','жк','жилой комплекс',
      'ипотек','рассрочк','этаж','планировк','студи','однушк','двушк',
    ],
    industry: 'Недвижимость', icon: 'Building', palette: 6,
    heroTitle: 'Найдите дом своей мечты',
    heroSubtitle: 'Тысячи проверенных объектов. Поможем купить, продать или сдать без лишней суеты.',
    ctaText: 'Найти объект',
    stats: [{ value: '3000+', label: 'объектов' }, { value: '1200+', label: 'сделок в год' }, { value: '15 лет', label: 'на рынке' }],
    features: ['Каталог объектов', 'Онлайн-просмотр', 'Подбор ипотеки', 'Юридическое сопровождение'],
    buttons: ['Найти квартиру', 'Оставить заявку', 'Оценить объект'],
    address: 'Садовая-Кудринская, 3, Москва',
    phone: '+7 (495) 500-60-70',
    email: 'realty@estate.ru',
    sections: [
      { type: 'hero', title: 'Найдите дом своей мечты', content: 'Проверенные объекты, прозрачные сделки, профессиональная помощь.', icon: 'Home' },
      { type: 'catalog', title: 'Каталог объектов', content: 'Фильтры по цене, площади, району и инфраструктуре.', icon: 'LayoutGrid' },
      { type: 'contact', title: 'Получить консультацию', content: 'Риелтор свяжется с вами в течение 15 минут.', icon: 'Phone' },
    ],
  },
];

const DEFAULT_INDUSTRY: Industry = {
  concepts: [], industry: 'Универсальный сайт', icon: 'Globe', palette: 0,
  heroTitle: 'Добро пожаловать',
  heroSubtitle: 'Современный сайт, созданный специально под вашу идею и аудиторию.',
  ctaText: 'Узнать больше',
  stats: [{ value: '1000+', label: 'клиентов' }, { value: '5 лет', label: 'опыта' }, { value: '99%', label: 'довольных' }],
  features: ['Главный экран', 'О компании', 'Услуги', 'Контакты'],
  buttons: ['Узнать больше', 'Связаться с нами', 'Оставить заявку'],
  address: 'Москва, Россия',
  phone: '+7 (495) 000-00-00',
  email: 'info@site.ru',
  sections: [
    { type: 'hero', title: 'Добро пожаловать', content: 'Современный сайт для вашего бизнеса и идей.', icon: 'Home' },
    { type: 'about', title: 'О нас', content: 'Расскажите миру о том, что делает вас особенными.', icon: 'Info' },
    { type: 'contact', title: 'Контакты', content: 'Свяжитесь с нами удобным способом.', icon: 'Mail' },
  ],
};

const STOP_TOKENS = new Set([
  'и','в','на','с','для','по','из','о','а','но','что','как','это',
  'сайт','хочу','нужен','нужно','сделай','создай','мне','под','от','до',
  'бы','же','ли','или','за','при','без','над','под','перед','после',
  'который','которая','которые','которого',
  'очень','просто','быстро','хорошо','красиво',
  'чтобы','тоже','ещё','еще','уже','вот','так','там','тут',
]);

function extractName(prompt: string): string {
  // Имя в кавычках
  const quoted = prompt.match(/[«""]([^»""]+)[»""]/);
  if (quoted) return quoted[1];
  // Имя с заглавной буквы, не первое слово
  const words = prompt.split(/[\s,.!?:;()«»"'-]+/);
  for (let i = 1; i < words.length; i++) {
    const w = words[i];
    if (w.length > 2 && /^[А-ЯЁA-Z]/.test(w) && !STOP_TOKENS.has(w.toLowerCase())) return w;
  }
  // Первое значимое слово
  const sig = words.find((w) => w.length > 3 && !STOP_TOKENS.has(w.toLowerCase()));
  if (sig) return sig[0].toUpperCase() + sig.slice(1);
  return 'Мой Сайт';
}

function detectSiteType(tokens: string[], p: string): string {
  if (/лендинг|landing|одностранич|посадочн/.test(p)) return 'Лендинг';
  if (tokens.some((t) => ['магазин','шоп','каталог','корзин'].includes(t))) return 'Интернет-магазин';
  if (tokens.some((t) => ['портфолио','галере'].includes(t))) return 'Портфолио';
  if (/блог|статьи|новост/.test(p)) return 'Блог';
  if (/визитк/.test(p)) return 'Сайт-визитка';
  return 'Многостраничный сайт';
}

export function analyzePrompt(prompt: string, modelId: string): GeneratedSite {
  const p = prompt.toLowerCase().trim();
  const tokens = tokenize(prompt).filter((t) => !STOP_TOKENS.has(t));
  const reasoning: string[] = [];

  reasoning.push(`Токенов выделено: ${tokens.length} из ${prompt.split(/\s+/).filter(Boolean).length} слов`);

  // Скоринг: сравниваем нормализованные токены с концептами
  let best = DEFAULT_INDUSTRY;
  let bestScore = 0;
  let matchedConcepts: string[] = [];

  for (const ind of INDUSTRIES) {
    const hits: string[] = [];
    for (const token of tokens) {
      for (const concept of ind.concepts) {
        // Полное совпадение нормализованных форм или токен начинается с концепта (корень)
        if (token === concept || token.startsWith(concept) || concept.startsWith(token)) {
          if (!hits.includes(concept)) hits.push(concept);
        }
      }
    }
    if (hits.length > bestScore) {
      bestScore = hits.length;
      best = ind;
      matchedConcepts = hits;
    }
  }

  if (bestScore > 0) {
    reasoning.push(`Тематика: «${best.industry}» (совпало: ${matchedConcepts.slice(0, 3).join(', ')})`);
  } else {
    reasoning.push('Тематика универсальная — применяю общий шаблон');
  }

  const siteType = detectSiteType(tokens, p);
  reasoning.push(`Тип сайта: ${siteType}`);

  // Палитра по цветовым словам в запросе
  let paletteIdx = best.palette;
  const colorMap: [RegExp, number][] = [
    [/синий|голуб|лазур|морской|небесн/, 1],
    [/оранж|жёлт|желт|тёпл|тепл|янтар|золот/, 2],
    [/зелён|зелен|эко|природ|трав|лесн/, 3],
    [/розов|нежн|коралл|персик|лосос/, 4],
    [/фиолет|сирен|лавандов|космос|тёмн|темн|ночн/, 5],
    [/жёлт|желт|лимон|солнечн/, 6],
    [/серый|серебр|металл|стальн/, 7],
  ];
  for (const [re, idx] of colorMap) {
    if (re.test(p)) { paletteIdx = idx; break; }
  }
  reasoning.push(`Палитра: «${PALETTES[paletteIdx].name}»`);

  const model = AI_MODELS.find((m) => m.id === modelId) || AI_MODELS[0];
  const confidence = Math.min(99.7, 78 + bestScore * 6 + (modelId === 'nebula-ultra' ? 8 : 0));
  reasoning.push(`Модель «${model.name}» · уверенность ${confidence.toFixed(1)}%`);

  const siteName = extractName(prompt);
  reasoning.push(`Название: «${siteName}»`);

  return {
    siteName,
    siteType,
    industry: best.industry,
    tagline: best.heroSubtitle,
    description: best.heroSubtitle,
    palette: PALETTES[paletteIdx],
    sections: best.sections,
    buttons: best.buttons,
    features: best.features,
    pages: ['Главная', ...best.sections.slice(1).map((s) => s.title), 'Контакты'],
    navItems: ['Главная', 'О нас', 'Услуги', 'Контакты'],
    phone: best.phone,
    address: best.address,
    email: best.email,
    stats: best.stats,
    confidence,
    reasoning,
    heroTitle: best.heroTitle,
    heroSubtitle: best.heroSubtitle,
    ctaText: best.ctaText,
  };
}