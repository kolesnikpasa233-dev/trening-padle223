import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Check, CalendarDays, Clock, User, Phone, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FORMAT_OPTIONS = [
  { value: 'open_game', label: 'Открытая игра', price: '4 000 ₽' },
  { value: 'training', label: 'Тренировка с тренером', price: '6 000 ₽' },
  { value: 'subscription', label: 'Абонемент (4 игры)', price: '11 200 ₽' },
  { value: 'corporate', label: 'Корпоратив / ДР', price: 'от 15 000 ₽' },
];

export const BookingModal = ({ isOpen, onClose, initialFormat = null }) => {
  const [step, setStep] = useState(1);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(initialFormat || '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSchedule();
      if (initialFormat) {
        setSelectedFormat(initialFormat);
      }
    }
  }, [isOpen, initialFormat]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedFormat(initialFormat || '');
      setName('');
      setPhone('');
    }
  }, [isOpen, initialFormat]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/schedule`);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Не удалось загрузить расписание');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDates = () => {
    return schedule.map(day => parseISO(day.date));
  };

  const getTimeSlotsForDate = (date) => {
    if (!date) return [];
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySchedule = schedule.find(d => d.date === dateStr);
    return daySchedule ? daySchedule.slots : [];
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !phone || !selectedDate || !selectedTime || !selectedFormat) {
      toast.error('Заполните все поля');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/bookings`, {
        name,
        phone,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        format_type: selectedFormat,
      });
      
      toast.success('Вы успешно записались! Ждём вас на игру!');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.detail || 'Ошибка при записи');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedFormatInfo = FORMAT_OPTIONS.find(f => f.value === selectedFormat);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden" data-testid="booking-modal">
        <div className="bg-[#FF007F] p-6">
          <DialogHeader>
            <DialogTitle className="text-white font-heading text-2xl uppercase tracking-wide">
              Записаться на игру
            </DialogTitle>
          </DialogHeader>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                    step >= s ? 'bg-white text-[#FF007F]' : 'bg-white/30 text-white'
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 mx-1 transition-colors duration-300 ${
                    step > s ? 'bg-white' : 'bg-white/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF007F]" />
            </div>
          ) : (
            <>
              {/* Step 1: Select Date */}
              {step === 1 && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-5 h-5 text-[#FF007F]" />
                    <span className="font-heading text-lg uppercase">Выберите дату</span>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={ru}
                    disabled={(date) => {
                      const availableDates = getAvailableDates();
                      return !availableDates.some(d => 
                        d.toDateString() === date.toDateString()
                      );
                    }}
                    className="rounded-md border mx-auto"
                    data-testid="booking-calendar"
                  />
                </div>
              )}

              {/* Step 2: Select Time */}
              {step === 2 && selectedDate && (
                <div className="animate-fade-in-up">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-sm text-[#71717A] hover:text-[#FF007F] mb-4 flex items-center gap-1"
                  >
                    ← Изменить дату
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="w-5 h-5 text-[#FF007F]" />
                    <span className="font-semibold">
                      {format(selectedDate, 'd MMMM, EEEE', { locale: ru })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-[#FF007F]" />
                    <span className="font-heading text-lg uppercase">Выберите время</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {getTimeSlotsForDate(selectedDate).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        data-testid={`time-slot-${slot.time}`}
                        className={`py-3 px-2 text-center rounded-md font-semibold transition-colors duration-200 ${
                          slot.available
                            ? 'bg-[#F4F4F5] hover:bg-[#FFE5F0] hover:text-[#FF007F] cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                        } ${selectedTime === slot.time ? 'bg-[#FF007F] text-white hover:bg-[#D6006A] hover:text-white' : ''}`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Contact Form */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-4">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-sm text-[#71717A] hover:text-[#FF007F] mb-2 flex items-center gap-1"
                  >
                    ← Изменить время
                  </button>
                  
                  <div className="bg-[#FFE5F0] p-4 rounded-md space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="w-4 h-4 text-[#FF007F]" />
                      <span>{format(selectedDate, 'd MMMM, EEEE', { locale: ru })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-[#FF007F]" />
                      <span>{selectedTime}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format" className="font-heading uppercase text-sm">Формат игры</Label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger data-testid="format-select">
                        <SelectValue placeholder="Выберите формат" />
                      </SelectTrigger>
                      <SelectContent>
                        {FORMAT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} — {option.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-heading uppercase text-sm">
                      <User className="w-4 h-4 inline mr-1" />
                      Ваше имя
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Александр"
                      required
                      data-testid="booking-name-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-heading uppercase text-sm">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Телефон
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      required
                      data-testid="booking-phone-input"
                    />
                  </div>

                  {selectedFormatInfo && (
                    <div className="bg-[#F4F4F5] p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{selectedFormatInfo.label}</span>
                        <span className="text-[#FF007F] font-bold text-lg">{selectedFormatInfo.price}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-[#FF007F] hover:bg-[#D6006A] text-white font-heading uppercase tracking-wide py-6"
                    data-testid="booking-submit-btn"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Записаться'
                    )}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
