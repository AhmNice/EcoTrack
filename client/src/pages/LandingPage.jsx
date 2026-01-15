// App.js or pages/Home.js
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Camera,
  Users,
  TrendingUp,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smartphone,
  Download,
  Star,
  Award,
  Target,
  BarChart3,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EcoTrackLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Auto-rotate features
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Report Issues",
      description: "Capture photos of environmental problems and tag exact locations using GPS",
      color: "from-green-500 to-emerald-500",
      stats: "10K+ Reports"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Interactive Map",
      description: "View real-time environmental reports on an interactive community map",
      color: "from-blue-500 to-cyan-500",
      stats: "500+ Communities"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Join forces with citizens, NGOs, and government agencies",
      color: "from-purple-500 to-pink-500",
      stats: "50+ NGO Partners"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Data Insights",
      description: "Identify environmental hotspots and track progress over time",
      color: "from-orange-500 to-red-500",
      stats: "1M+ Data Points"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Transparency",
      description: "Promote accountability and collective responsibility",
      color: "from-indigo-500 to-blue-500",
      stats: "100% Transparent"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Sustainability",
      description: "Support data-driven policy decisions for a cleaner environment",
      color: "from-teal-500 to-green-500",
      stats: "200+ Actions Taken"
    }
  ];

  const environmentalIssues = [
    { name: "Illegal Dumping", icon: "🚯", reports: "2,543" },
    { name: "Deforestation", icon: "🌳", reports: "1,876" },
    { name: "Soil Erosion", icon: "⛰️", reports: "934" },
    { name: "Flooding", icon: "🌊", reports: "1,234" },
    { name: "Bush Burning", icon: "🔥", reports: "765" },
    { name: "Water Pollution", icon: "💧", reports: "1,543" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Community Leader",
      content: "EcoTrack helped our neighborhood coordinate a massive clean-up that removed over 5 tons of illegal waste!",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Environmental NGO",
      content: "The data insights from EcoTrack enabled us to target our conservation efforts where they're needed most.",
      avatar: "👨‍🌾",
      rating: 5
    },
    {
      name: "Dr. Elena Rodriguez",
      role: "Government Official",
      content: "This platform has revolutionized how we monitor and respond to environmental issues in real-time.",
      avatar: "👩‍⚕️",
      rating: 4
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "25K+", label: "Issues Resolved", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "150+", label: "Cities Covered", icon: <MapPin className="w-6 h-6" /> },
    { number: "95%", label: "Satisfaction Rate", icon: <Heart className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  EcoTrack
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {["Features", "How It Works", "Impact", "Testimonials"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/auth/login")}
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/auth/signup")}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600 p-2 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["Features", "How It Works", "Impact", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                  className="w-full text-center text-green-600 hover:text-green-700 font-medium py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative z-10">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-pulse">
              <Award className="w-4 h-4" />
              <span>Trusted by 50,000+ environmental champions</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Track. Report.{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Protect.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Empowering communities to monitor environmental issues through AI-powered reporting,
              interactive mapping, and collective action for a sustainable future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3"
              >
                <span>Start Reporting Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-green-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How EcoTrack Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform that turns community observations into actionable environmental data
            </p>
          </div>

          {/* Feature Carousel */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  {features[activeFeature].title}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${features[activeFeature].color} rounded-2xl flex items-center justify-center text-white transform hover:scale-110 transition-transform duration-300`}>
                    {features[activeFeature].icon}
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {features[activeFeature].description}
                  </p>
                  <div className="text-2xl font-bold text-gray-900">
                    {features[activeFeature].stats}
                  </div>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Learn More
                  </button>
                </div>

                <div className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Camera className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-gray-600 font-medium">Interactive Demo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveFeature(index);
                      setIsPlaying(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeFeature
                        ? 'bg-green-500 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* All Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer ${
                  index === activeFeature ? 'ring-4 ring-white ring-opacity-50' : ''
                }`}
                onClick={() => {
                  setActiveFeature(index);
                  setIsPlaying(false);
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    {feature.icon}
                  </div>
                  {index === activeFeature && (
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Issues Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Track Environmental Issues
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Report and monitor various environmental challenges in your community with real-time tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {environmentalIssues.map((issue, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{issue.icon}</div>
                  <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-semibold">
                    {issue.reports} reports
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-white/90">
                  {issue.name}
                </h3>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(parseInt(issue.reports.replace(/,/g, '')) / 2543) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Activity Feed */}
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Live Community Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl font-bold">15</div>
                <div className="text-sm opacity-90">Reports This Hour</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm opacity-90">Issues Being Resolved</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-2xl font-bold">127</div>
                <div className="text-sm opacity-90">Active Volunteers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of environmental champions making a real difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100"
              >
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Driving Real Environmental Impact
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                EcoTrack creates a powerful ecosystem where citizens, NGOs, and government agencies
                collaborate to address environmental challenges effectively through data-driven solutions.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Real-time environmental monitoring database with AI analysis",
                  "Community-led clean-up coordination and tracking",
                  "Data-driven policy decision support system",
                  "Transparent accountability and progress tracking",
                  "Hotspot identification and predictive trend analysis",
                  "Automated report generation for authorities"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download App</span>
                </button>
                <button className="border border-green-500 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                  View Case Studies
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
                    <p className="opacity-90 mb-4 leading-relaxed">
                      Be part of the solution. Your reports contribute to a cleaner, more sustainable environment for everyone.
                    </p>
                    <button
                      onClick={() => navigate("/auth")}
                      className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors w-full transform hover:scale-105"
                    >
                      Create Your Account
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold">50K+</div>
                      <div className="text-sm opacity-90">Active Users</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold">25K+</div>
                      <div className="text-sm opacity-90">Issues Resolved</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold">95%</div>
                      <div className="text-sm opacity-90">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of environmental champions using EcoTrack to protect our planet,
            one report at a time. Together, we can create lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/auth")}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3"
            >
              <Target className="w-6 h-6" />
              <span>Start Reporting Today</span>
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3">
              <BarChart3 className="w-6 h-6" />
              <span>View Impact Dashboard</span>
            </button>
          </div>

          {/* App Download Badges */}
          <div className="flex justify-center space-x-4 mt-8">
            <button className="bg-black/20 hover:bg-black/30 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Download iOS App</span>
            </button>
            <button className="bg-black/20 hover:bg-black/30 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Download Android App</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">EcoTrack</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering communities to protect our environment through technology,
                collaboration, and data-driven action for a sustainable future.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: ["Features", "How It Works", "Case Studies", "Pricing"]
              },
              {
                title: "Resources",
                links: ["Help Center", "Community", "Partners", "Blog"]
              },
              {
                title: "Company",
                links: ["About", "Contact", "Careers", "Press Kit"]
              }
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 EcoTrack. All rights reserved. Building a sustainable future together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EcoTrackLanding;