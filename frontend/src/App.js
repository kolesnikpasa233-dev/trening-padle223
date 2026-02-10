import { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { BookingModal } from '@/components/BookingModal';
import axios from 'axios';
import { 
  Menu, X, MapPin, Phone, Send, MessageCircle,
  Users, Zap, Heart, Trophy,
  ChevronRight, Star, Check, ArrowRight
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Images from design guidelines
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1644739134858-b0fc32036267?crop=entropy&cs=srgb&fm=jpg&q=85',
  equipment: 'https://images.unsplash.com/photo-1612534847738-b3af9bc31f0c?crop=entropy&cs=srgb&fm=jpg&q=85',
  social1: 'https://images.unsplash.com/photo-1758275557473-6e6359ced762?crop=entropy&cs=srgb&fm=jpg&q=85',
  social2: 'https://images.unsplash.com/photo-1753351054861-413f98130391?crop=entropy&cs=srgb&fm=jpg&q=85',
  groupFun: 'https://images.unsplash.com/photo-1660214332007-d0f2612f0632?crop=entropy&cs=srgb&fm=jpg&q=85',
  atmosphere: 'https://images.unsplash.com/photo-1713764054316-7b45081dcac8?crop=entropy&cs=srgb&fm=jpg&q=85',
};

// Navigation Component
const Navigation = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
      data-testid="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2" data-testid="logo">
          <div className="w-10 h-10 bg-[#FF007F] rounded-sm flex items-center justify-center">
            <span className="text-white font-heading font-black text-xl">P</span>
          </div>
          <span className={`font-heading font-bold text-xl uppercase tracking-tight ${isScrolled ? 'text-[#1A1A1A]' : 'text-white'}`}>
            Padel Moscow
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { id: 'about', label: 'О падле' },
            { id: 'formats', label: 'Форматы' },
            { id: 'prices', label: 'Цены' },
            { id: 'contacts', label: 'Контакты' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`nav-link ${isScrolled ? 'text-[#1A1A1A]' : 'text-white'}`}
              data-testid={`nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={onBookClick}
            className="btn-primary"
            data-testid="nav-book-btn"
          >
            Записаться
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="mobile-menu-btn"
        >
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 ${isScrolled ? 'text-[#1A1A1A]' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-[#1A1A1A]' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-dark absolute top-full left-0 right-0 p-4 animate-fade-in-up">
          {[
            { id: 'about', label: 'О падле' },
            { id: 'formats', label: 'Форматы' },
            { id: 'prices', label: 'Цены' },
            { id: 'contacts', label: 'Контакты' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block w-full text-left py-3 text-white font-heading uppercase tracking-wide"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { onBookClick(); setIsMobileMenuOpen(false); }}
            className="btn-primary w-full mt-4"
          >
            Записаться
          </button>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const HeroSection = ({ onBookClick, onTryClick }) => (
  <section className="hero-section" data-testid="hero-section">
    <div 
      className="hero-bg"
      style={{ backgroundImage: `url(${IMAGES.hero})` }}
    />
    <div className="hero-overlay" />
    
    <div className="relative z-10 min-h-screen flex items-end pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="max-w-3xl">
          <p className="text-[#FF007F] font-heading font-bold text-lg md:text-xl uppercase tracking-widest mb-4 animate-fade-in-up">
            Падел-центр в Москве
          </p>
          <h1 className="text-white font-heading font-black text-5xl md:text-7xl lg:text-8xl uppercase leading-none mb-6 animate-fade-in-up delay-100">
            Падл — самый доступный и азартный спорт
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-body mb-8 max-w-xl animate-fade-in-up delay-200">
            Играй в падл без опыта, без партнёра, с первого занятия. 
            Метро Тульская, Москва.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <button 
              onClick={onBookClick}
              className="btn-primary animate-pulse-pink"
              data-testid="hero-book-btn"
            >
              Записаться на игру
            </button>
            <button 
              onClick={onTryClick}
              className="btn-secondary"
              data-testid="hero-try-btn"
            >
              Попробовать впервые
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Benefits Section
const BenefitsSection = () => {
  const benefits = [
    { icon: <Zap className="w-8 h-8" />, title: 'Просто начать', desc: 'Правила понятны за 10 минут' },
    { icon: <Users className="w-8 h-8" />, title: 'Социальный', desc: 'Всегда игра 2×2 в компании' },
    { icon: <Heart className="w-8 h-8" />, title: 'Безопасный', desc: 'Меньше нагрузки на суставы' },
    { icon: <Trophy className="w-8 h-8" />, title: 'Азартный', desc: 'Втягивает с первой игры' },
  ];

  return (
    <section id="about" className="section-light py-20 md:py-32" data-testid="benefits-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold uppercase tracking-widest mb-4">
            Почему падл?
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-6xl uppercase text-[#1A1A1A]">
            Почему падл выбирают вместо тенниса
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white border border-[#E4E4E7] p-8 card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`benefit-card-${index}`}
            >
              <div className="w-16 h-16 bg-[#FFE5F0] rounded-sm flex items-center justify-center text-[#FF007F] mb-6">
                {benefit.icon}
              </div>
              <h3 className="font-heading font-bold text-2xl uppercase mb-3 text-[#1A1A1A]">
                {benefit.title}
              </h3>
              <p className="text-[#71717A] font-body">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Personas Section
const PersonasSection = ({ onBookClick }) => {
  const personas = [
    { 
      title: 'Новичок', 
      desc: 'Никогда не играл, хочу попробовать — мы подберём группу и объясним правила',
      color: 'bg-[#FF007F]'
    },
    { 
      title: 'Активный игрок', 
      desc: 'Уже играл, хочу регулярные игры и рост уровня',
      color: 'bg-[#1A1A1A]'
    },
    { 
      title: 'Компания друзей', 
      desc: 'Отличный формат для вечера или выходных',
      color: 'bg-[#FF007F]'
    },
    { 
      title: 'Корпоративы', 
      desc: 'Командный спорт + эмоции + общение для вашей команды',
      color: 'bg-[#1A1A1A]'
    },
  ];

  return (
    <section className="section-surface py-20 md:py-32" data-testid="personas-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold uppercase tracking-widest mb-4">
            Для кого
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-6xl uppercase text-[#1A1A1A]">
            Наш падл-центр для тебя
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personas.map((persona, index) => (
            <div 
              key={index}
              className={`${persona.color} p-8 md:p-10 card-hover group cursor-pointer`}
              onClick={onBookClick}
              data-testid={`persona-card-${index}`}
            >
              <h3 className="font-heading font-bold text-3xl md:text-4xl uppercase text-white mb-4">
                {persona.title}
              </h3>
              <p className="text-white/80 font-body text-lg mb-6">
                {persona.desc}
              </p>
              <div className="flex items-center gap-2 text-white font-heading uppercase tracking-wide group-hover:gap-4 transition-all duration-300">
                <span>Записаться</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Process Section
const ProcessSection = () => {
  const steps = [
    { num: 1, title: 'Выбираешь формат игры', desc: 'Открытая игра, тренировка или корпоратив' },
    { num: 2, title: 'Мы подбираем партнёров', desc: 'По уровню игры и расписанию' },
    { num: 3, title: 'Приходишь на корт', desc: 'Ракетки и мячи уже есть' },
    { num: 4, title: 'Играешь и кайфуешь', desc: 'А мы фиксируем прогресс' },
  ];

  return (
    <section className="section-light py-20 md:py-32" data-testid="process-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#FF007F] font-heading font-bold uppercase tracking-widest mb-4">
              Как это работает
            </p>
            <h2 className="font-heading font-bold text-4xl md:text-6xl uppercase text-[#1A1A1A] mb-8">
              Как всё проходит
            </h2>

            <div className="space-y-0">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6" data-testid={`process-step-${index}`}>
                  <div className="flex flex-col items-center">
                    <div className="timeline-dot">{step.num}</div>
                    {index < steps.length - 1 && <div className="timeline-line flex-1 min-h-[60px]" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-heading font-bold text-xl md:text-2xl uppercase text-[#1A1A1A] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#71717A] font-body">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img 
              src={IMAGES.equipment}
              alt="Padel equipment"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#FF007F] p-6 text-white">
              <p className="font-heading font-bold text-4xl">0₽</p>
              <p className="font-body text-sm">за аренду инвентаря</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Formats Section
const FormatsSection = ({ onFormatSelect }) => {
  const formats = [
    { 
      id: 'open_game',
      title: 'Открытые игры', 
      desc: 'Приходишь один — мы найдём партнёров',
      price: 'от 4 000 ₽',
      color: 'border-[#FF007F]',
      badge: 'Популярно'
    },
    { 
      id: 'training',
      title: 'Тренировки', 
      desc: 'С профессиональным тренером',
      price: 'от 6 000 ₽',
      color: 'border-[#1A1A1A]',
      badge: null
    },
    { 
      id: 'subscription',
      title: 'Абонементы', 
      desc: '4 игры со скидкой 30%',
      price: 'от 11 200 ₽',
      color: 'border-[#FF007F]',
      badge: 'Выгодно'
    },
    { 
      id: 'tournament',
      title: 'Турниры', 
      desc: 'Соревнуйся и выигрывай призы',
      price: 'от 5 000 ₽',
      color: 'border-[#1A1A1A]',
      badge: null
    },
    { 
      id: 'corporate',
      title: 'Корпоративы', 
      desc: 'Тимбилдинг и праздники',
      price: 'от 15 000 ₽',
      color: 'border-[#1A1A1A]',
      badge: null
    },
  ];

  return (
    <section id="formats" className="section-pink py-20 md:py-32" data-testid="formats-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold uppercase tracking-widest mb-4">
            Форматы
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-6xl uppercase text-[#1A1A1A]">
            Выбери свой формат игры
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formats.map((format, index) => (
            <div 
              key={index}
              className={`bg-white border-2 ${format.color} p-6 md:p-8 card-hover relative`}
              data-testid={`format-card-${format.id}`}
            >
              {format.badge && (
                <div className="absolute -top-3 right-6 bg-[#FF007F] text-white px-4 py-1 font-heading uppercase text-sm">
                  {format.badge}
                </div>
              )}
              <h3 className="font-heading font-bold text-2xl uppercase text-[#1A1A1A] mb-3">
                {format.title}
              </h3>
              <p className="text-[#71717A] font-body mb-6">
                {format.desc}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#FF007F] font-heading font-bold text-xl">
                  {format.price}
                </span>
                <button 
                  onClick={() => onFormatSelect(format.id)}
                  className="flex items-center gap-2 text-[#1A1A1A] font-heading uppercase text-sm hover:text-[#FF007F] transition-colors duration-300"
                  data-testid={`format-book-${format.id}`}
                >
                  Записаться <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = ({ onBookClick }) => {
  const plans = [
    { 
      title: 'Разовая игра', 
      price: '4 000', 
      unit: '₽ / игра',
      features: ['1.5 часа на корте', 'Ракетки и мячи', 'Подбор партнёров'],
      popular: false
    },
    { 
      title: 'Тренировка', 
      price: '6 000', 
      unit: '₽ / занятие',
      features: ['Персональный тренер', 'Разбор техники', 'Видеоанализ игры'],
      popular: true
    },
    { 
      title: 'Абонемент', 
      price: '11 200', 
      unit: '₽ / 4 игры',
      features: ['Скидка 30%', 'Приоритет записи', 'Заморозка до 14 дней'],
      popular: false
    },
  ];

  return (
    <section id="prices" className="section-light py-20 md:py-32" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold uppercase tracking-widest mb-4">
            Цены
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-6xl uppercase text-[#1A1A1A]">
            Прозрачные цены
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`p-8 card-hover relative ${
                plan.popular 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'bg-white border border-[#E4E4E7]'
              }`}
              data-testid={`pricing-plan-${index}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF007F] text-white px-6 py-1 font-heading uppercase text-sm">
                  Популярно
                </div>
              )}
              <h3 className={`font-heading font-bold text-2xl uppercase mb-6 ${
                plan.popular ? 'text-white' : 'text-[#1A1A1A]'
              }`}>
                {plan.title}
              </h3>
              <div className="mb-6">
                <span className="stat-number">{plan.price}</span>
                <span className={`font-body ${plan.popular ? 'text-white/70' : 'text-[#71717A]'}`}>
                  {plan.unit}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-[#FF007F]' : 'text-[#FF007F]'}`} />
                    <span className={`font-body ${plan.popular ? 'text-white/80' : 'text-[#71717A]'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onBookClick}
                className={`w-full py-4 font-heading font-bold uppercase tracking-wide transition-colors duration-300 ${
                  plan.popular 
                    ? 'bg-[#FF007F] text-white hover:bg-[#D6006A]' 
                    : 'bg-[#1A1A1A] text-white hover:bg-[#FF007F]'
                }`}
                data-testid={`pricing-book-${index}`}
              >
                Записаться
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Atmosphere Section
const AtmosphereSection = () => (
  <section className="section-dark py-20 md:py-32" data-testid="atmosphere-section">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[#FF007F] font-heading font-bold uppercase tracking-widest mb-4">
            Атмосфера
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-6xl uppercase text-white mb-6">
            Это не просто спорт
          </h2>
          <p className="text-white/70 font-body text-lg md:text-xl leading-relaxed mb-8">
            Это новые знакомства, азарт и отдых после работы. 
            Приходи — и почувствуй энергию падла.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="https://wa.me/79991234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-[#FF007F] transition-colors duration-300"
              data-testid="whatsapp-link"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-heading uppercase">WhatsApp</span>
            </a>
            <a 
              href="https://t.me/padelmoscow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-[#FF007F] transition-colors duration-300"
              data-testid="telegram-link"
            >
              <Send className="w-6 h-6" />
              <span className="font-heading uppercase">Telegram</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img 
            src={IMAGES.social1}
            alt="Padel atmosphere"
            className="w-full h-64 object-cover"
          />
          <img 
            src={IMAGES.social2}
            alt="Padel players"
            className="w-full h-64 object-cover mt-8"
          />
          <img 
            src={IMAGES.groupFun}
            alt="Group fun"
            className="w-full h-64 object-cover -mt-8"
          />
          <img 
            src={IMAGES.atmosphere}
            alt="Padel court"
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

// Reviews Section
const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ players: 0, games_per_month: 0, rating: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, statsRes] = await Promise.all([
          axios.get(`${API}/reviews`),
          axios.get(`${API}/stats`)
        ]);
        setReviews(reviewsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="section-surface py-20 md:py-32" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-20">
          <div className="text-center" data-testid="stat-rating">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-8 h-8 text-[#FF007F] fill-[#FF007F]" />
              <span className="stat-number">{stats.rating}</span>
            </div>
            <p className="text-[#71717A] font-body">Рейтинг</p>
          </div>
          <div className="text-center" data-testid="stat-players">
            <span className="stat-number">{stats.players}+</span>
            <p className="text-[#71717A] font-body">Игроков</p>
          </div>
          <div className="text-center" data-testid="stat-games">
            <span className="stat-number">{stats.games_per_month}+</span>
            <p className="text-[#71717A] font-body">Игр в месяц</p>
          </div>
        </div>

        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold uppercase tracking-widest mb-4">
            Отзывы
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-6xl uppercase text-[#1A1A1A]">
            Что говорят игроки
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div 
              key={review.id}
              className="bg-white p-6 card-hover"
              data-testid={`review-card-${index}`}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#FF007F] fill-[#FF007F]" />
                ))}
              </div>
              <p className="text-[#1A1A1A] font-body mb-6 line-clamp-4">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                {review.avatar && (
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <span className="font-heading font-bold text-[#1A1A1A]">
                  {review.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = ({ onBookClick }) => (
  <section className="relative py-20 md:py-32 overflow-hidden" data-testid="cta-section">
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${IMAGES.hero})` }}
    />
    <div className="absolute inset-0 bg-[#FF007F]/90" />
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
      <h2 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl uppercase text-white mb-6">
        Попробуй падл уже на этой неделе
      </h2>
      <p className="text-white/80 font-body text-lg md:text-xl mb-10 max-w-2xl mx-auto">
        Мы подберём игру под твой уровень. Ракетки и мячи уже ждут тебя.
      </p>
      <button 
        onClick={onBookClick}
        className="bg-white text-[#FF007F] px-12 py-5 font-heading font-bold text-xl uppercase tracking-wide hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300"
        data-testid="cta-book-btn"
      >
        Записаться на игру
      </button>
    </div>
  </section>
);

