import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster, toast } from 'sonner';
import { 
  Heart, 
  MessageCircle, 
  Target, 
  Sparkles, 
  Flame, 
  Lightbulb,
  Menu,
  X,
  CheckCircle2,
  Mail,
  LogOut,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import { AuthModal } from '@/components/AuthModal';
import { LiveChat } from '@/components/LiveChat';

gsap.registerPlugin(ScrollTrigger);

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <a href="#" className="font-heading font-bold text-xl lg:text-2xl text-ink">
              Bond
            </a>
            
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-ink-light hover:text-ink transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-periwinkle transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-ink-light">
                    Hi, {user?.name || user?.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
                    className="text-ink-light hover:text-ink"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => { setAuthTab('login'); setAuthModalOpen(true); }}
                    className="text-ink-light hover:text-ink"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => { setAuthTab('register'); setAuthModalOpen(true); }}
                    className="bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-6"
                  >
                    Start free
                  </Button>
                </>
              )}
            </div>

            <button
              className="lg:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-white transition-transform duration-300 lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-2xl font-heading font-semibold text-ink"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          
          {isAuthenticated ? (
            <Button 
              onClick={() => { handleLogout(); setIsOpen(false); }}
              variant="outline"
              className="rounded-full px-8"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => { setAuthTab('login'); setAuthModalOpen(true); setIsOpen(false); }}
                variant="outline"
                className="rounded-full px-8"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => { setAuthTab('register'); setAuthModalOpen(true); setIsOpen(false); }}
                className="bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-8"
              >
                Start free
              </Button>
            </>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab={authTab}
      />
    </>
  );
}

