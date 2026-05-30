import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Menu, X, ChevronDown, Star, Users, Award, Zap, Play } from 'lucide-react';

/* ───────────────────────────────────────────────
   SHINY TEXT COMPONENT
   ─────────────────────────────────────────────── */
const ShinyText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      style={{
        background: 'linear-gradient(100deg, #64CEFB 0%, #64CEFB 40%, #ffffff 50%, #64CEFB 60%, #64CEFB 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
      animate={{
        backgroundPosition: ['200% 0%', '-200% 0%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {text}
    </motion.span>
  );
};

/* ───────────────────────────────────────────────
   NAVIGATION COMPONENT
   ─────────────────────────────────────────────── */
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Courses', href: '#courses' },
    { name: 'Instructors', href: '#instructors' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact us', href: '#contact', hasArrow: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">DesignPro</span>
          </motion.div>

          <motion.div 
            className="hidden lg:flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-1 px-2 py-2 rounded-full border border-gray-700 bg-black/40 backdrop-blur-sm">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors duration-300 rounded-full hover:bg-white/10 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                  {link.hasArrow && <ArrowRight className="w-3 h-3" />}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.button
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      <motion.div
        className={`lg:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-b border-white/10`}
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
              {link.hasArrow && <ArrowRight className="w-4 h-4" />}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};

/* ───────────────────────────────────────────────
   HERO SECTION
   ─────────────────────────────────────────────── */
const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.9]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.6 }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
        style={{ opacity, scale }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 lg:mb-12">
          <motion.p
            className="text-white/80 text-sm sm:text-base max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ y: y1 }}
          >
            We deliver transformative programs that empower emerging product designers with cutting-edge expertise and vision to thrive globally.
          </motion.p>

          <motion.p
            className="text-white/80 text-sm sm:text-base lg:text-right font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ y: y2 }}
          >
            <span className="text-white font-bold text-lg sm:text-xl">8000+</span> Talented Designers Launched !
          </motion.p>
        </div>

        <div className="flex flex-col items-center text-center mt-4 lg:mt-8">
          <motion.p
            className="text-white/80 text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Seats for Next Program Opening Soon
          </motion.p>

          <motion.div
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium leading-[0.85] tracking-tighter">
              <span className="block text-white">Become</span>
              <span className="block">
                <ShinyText text="Product Leader." />
              </span>
            </h1>
          </motion.div>

          <motion.button
            className="group relative inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white rounded-full px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium transition-all duration-300 border border-white/20 hover:border-white/40 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Apply for Next Enrollment</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
          </motion.button>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ───────────────────────────────────────────────
   ABOUT SECTION
   ─────────────────────────────────────────────── */
const About: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const stats = [
    { icon: Users, value: '8000+', label: 'Designers Launched' },
    { icon: Award, value: '95%', label: 'Placement Rate' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
    { icon: Zap, value: '50+', label: 'Industry Partners' },
  ];

  return (
    <section id="about" className="relative bg-black py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#64CEFB] text-sm font-semibold tracking-wider uppercase mb-4 block">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
              Shaping the Future of
              <span className="text-[#64CEFB]"> Product Design</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8">
              DesignPro is more than an education platform — it's a launchpad for creative minds. 
              We combine industry expertise with hands-on learning to transform aspiring designers 
              into product leaders who shape the digital world.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#64CEFB]/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <stat.icon className="w-6 h-6 text-[#64CEFB] mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#64CEFB]/30"
                style={{ rotate }}
              />

              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#64CEFB]/20 to-transparent border border-[#64CEFB]/20 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Play className="w-16 h-16 text-[#64CEFB]" fill="#64CEFB" />
                </motion.div>
              </div>

              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                  style={{
                    top: `${20 + Math.sin(i * 1.5) * 30}%`,
                    left: `${20 + Math.cos(i * 1.5) * 30}%`,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.3,
                  }}
                >
                  <Star className="w-5 h-5 text-[#64CEFB]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────────────────────────
   COURSES SECTION
   ─────────────────────────────────────────────── */
const Courses: React.FC = () => {
  const courses = [
    {
      title: 'Product Design Fundamentals',
      duration: '12 Weeks',
      level: 'Beginner',
      description: 'Master the core principles of product design from research to prototyping.',
      color: '#64CEFB',
    },
    {
      title: 'Advanced UX Strategy',
      duration: '8 Weeks',
      level: 'Intermediate',
      description: 'Learn strategic thinking and user-centered design methodologies.',
      color: '#A78BFA',
    },
    {
      title: 'Design Leadership',
      duration: '6 Weeks',
      level: 'Advanced',
      description: 'Lead design teams and drive product vision at scale.',
      color: '#34D399',
    },
  ];

  return (
    <section id="courses" className="relative bg-black py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#64CEFB] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Our Courses
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Programs Designed for
            <span className="text-[#64CEFB]"> Impact</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              className="group relative p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${course.color}, transparent 70%)` }}
              />

              <div className="relative z-10">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${course.color}20` }}
                >
                  <Zap className="w-6 h-6" style={{ color: course.color }} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-white/60 text-sm mb-4">{course.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">{course.duration}</span>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${course.color}20`, color: course.color }}
                  >
                    {course.level}
                  </span>
                </div>

                <motion.button
                  className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────────────────────────
   INSTRUCTORS SECTION
   ─────────────────────────────────────────────── */
const Instructors: React.FC = () => {
  const instructors = [
    { name: 'Sarah Chen', role: 'Lead Designer @ Google', initials: 'SC' },
    { name: 'Marcus Johnson', role: 'Product Director @ Meta', initials: 'MJ' },
    { name: 'Aisha Patel', role: 'Design VP @ Spotify', initials: 'AP' },
    { name: 'David Kim', role: 'Principal Designer @ Apple', initials: 'DK' },
  ];

  return (
    <section id="instructors" className="relative bg-black py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#64CEFB] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Instructors
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Learn from the
            <span className="text-[#64CEFB]"> Best</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.name}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#64CEFB]/30 transition-all duration-500 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#64CEFB]/30 to-[#64CEFB]/10 border-2 border-[#64CEFB]/30 flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[#64CEFB] text-xl font-bold">{instructor.initials}</span>
              </motion.div>
              <h3 className="text-white font-semibold text-lg mb-1">{instructor.name}</h3>
              <p className="text-white/50 text-sm">{instructor.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────────────────────────
   TESTIMONIALS SECTION
   ─────────────────────────────────────────────── */
const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "DesignPro completely transformed my career. I went from a junior designer to a product lead in just 8 months.",
      author: 'Emily Rodriguez',
      role: 'Product Designer @ Netflix',
      initials: 'ER',
    },
    {
      quote: "The mentorship and real-world projects gave me the confidence to lead design at a Fortune 500 company.",
      author: 'James Liu',
      role: 'Senior UX Lead @ Amazon',
      initials: 'JL',
    },
    {
      quote: "Best investment in my career. The community and network I built here are invaluable.",
      author: 'Priya Sharma',
      role: 'Design Director @ Airbnb',
      initials: 'PS',
    },
  ];

  return (
    <section id="testimonials" className="relative bg-black py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#64CEFB]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#64CEFB] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Success Stories from
            <span className="text-[#64CEFB]"> Our Alumni</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              className="group relative p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#64CEFB]/30 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#64CEFB] fill-[#64CEFB]" />
                ))}
              </div>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#64CEFB]/20 border border-[#64CEFB]/30 flex items-center justify-center">
                  <span className="text-[#64CEFB] text-sm font-bold">{testimonial.initials}</span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{testimonial.author}</div>
                  <div className="text-white/50 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────────────────────────
   BLOG SECTION
   ─────────────────────────────────────────────── */
const Blog: React.FC = () => {
  const posts = [
    {
      title: 'The Future of Product Design in 2026',
      date: 'Mar 15, 2026',
      category: 'Trends',
      readTime: '5 min read',
    },
    {
      title: 'How to Build a Design System from Scratch',
      date: 'Mar 10, 2026',
      category: 'Tutorial',
      readTime: '8 min read',
    },
    {
      title: 'AI Tools Every Designer Should Know',
      date: 'Mar 5, 2026',
      category: 'Tools',
      readTime: '6 min read',
    },
  ];

  return (
    <section id="blog" className="relative bg-black py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#64CEFB] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Blog
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Latest Insights &
            <span className="text-[#64CEFB]"> Resources</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#64CEFB]/30 transition-all duration-500 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#64CEFB]/20 text-[#64CEFB]">
                  {post.category}
                </span>
                <span className="text-white/40 text-xs">{post.readTime}</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-[#64CEFB] transition-colors duration-300">
                {post.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-sm">{post.date}</span>
                <motion.span
                  className="text-[#64CEFB] text-sm flex items-center gap-1"
                  whileHover={{ x: 4 }}
                >
                  Read <ArrowRight className="w-4 h-4" />
                </motion.span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────────────────────────
   CONTACT SECTION
   ─────────────────────────────────────────────── */
const Contact: React.FC = () => {
  return (
    <section id="contact" className="relative bg-black py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#64CEFB]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#64CEFB]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#64CEFB] text-sm font-semibold tracking-wider uppercase mb-4 block">
              Contact Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              Ready to Start Your
              <span className="text-[#64CEFB]"> Journey?</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-10">
              Get in touch with our team and take the first step towards becoming a product leader.
            </p>
          </motion.div>

          <motion.form
            className="space-y-4 text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#64CEFB]/50 transition-colors duration-300"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#64CEFB]/50 transition-colors duration-300"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#64CEFB]/50 transition-colors duration-300"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#64CEFB]/50 transition-colors duration-300 resize-none"
            />
            <motion.button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#64CEFB] hover:bg-[#4FB8E8] text-black font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────────────────────────
   FOOTER
   ─────────────────────────────────────────────── */
const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="text-white font-semibold">DesignPro</span>
          </div>
          <p className="text-white/40 text-sm">
            &copy; 2026 DesignPro. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
              <motion.a
                key={social}
                href="#"
                className="text-white/40 hover:text-[#64CEFB] text-sm transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ───────────────────────────────────────────────
   MAIN APP
   ─────────────────────────────────────────────── */
const App: React.FC = () => {
  return (
    <div className="bg-black min-h-screen font-sans">
      <Navbar />
      <Hero />
      <About />
      <Courses />
      <Instructors />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