// Footer
const Footer = () => (
  <footer id="contacts" className="section-dark py-16 md:py-20" data-testid="footer">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Logo & About */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#FF007F] rounded-sm flex items-center justify-center">
              <span className="text-white font-heading font-black text-xl">P</span>
            </div>
            <span className="font-heading font-bold text-xl uppercase tracking-tight text-white">
              Padel Moscow
            </span>
          </div>
          <p className="text-white/70 font-body mb-6 max-w-md">
            Падел-центр в Москве. Играй в самый азартный спорт без опыта и партнёра.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/79991234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[#FF007F] transition-colors duration-300"
              data-testid="footer-whatsapp"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://t.me/padelmoscow"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[#FF007F] transition-colors duration-300"
              data-testid="footer-telegram"
            >
              <Send className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Contacts */}
        <div>
          <h4 className="font-heading font-bold text-lg uppercase text-white mb-6">
            Контакты
          </h4>
          <ul className="space-y-4">
            <li>
              <a href="tel:+79991234567" className="footer-link flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>+7 (999) 123-45-67</span>
              </a>
            </li>
            <li>
              <div className="footer-link flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <span>Москва, м. Тульская<br />ул. Примерная, 10</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Schedule */}
        <div>
          <h4 className="font-heading font-bold text-lg uppercase text-white mb-6">
            Режим работы
          </h4>
          <ul className="space-y-2 text-white/70 font-body">
            <li>Пн-Пт: 09:00 – 22:00</li>
            <li>Сб-Вс: 10:00 – 21:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/50 font-body text-sm">
          © 2025 Padel Moscow. Все права защищены.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/50 hover:text-[#FF007F] text-sm transition-colors duration-300">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// Main Home Component
const Home = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);

  const handleBookClick = () => {
    setSelectedFormat(null);
    setIsBookingOpen(true);
  };

  const handleTryClick = () => {
    setSelectedFormat('open_game');
    setIsBookingOpen(true);
  };

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    setIsBookingOpen(true);
  };

  return (
    <div data-testid="home-page">
      <Navigation onBookClick={handleBookClick} />
      <HeroSection onBookClick={handleBookClick} onTryClick={handleTryClick} />
      <BenefitsSection />
      <PersonasSection onBookClick={handleBookClick} />
      <ProcessSection />
      <FormatsSection onFormatSelect={handleFormatSelect} />
      <PricingSection onBookClick={handleBookClick} />
      <AtmosphereSection />
      <ReviewsSection />
      <CTASection onBookClick={handleBookClick} />
      <Footer />
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        initialFormat={selectedFormat}
      />
      
      <Toaster position="top-center" richColors />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