// Hero Section
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const content = contentRef.current;
    if (!section || !card || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.3 }
      );

      gsap.fromTo(content.children,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out', delay: 0.5 }
      );

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set(card, { x: 0, opacity: 1 });
            gsap.set(content.children, { y: 0, opacity: 1 });
          }
        }
      });

      scrollTl.fromTo(card,
        { x: 0, opacity: 1 },
        { x: '-22vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(content.children,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0.2, stagger: 0.02, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden">
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/cloud-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 pt-20">
        <div 
          ref={cardRef}
          className="w-full max-w-[1100px] bg-white/90 backdrop-blur-sm rounded-4xl shadow-card overflow-hidden"
          style={{ height: 'min(72vh, 640px)' }}
        >
          <div className="flex flex-col h-full">
            <div ref={contentRef} className="p-6 lg:p-10 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="max-w-xl">
                  <h1 className="font-heading font-bold text-3xl lg:text-5xl text-ink leading-tight mb-3">
                    Meet your AI couples therapist.
                  </h1>
                  <p className="text-ink-light text-base lg:text-lg">
                    Private, judgment-free guidance to help you both feel heard—and move forward together.
                  </p>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-2">
                  <Button 
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-6"
                  >
                    Start free
                  </Button>
                  <a href="#how-it-works" className="text-sm text-periwinkle hover:underline">
                    See how it works
                  </a>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 lg:p-10 overflow-hidden">
              <LiveChat onAuthRequired={() => setAuthModalOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab="register"
      />
    </section>
  );
}

// Feature Section Component
function FeatureSection({ 
  id,
  eyebrow, 
  headline, 
  body, 
  cta, 
  onCtaClick,
  chatMessages,
  badge,
  textPosition = 'left'
}: { 
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  onCtaClick?: () => void;
  chatMessages: { message: string; isUser: boolean; isChip?: boolean }[];
  badge?: { type: 'lightbulb' | 'reframe' | 'flame'; text?: string };
  textPosition?: 'left' | 'right';
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const text = textRef.current;
    const badgeEl = badgeRef.current;
    if (!section || !card || !text) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      scrollTl.fromTo(card,
        { x: '55vw', scale: 0.96, rotateZ: 1 },
        { x: 0, scale: 1, rotateZ: 0, ease: 'none' },
        0
      );

      scrollTl.fromTo(text,
        { x: textPosition === 'left' ? '-18vw' : '18vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      if (badgeEl) {
        scrollTl.fromTo(badgeEl,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.6)' },
          0.1
        );
      }

      scrollTl.fromTo(card,
        { x: 0, opacity: 1 },
        { x: textPosition === 'left' ? '-24vw' : '22vw', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(text,
        { x: 0, opacity: 1 },
        { x: textPosition === 'left' ? '-10vw' : '10vw', opacity: 0.2, ease: 'power2.in' },
        0.7
      );

      if (badgeEl) {
        scrollTl.fromTo(badgeEl,
          { y: 0, opacity: 1 },
          { y: '-8vh', opacity: 0, ease: 'power2.in' },
          0.75
        );
      }
    }, section);

    return () => ctx.revert();
  }, [textPosition]);

  const BadgeIcon = badge?.type === 'lightbulb' ? Lightbulb : badge?.type === 'flame' ? Flame : Sparkles;

  return (
    <section ref={sectionRef} id={id} className="relative w-full h-screen overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/cloud-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 lg:px-12">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div 
            ref={textRef}
            className={`w-full lg:w-1/3 ${textPosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <p className="text-sm font-semibold text-periwinkle uppercase tracking-wider mb-3">
              {eyebrow}
            </p>
            <h2 className="font-heading font-bold text-2xl lg:text-4xl text-ink leading-tight mb-4">
              {headline}
            </h2>
            <p className="text-ink-light text-base lg:text-lg mb-6">
              {body}
            </p>
            <Button 
              variant={cta.includes('example') ? 'outline' : 'default'}
              onClick={onCtaClick}
              className={cta.includes('example') 
                ? 'border-periwinkle text-periwinkle hover:bg-periwinkle/10 rounded-full px-6' 
                : 'bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-6'
              }
            >
              {cta}
            </Button>
          </div>

          <div 
            ref={cardRef}
            className={`w-full lg:w-2/3 ${textPosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <div className="bg-white rounded-4xl shadow-card p-6 lg:p-8 relative">
              {badge && (
                <div 
                  ref={badgeRef}
                  className={`absolute -top-4 ${textPosition === 'left' ? 'right-8' : 'left-8'} 
                    bg-cloud-dark rounded-full p-3 shadow-lg animate-float`}
                >
                  <BadgeIcon className="w-5 h-5 text-periwinkle" />
                  {badge.text && (
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-ink-light whitespace-nowrap">
                      {badge.text}
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={msg.isUser ? 'flex justify-end' : ''}>
                    {msg.isChip ? (
                      <div className="flex gap-2">
                        <span className="px-4 py-2 bg-periwinkle/10 text-periwinkle rounded-full text-sm font-medium cursor-pointer hover:bg-periwinkle/20 transition-colors">
                          {msg.message}
                        </span>
                      </div>
                    ) : (
                      <div className={`max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed ${
                        msg.isUser 
                          ? 'chat-bubble-user bg-periwinkle/10 text-ink' 
                          : 'chat-bubble-ai bg-cloud text-ink'
                      }`}>
                        {msg.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;
    const cta = ctaRef.current;
    if (!section || !heading || !cards || !cta) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(heading,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(cards.children,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15,
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(cta,
        { y: 50, scale: 0.98, opacity: 0 },
        {
          y: 0, scale: 1, opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: cta,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      icon: <Heart className="w-6 h-6 text-periwinkle" />,
      title: 'Sign up together',
      description: 'Create a shared space in under a minute.',
    },
    {
      icon: <Target className="w-6 h-6 text-periwinkle" />,
      title: 'Pick a focus',
      description: 'Choose a topic or let Bond suggest one based on your check-in.',
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-periwinkle" />,
      title: 'Chat, practice, repeat',
      description: 'Use the AI session, try the exercise, and track progress weekly.',
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      id="how-it-works" 
      className="relative w-full py-20 lg:py-32 bg-background-secondary"
    >
      <div className="w-full px-6 lg:px-12">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-ink mb-4">
            How it works
          </h2>
          <p className="text-ink-light text-lg max-w-xl mx-auto">
            A simple rhythm designed for busy lives.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-16">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="w-14 h-14 bg-cloud-dark rounded-full flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="font-heading font-semibold text-xl text-ink mb-3">
                {step.title}
              </h3>
              <p className="text-ink-light">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div 
          ref={ctaRef}
          className="max-w-4xl mx-auto bg-white rounded-4xl shadow-card overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/5">
              <img 
                src="/cta-couple.jpg" 
                alt="Happy couple" 
                className="w-full h-64 lg:h-full object-cover"
              />
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="font-heading font-bold text-2xl lg:text-3xl text-ink mb-3">
                Start today
              </h3>
              <p className="text-ink-light mb-6">
                Your first week is free. No credit card required.
              </p>
              <Button 
                onClick={() => setAuthModalOpen(true)}
                className="bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-8 w-fit"
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab="register"
      />
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;
    if (!section || !heading || !cards) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(heading,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(cards.children,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15,
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    {
      image: '/testimonial-1.jpg',
      quote: 'We stopped assuming, started asking.',
      text: 'Bond gave us the words when we had none.',
      names: 'Maya & Jon',
    },
    {
      image: '/testimonial-2.jpg',
      quote: 'It feels like a safe third space.',
      text: 'Not judgmental—just practical and kind.',
      names: 'Priya & Sam',
    },
    {
      image: '/testimonial-3.jpg',
      quote: 'Small changes, big difference.',
      text: 'The weekly check-in keeps us connected.',
      names: 'Leah & Diego',
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      id="testimonials" 
      className="relative w-full py-20 lg:py-32 bg-background"
    >
      <div className="w-full px-6 lg:px-12">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-ink mb-4">
            Real couples, real progress
          </h2>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.names}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 lg:p-8">
                <p className="font-heading font-semibold text-lg text-ink mb-2">
                  "{testimonial.quote}"
                </p>
                <p className="text-ink-light mb-4">
                  {testimonial.text}
                </p>
                <p className="text-sm font-medium text-periwinkle">
                  {testimonial.names}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA + Footer Section
function CTAFooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const cta = ctaRef.current;
    const footer = footerRef.current;
    if (!section || !cta || !footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cta,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: cta,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(footer,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.6,
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call for email signup
    setTimeout(() => {
      toast.success('Thanks for signing up! Check your email for next steps.');
      setEmail('');
      setIsSubmitting(false);
      setAuthModalOpen(true);
    }, 1000);
  };

  return (
    <section 
      ref={sectionRef} 
      id="faq" 
      className="relative w-full py-20 lg:py-32 bg-background-secondary"
    >
      <div className="w-full px-6 lg:px-12">
        <div ref={ctaRef} className="max-w-2xl mx-auto text-center mb-20">
          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-ink mb-4">
            Start your first session today
          </h2>
          <p className="text-ink-light text-lg mb-8">
            Join thousands of couples building healthier habits—one message at a time.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-light" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 focus:border-periwinkle transition-all"
              />
            </div>
            <Button 
              type="submit"
              className="bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-8 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Get started'
              )}
            </Button>
          </form>
          
          <p className="text-sm text-ink-light flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-periwinkle" />
            Free for 7 days • Cancel anytime
          </p>
        </div>

        <footer ref={footerRef} className="border-t border-gray-200 pt-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-2xl text-ink">Bond</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
              {['Privacy', 'Terms', 'Support', 'Contact'].map((link) => (
                <a 
                  key={link}
                  href="#" 
                  className="text-sm text-ink-light hover:text-ink transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
            
            <p className="text-sm text-ink-light">
              © 2026 Bond Health, Inc.
            </p>
          </div>
        </footer>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab="register"
      />
    </section>
  );
}

// Main App Content
function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { loadTopics } = useChat();

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  useEffect(() => {
    const setupSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;
            
            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        }
      });
    };

    const timer = setTimeout(setupSnap, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Toaster position="top-center" richColors />
      
      <main className="relative">
        <HeroSection />
        
        <div id="features">
          <FeatureSection
            id="guided-sessions"
            eyebrow="Guided sessions"
            headline="Therapist-designed paths for real change."
            body="Choose topics like communication, trust, intimacy, or conflict. Each session gives you both clear steps—and language you can actually use."
            cta="Explore topics"
            onCtaClick={() => setAuthModalOpen(true)}
            chatMessages={[
              { message: "Today's focus: turning complaints into requests.", isUser: false },
              { message: "Start exercise", isUser: true, isChip: true },
              { message: "Read example", isUser: true, isChip: true },
            ]}
            badge={{ type: 'lightbulb' }}
            textPosition="left"
          />
          
          <FeatureSection
            id="conflict-to-calm"
            eyebrow="Conflict to calm"
            headline="Pause the spiral. Reframe the moment."
            body="When tension rises, Bond helps you name the pattern, take a breath, and rephrase—so small moments don't become big walls."
            cta="See a reframing example"
            onCtaClick={() => setAuthModalOpen(true)}
            chatMessages={[
              { message: "You never listen when I'm upset.", isUser: true },
              { message: "Try: 'I feel unheard when I'm upset—can I share what I need?'", isUser: false },
            ]}
            badge={{ type: 'reframe', text: 'Reframe' }}
            textPosition="right"
          />
          
          <FeatureSection
            id="shared-goals"
            eyebrow="Shared goals"
            headline="Build habits that last."
            body="Set weekly intentions, track check-ins, and celebrate progress—together. Small wins create real momentum."
            cta="View sample plan"
            onCtaClick={() => setAuthModalOpen(true)}
            chatMessages={[
              { message: "This week's intention: one 10-minute appreciation chat.", isUser: false },
              { message: "We did it last night!", isUser: true },
              { message: "Love that—want to set next week's focus?", isUser: false },
            ]}
            badge={{ type: 'flame', text: '3 week streak' }}
            textPosition="left"
          />
        </div>
        
        <HowItWorksSection />
        <TestimonialsSection />
        <CTAFooterSection />
      </main>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab="register"
      />
    </div>
  );
}

// Main App
function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
