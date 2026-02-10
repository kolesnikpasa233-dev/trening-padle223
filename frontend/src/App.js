import { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { BookingModal } from '@/components/BookingModal';
import axios from 'axios';
import {
  Menu, X, MapPin, Phone, Send, MessageCircle,
  Users, Clock, Target, ChevronRight, Star, ArrowRight } from
'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1644739134858-b0fc32036267?crop=entropy&cs=srgb&fm=jpg&q=85',
  atmosphere1: 'https://customer-assets.emergentagent.com/job_paddel-sport/artifacts/0exa278k_photo_2026-02-10%2015.43.15.jpeg',
  atmosphere2: 'https://customer-assets.emergentagent.com/job_paddel-sport/artifacts/f3ymcx12_photo_2026-02-10%2015.43.21.jpeg'
};

// Navigation
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
      isScrolled ? 'nav-scrolled py-3' : 'bg-transparent py-5'}`
      }
      data-testid="navigation">

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3" data-testid="logo">
          <div className="w-10 h-10 bg-[#FF007F] flex items-center justify-center">
            <span className="text-white font-heading font-black text-xl">P</span>
          </div>
          <span className="font-heading font-bold text-lg uppercase tracking-wider text-white">
            Padel Moscow
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {[
          { id: 'why', label: 'Почему падл' },
          { id: 'formats', label: 'Форматы' },
          { id: 'prices', label: 'Цены' },
          { id: 'contacts', label: 'Контакты' }].
          map((item) =>
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="text-white/70 hover:text-white font-medium text-sm uppercase tracking-wider transition-colors duration-300"
            data-testid={`nav-${item.id}`}>

              {item.label}
            </button>
          )}
          <button onClick={onBookClick} className="btn-primary" data-testid="nav-book-btn">
            Записаться
          </button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="mobile-menu-btn">

          {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {isMobileMenuOpen &&
      <div className="md:hidden glass-dark absolute top-full left-0 right-0 p-4 border-t border-white/10">
          {[
        { id: 'why', label: 'Почему падл' },
        { id: 'formats', label: 'Форматы' },
        { id: 'prices', label: 'Цены' },
        { id: 'contacts', label: 'Контакты' }].
        map((item) =>
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="block w-full text-left py-3 text-white font-heading uppercase tracking-wide">

              {item.label}
            </button>
        )}
          <button onClick={() => {onBookClick();setIsMobileMenuOpen(false);}} className="btn-primary w-full mt-4">
            Записаться
          </button>
        </div>
      }
    </nav>);

};

// Hero Section - Dark theme
const HeroSection = ({ onBookClick }) =>
<section className="hero-section" data-testid="hero-section">
    <div className="hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} />
    <div className="hero-overlay" />
    
    <div className="relative z-10 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full py-32">
        <div className="max-w-3xl">
          {/* Надзаголовок */}
          <p className="text-white/50 font-heading font-medium text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-fade-in-up">
            Падл центр в Москве
          </p>
          
          {/* Главный заголовок */}
          <h1 className="font-heading font-black md:text-7xl lg:text-8xl uppercase animate-fade-in-up delay-100 text-5xl leading-[0.9] mb-8 text-white">Самый women падл в России
          <br />
          <br />
          <span className="text-[#FF007F]">для the best</span>
        </h1>
          
          {/* Инфо-плашки */}
          <div className="flex flex-wrap gap-3 mb-8 animate-fade-in-up delay-200">
            <div className="info-badge">
              <Target className="w-4 h-4 text-[#FF007F]" />
              <span>Подходит для новичков</span>
            </div>
            <div className="info-badge">
              <Users className="w-4 h-4 text-[#FF007F]" />
              <span>Игра 2×2</span>
            </div>
            <div className="info-badge">
              <Clock className="w-4 h-4 text-[#FF007F]" />
              <span>60–90 минут</span>
            </div>
          </div>
          
          {/* Подзаголовок */}
          <p className="text-white/60 font-body text-lg md:text-xl mb-10 max-w-lg animate-fade-in-up delay-300">Играй в падл без опыта и партнёра.
          <br />Мы подберём уровень, формат и компанию.

        </p>
          
          {/* CTA */}
          <div className="animate-fade-in-up delay-400">
            <button onClick={onBookClick} className="btn-primary" data-testid="hero-book-btn">
              Записаться на игру
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>;


// Why Padel Section - Pink cards
const WhyPadelSection = ({ onTryClick }) => {
  const reasons = [
  {
    title: 'Если ты хочешь активно проводить время',
    subtitle: 'без изнурительных тренировок'
  },
  {
    title: 'Если тебе важно общение, драйв и азарт,',
    subtitle: 'а не просто спортзал'
  },
  {
    title: 'Если ты хочешь попробовать новый трендовый спорт,',
    subtitle: 'в который легко втянуться'
  }];


  return (
    <section id="why" className="section-dark py-24 md:py-32" data-testid="why-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold text-sm uppercase tracking-[0.3em] mb-4">
            Зачем тебе падл
          </p>
          <h2 className="font-heading font-black text-4xl md:text-6xl uppercase text-white">
            Почему тебе стоит<br />попробовать падл
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reasons.map((reason, index) =>
          <div
            key={index}
            className="pink-card"
            data-testid={`why-card-${index}`}>

              <p className="font-heading font-bold text-xl md:text-2xl uppercase leading-tight mb-2">
                {reason.title}
              </p>
              <p className="text-white/80 font-body text-lg">
                {reason.subtitle}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button onClick={onTryClick} className="btn-primary" data-testid="why-try-btn">
            Хочу попробовать
          </button>
        </div>
      </div>
    </section>);

};

// For Who Section - Dark bg, light cards
const ForWhoSection = ({ onBookClick }) => {
  const personas = [
  {
    title: 'Новички',
    desc: 'Никогда не играли — объясним правила и подберём комфортную игру'
  },
  {
    title: 'Активные игроки',
    desc: 'Регулярные игры, рост уровня и новые соперники'
  },
  {
    title: 'Друзья и компании',
    desc: 'Идеальный формат для вечера или выходных'
  },
  {
    title: 'Корпоративы',
    desc: 'Командный спорт + эмоции + нетворкинг'
  }];


  return (
    <section className="section-darker py-24 md:py-32" data-testid="for-who-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold text-sm uppercase tracking-[0.3em] mb-4">
            Целевая аудитория
          </p>
          <h2 className="font-heading font-black text-4xl md:text-6xl uppercase text-white">
            Для кого падл
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona, index) =>
          <div
            key={index}
            className="light-card cursor-pointer group"
            onClick={onBookClick}
            data-testid={`persona-card-${index}`}>

              <h3 className="font-heading font-bold text-2xl uppercase mb-4 text-[#0A0A0A]">
                {persona.title}
              </h3>
              <p className="text-gray-600 font-body mb-6">
                {persona.desc}
              </p>
              <div className="flex items-center gap-2 text-[#FF007F] font-heading uppercase text-sm group-hover:gap-4 transition-all duration-300">
                <span>Записаться</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

// Process Section
const ProcessSection = () => {
  const steps = [
  { num: '01', title: 'Выбираешь формат игры' },
  { num: '02', title: 'Мы подбираем уровень и участников' },
  { num: '03', title: 'Приходишь — ракетки и мячи уже ждут' },
  { num: '04', title: 'Играешь, отдыхаешь, знакомишься' }];


  return (
    <section className="section-dark py-24 md:py-32" data-testid="process-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold text-sm uppercase tracking-[0.3em] mb-4">
            Процесс
          </p>
          <h2 className="font-heading font-black text-4xl md:text-6xl uppercase text-white">
            Как проходит игра
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) =>
          <div
            key={index}
            className="dark-card"
            data-testid={`process-step-${index}`}>

              <div className="step-number mb-6">{step.num}</div>
              <p className="font-heading font-bold text-xl uppercase text-white">
                {step.title}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>);

};

// Formats Section
const FormatsSection = ({ onFormatSelect }) => {
  const formats = [
  { id: 'open_game', title: 'Открытые игры', desc: 'Можно прийти одному — мы найдём партнёров' },
  { id: 'training', title: 'Тренировки с тренером', desc: 'Персональные занятия для роста уровня' },
  { id: 'subscription', title: 'Абонементы', desc: 'Регулярные игры со скидкой до 30%' },
  { id: 'tournament', title: 'Турниры', desc: 'Соревнуйся и выигрывай призы' },
  { id: 'corporate', title: 'Корпоративные игры', desc: 'Тимбилдинг для вашей команды' }];


  return (
    <section id="formats" className="section-darker py-24 md:py-32" data-testid="formats-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold text-sm uppercase tracking-[0.3em] mb-4">
            Выбери свой
          </p>
          <h2 className="font-heading font-black text-4xl md:text-6xl uppercase text-white">
            Форматы игр
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formats.map((format) =>
          <div
            key={format.id}
            className="format-card group"
            data-testid={`format-card-${format.id}`}>

              <h3 className="font-heading font-bold text-xl uppercase text-white mb-3 group-hover:text-[#FF007F] transition-colors duration-300">
                {format.title}
              </h3>
              <p className="text-white/60 font-body mb-6">
                {format.desc}
              </p>
              <button
              onClick={() => onFormatSelect(format.id)}
              className="flex items-center gap-2 text-[#FF007F] font-heading uppercase text-sm hover:gap-4 transition-all duration-300"
              data-testid={`format-book-${format.id}`}>

                Записаться <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>);

};

// Pricing Section
const PricingSection = ({ onBookClick }) => {
  const plans = [
  {
    title: 'Разовая игра',
    price: '4 000',
    unit: '₽',
    desc: '1.5 часа на корте',
    featured: false
  },
  {
    title: 'Тренировка',
    price: '6 000',
    unit: '₽',
    desc: 'С персональным тренером',
    featured: true
  },
  {
    title: 'Абонемент',
    price: '−30',
    unit: '%',
    desc: 'Скидка на 4+ игры',
    featured: false
  }];


  return (
    <section id="prices" className="section-dark py-24 md:py-32" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF007F] font-heading font-bold text-sm uppercase tracking-[0.3em] mb-4">
            Тарифы
          </p>
          <h2 className="font-heading font-black text-4xl md:text-6xl uppercase text-white">
            Стоимость
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) =>
          <div
            key={index}
            className={`pricing-card ${plan.featured ? 'featured' : ''}`}
            data-testid={`pricing-plan-${index}`}>

              <p className={`font-heading font-bold text-sm uppercase tracking-wider mb-4 ${
            plan.featured ? 'text-white/80' : 'text-white/50'}`
            }>
                {plan.title}
              </p>
              <div className="mb-4">
                <span className={`font-heading font-black text-6xl md:text-7xl ${
              plan.featured ? 'text-white' : 'text-[#FF007F]'}`
              }>
                  {plan.price}
                </span>
                <span className={`font-heading font-bold text-2xl ${
              plan.featured ? 'text-white/80' : 'text-white/60'}`
              }>
                  {plan.unit}
                </span>
              </div>
              <p className={`font-body ${plan.featured ? 'text-white/80' : 'text-white/50'}`}>
                {plan.desc}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button onClick={onBookClick} className="btn-primary" data-testid="pricing-schedule-btn">
            Посмотреть расписание
          </button>
        </div>
      </div>
    </section>);

};

// Atmosphere Section
const AtmosphereSection = () =>
<section className="section-darker py-24 md:py-32" data-testid="atmosphere-section">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[#FF007F] font-heading font-bold text-sm uppercase tracking-[0.3em] mb-4">
            Атмосфера
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white mb-6 leading-tight">
            Падл — это не<br />просто спорт
          </h2>
          <p className="text-white/60 font-body text-xl leading-relaxed mb-8">
            Это эмоции, новые знакомства<br />
            и лучший способ перезагрузиться после работы.
          </p>
          <div className="flex items-center gap-6">
            <a
            href="https://wa.me/79957910422"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-[#FF007F] transition-colors duration-300"
            data-testid="whatsapp-link">

              <MessageCircle className="w-5 h-5" />
              <span className="font-heading uppercase text-sm">WhatsApp</span>
            </a>
            <a
            href="https://t.me/pasha2375"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-[#FF007F] transition-colors duration-300"
            data-testid="telegram-link">

              <Send className="w-5 h-5" />
              <span className="font-heading uppercase text-sm">Telegram</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
          src={IMAGES.atmosphere1}
          alt="Padel atmosphere"
          className="w-full h-64 object-cover" />

          <img
          src={IMAGES.atmosphere2}
          alt="Padel fun"
          className="w-full h-64 object-cover mt-8" />

        </div>
      </div>
    </div>
  </section>;


// Stats Section
const StatsSection = () => {
  const [stats, setStats] = useState({ players: 0, games_per_month: 0, rating: 0 });

  useEffect(() => {
    axios.get(`${API}/stats`).then((res) => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <section className="section-dark py-20" data-testid="stats-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div data-testid="stat-rating">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-8 h-8 text-[#FF007F] fill-[#FF007F]" />
              <span className="stat-number">{stats.rating}</span>
            </div>
            <p className="text-white/50 font-body uppercase text-sm tracking-wider">Средняя оценка</p>
          </div>
          <div data-testid="stat-players">
            <span className="stat-number">{stats.players}+</span>
            <p className="text-white/50 font-body uppercase text-sm tracking-wider">Игроков</p>
          </div>
          <div data-testid="stat-games">
            <span className="stat-number">{stats.games_per_month}+</span>
            <p className="text-white/50 font-body uppercase text-sm tracking-wider">Игр в месяц</p>
          </div>
        </div>
      </div>
    </section>);

};

// CTA Section
const CTASection = ({ onBookClick }) =>
<section className="section-pink py-24 md:py-32" data-testid="cta-section">
    <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
      <h2 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl uppercase text-white mb-6 leading-tight">
        Попробуй падл уже<br />на этой неделе
      </h2>
      <p className="text-white/80 font-body text-xl mb-10 max-w-xl mx-auto">
        Мы подберём формат и уровень под тебя
      </p>
      <button
      onClick={onBookClick}
      className="bg-white text-[#FF007F] px-12 py-5 font-heading font-bold text-xl uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-colors duration-300"
      data-testid="cta-book-btn">

        Записаться на игру
      </button>
    </div>
  </section>;


// Footer
const Footer = ({ onAskClick }) =>
<footer id="contacts" className="section-darker py-16 md:py-20 border-t border-white/10" data-testid="footer">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FF007F] flex items-center justify-center">
              <span className="text-white font-heading font-black text-xl">P</span>
            </div>
            <span className="font-heading font-bold text-lg uppercase tracking-wider text-white">
              Padel Moscow
            </span>
          </div>
          <p className="text-white/50 font-body mb-6 max-w-sm">
            Падл центр в Москве. Самый доступный и азартный спорт для взрослых.
          </p>
          <div className="flex items-center gap-4">
            <a
            href="https://wa.me/79957910422"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[#FF007F] transition-colors duration-300"
            data-testid="footer-whatsapp">

              <MessageCircle className="w-5 h-5 text-white" />
            </a>
            <a
            href="https://t.me/pasha2375"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[#FF007F] transition-colors duration-300"
            data-testid="footer-telegram">

              <Send className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white mb-6">
            Контакты
          </h4>
          <ul className="space-y-4">
            <li>
              <a href="tel:+79991234567" className="footer-link flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>+7 (999) 123-45-67</span>
              </a>
            </li>
            <li>
              <div className="footer-link flex items-start gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <span>Москва, м. Тульская</span>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white mb-6">
            Режим работы
          </h4>
          <ul className="space-y-2 text-white/50 font-body text-sm">
            <li>Пн-Пт: 09:00 – 22:00</li>
            <li>Сб-Вс: 10:00 – 21:00</li>
          </ul>
          <button
          onClick={onAskClick}
          className="mt-6 text-[#FF007F] font-heading uppercase text-sm hover:underline"
          data-testid="footer-ask-btn">

            Задать вопрос →
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 text-center">
        <p className="text-white/30 font-body text-sm">
          © 2025 Padel Moscow. Все права защищены.
        </p>
      </div>
    </div>
  </footer>;


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
      <HeroSection onBookClick={handleBookClick} />
      <WhyPadelSection onTryClick={handleTryClick} />
      <ForWhoSection onBookClick={handleBookClick} />
      <ProcessSection />
      <FormatsSection onFormatSelect={handleFormatSelect} />
      <PricingSection onBookClick={handleBookClick} />
      <AtmosphereSection />
      <StatsSection />
      <CTASection onBookClick={handleBookClick} />
      <Footer onAskClick={handleBookClick} />
      
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialFormat={selectedFormat} />

      
      <Toaster position="top-center" richColors />
    </div>);

};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>);

}

export default App;