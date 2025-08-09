import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-void via-cosmic-nebula to-cosmic-stardust relative overflow-hidden">
      {/* Animated stellar background */}
      <div className="absolute inset-0 opacity-40">
        {/* Nebula clouds */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-cosmic-aurora rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cosmic-plasma rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-cosmic-starlight rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cosmic-galaxy rounded-full blur-3xl animate-pulse delay-1500"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cosmic-comet rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Additional smaller nebulae */}
        <div className="absolute top-1/4 right-1/3 w-48 h-48 bg-cosmic-plasma/60 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-1/3 left-1/6 w-56 h-56 bg-cosmic-aurora/60 rounded-full blur-2xl animate-pulse delay-1200"></div>
      </div>

      {/* Floating stars */}
      <div className="absolute inset-0 opacity-80">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cosmic-moon rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Larger stars */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-2 h-2 bg-cosmic-starlight rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Cosmic dust particles */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={`dust-${i}`}
            className="absolute w-0.5 h-0.5 bg-cosmic-cosmic rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-4xl animate-pulse">🌌</span>
              <span className="text-4xl animate-pulse delay-500">✨</span>
              <span className="text-4xl animate-pulse delay-1000">🚀</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cosmic-starlight via-cosmic-galaxy to-cosmic-cosmic bg-clip-text text-transparent animate-pulse">
                Cosmic
              </span>
              <br />
              <span className="bg-gradient-to-r from-cosmic-comet via-cosmic-sun to-cosmic-starlight bg-clip-text text-transparent">
                Explorer
              </span>
            </h1>
            <div className="text-xl md:text-2xl text-cosmic-cosmic/90 font-light tracking-wide">
              Journey Through the Digital Universe
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-cosmic-moon/80 mb-8 leading-relaxed max-w-4xl mx-auto">
            Embark on an interstellar adventure through code, creativity, and cosmic innovation. 
            Explore the infinite possibilities of the digital cosmos.
          </p>

          {/* Cosmic Divider */}
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cosmic-comet to-transparent rounded-full"></div>
            <div className="mx-6 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cosmic-plasma to-cosmic-aurora rounded-full flex items-center justify-center border-2 border-cosmic-starlight/30">
                <div className="w-6 h-6 bg-cosmic-sun rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -inset-2 bg-cosmic-starlight/20 rounded-full blur-md animate-pulse"></div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cosmic-aurora to-transparent rounded-full"></div>
          </div>

          {/* Cosmic Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-cosmic-void/60 backdrop-blur-lg rounded-3xl p-8 border border-cosmic-aurora/30 hover:border-cosmic-starlight/60 hover:shadow-2xl hover:shadow-cosmic-aurora/20 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cosmic-aurora/10 to-cosmic-plasma/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cosmic-starlight to-cosmic-galaxy rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cosmic-aurora/30">
                  <span className="text-white text-3xl">🌟</span>
                </div>
                <h3 className="text-2xl font-semibold text-cosmic-moon mb-4">Stellar Innovation</h3>
                <p className="text-cosmic-cosmic/80 leading-relaxed">Harness the power of cosmic creativity to build extraordinary digital experiences</p>
              </div>
            </div>

            <div className="bg-cosmic-void/60 backdrop-blur-lg rounded-3xl p-8 border border-cosmic-plasma/30 hover:border-cosmic-galaxy/60 hover:shadow-2xl hover:shadow-cosmic-plasma/20 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cosmic-plasma/10 to-cosmic-galaxy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cosmic-galaxy to-cosmic-cosmic rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cosmic-plasma/30">
                  <span className="text-white text-3xl">🛸</span>
                </div>
                <h3 className="text-2xl font-semibold text-cosmic-moon mb-4">Galactic Tools</h3>
                <p className="text-cosmic-cosmic/80 leading-relaxed">Advanced development environments designed for interstellar collaboration</p>
              </div>
            </div>

            <div className="bg-cosmic-void/60 backdrop-blur-lg rounded-3xl p-8 border border-cosmic-comet/30 hover:border-cosmic-sun/60 hover:shadow-2xl hover:shadow-cosmic-comet/20 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cosmic-comet/10 to-cosmic-sun/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cosmic-comet to-cosmic-sun rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cosmic-comet/30">
                  <span className="text-white text-3xl">🌠</span>
                </div>
                <h3 className="text-2xl font-semibold text-cosmic-moon mb-4">Cosmic Exploration</h3>
                <p className="text-cosmic-cosmic/80 leading-relaxed">Journey through infinite possibilities with cutting-edge technology</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex justify-center">
            <Link to="/editor">
              <Button className="bg-gradient-to-r from-cosmic-plasma to-cosmic-aurora hover:from-cosmic-starlight hover:to-cosmic-galaxy text-white font-semibold py-4 px-10 rounded-full text-lg shadow-2xl shadow-cosmic-plasma/50 hover:shadow-cosmic-aurora/60 transition-all duration-500 border border-cosmic-starlight/30 backdrop-blur-sm group">
                <span className="mr-3 group-hover:animate-bounce">🚀</span>
                Launch Explorer
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-2 border-cosmic-comet/60 text-cosmic-comet hover:bg-cosmic-comet/10 hover:border-cosmic-comet hover:text-cosmic-sun font-semibold py-4 px-10 rounded-full text-lg backdrop-blur-sm transition-all duration-300 shadow-lg shadow-cosmic-comet/20"
            >
              <span className="mr-3">🌌</span>
              Discover Universe
            </Button>
          </div>

          {/* Cosmic Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-cosmic-starlight mb-2 group-hover:text-cosmic-galaxy transition-colors">∞</div>
              <div className="text-cosmic-cosmic/70 text-sm tracking-wide">Galaxies</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-cosmic-aurora mb-2 group-hover:text-cosmic-plasma transition-colors">42</div>
              <div className="text-cosmic-cosmic/70 text-sm tracking-wide">Light Years</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-cosmic-comet mb-2 group-hover:text-cosmic-sun transition-colors">7.8B</div>
              <div className="text-cosmic-cosmic/70 text-sm tracking-wide">Star Systems</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-cosmic-galaxy mb-2 group-hover:text-cosmic-cosmic transition-colors">1</div>
              <div className="text-cosmic-cosmic/70 text-sm tracking-wide">Universe</div>
            </div>
          </div>
        </div>

        {/* Bottom cosmic glow */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cosmic-nebula/30 to-transparent"></div>
      </div>

      {/* Floating cosmic elements */}
      <div className="absolute top-1/4 left-8 animate-float">
        <div className="w-4 h-4 bg-cosmic-starlight rounded-full shadow-lg shadow-cosmic-starlight/50"></div>
      </div>
      <div className="absolute top-1/3 right-12 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-3 h-3 bg-cosmic-comet rounded-full shadow-lg shadow-cosmic-comet/50"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-5 h-5 bg-cosmic-aurora rounded-full shadow-lg shadow-cosmic-aurora/50"></div>
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-pulse">
        <div className="text-cosmic-galaxy text-sm opacity-60">✨</div>
      </div>

      {/* Shooting star */}
      <div className="absolute top-1/4 left-0 w-full h-1">
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-cosmic-sun to-transparent animate-pulse opacity-60"></div>
      </div>
    </div>
  );
}
