import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-dark via-durga-maroon/20 to-tech-purple/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {/* Tech elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-tech-neon rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-durga-gold rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-tech-matrix rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-durga-saffron rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-tech-electric rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Matrix-style code rain effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/6 text-tech-matrix text-xs font-mono animate-pulse">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="mb-1">
              {Math.random().toString(36).substring(2, 15)}
            </div>
          ))}
        </div>
        <div className="absolute top-0 right-1/6 text-tech-neon text-xs font-mono animate-pulse delay-500">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="mb-1">
              {Math.random().toString(36).substring(2, 15)}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-4xl">💻</span>
              <span className="text-4xl">🕉️</span>
              <span className="text-4xl">⚡</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-tech-neon via-durga-gold to-tech-matrix bg-clip-text text-transparent">
                HackPuja
              </span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-semibold mb-6">
              <span className="text-tech-electric">Code</span>
              <span className="text-durga-gold mx-3">×</span>
              <span className="text-durga-red">Culture</span>
            </h2>
            <div className="text-lg md:text-xl text-durga-gold/80 font-mono">
              where innovation meets tradition
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed max-w-4xl mx-auto">
            A revolutionary fusion hackathon celebrating the divine power of coding and the sacred traditions of Durga Puja. 
            Build solutions that honor our heritage while shaping the future.
          </p>

          {/* Decorative Divider with tech elements */}
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-16 bg-gradient-to-r from-tech-neon to-durga-gold rounded-full"></div>
            <div className="mx-4 w-10 h-10 bg-gradient-to-br from-tech-electric to-durga-red rounded-lg flex items-center justify-center border border-tech-neon/30">
              <span className="text-white text-sm font-mono">{"<>"}</span>
            </div>
            <div className="h-1 w-16 bg-gradient-to-r from-durga-gold to-tech-matrix rounded-full"></div>
          </div>

          {/* Fusion Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-tech-neon/30 hover:border-tech-neon/60 hover:shadow-2xl hover:shadow-tech-neon/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-tech-neon to-tech-electric rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Innovation Seva</h3>
              <p className="text-white/70">Build tech solutions with the spirit of selfless service</p>
              <div className="mt-2 text-xs font-mono text-tech-matrix">// code for good</div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-durga-gold/30 hover:border-durga-gold/60 hover:shadow-2xl hover:shadow-durga-gold/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-durga-gold to-durga-saffron rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cultural Tech</h3>
              <p className="text-white/70">Preserve and digitize our rich heritage through code</p>
              <div className="mt-2 text-xs font-mono text-durga-gold">// tradition++</div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-tech-matrix/30 hover:border-tech-matrix/60 hover:shadow-2xl hover:shadow-tech-matrix/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-tech-matrix to-durga-orange rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Divine Debug</h3>
              <p className="text-white/70">Collaborative coding sessions blessed by collective wisdom</p>
              <div className="mt-2 text-xs font-mono text-tech-matrix">// debug.blessed()</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex justify-center">
            <Button className="bg-gradient-to-r from-tech-neon to-tech-electric hover:from-tech-neon/90 hover:to-tech-electric/90 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-tech-neon/50 transition-all duration-300 border border-tech-neon/30">
              <span className="mr-2">⚡</span>
              Join the Hackathon
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-durga-gold text-durga-gold hover:bg-durga-gold/10 hover:border-durga-gold/80 font-semibold py-3 px-8 rounded-full text-lg backdrop-blur-sm"
            >
              <span className="mr-2">🕉️</span>
              Learn About Fusion
            </Button>
          </div>

          {/* Event Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-tech-neon">24</div>
              <div className="text-white/60 text-sm font-mono">Hours Coding</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-durga-gold">5</div>
              <div className="text-white/60 text-sm font-mono">Days Festival</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-tech-matrix">∞</div>
              <div className="text-white/60 text-sm font-mono">Possibilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-durga-red">1</div>
              <div className="text-white/60 text-sm font-mono">Divine Mission</div>
            </div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-tech-dark/60 to-transparent"></div>
      </div>

      {/* Floating tech elements */}
      <div className="absolute top-1/4 left-8 animate-bounce">
        <div className="w-3 h-3 bg-tech-neon rounded-full"></div>
      </div>
      <div className="absolute top-1/3 right-12 animate-bounce delay-1000">
        <div className="w-2 h-2 bg-durga-gold rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-bounce delay-500">
        <div className="w-4 h-4 bg-tech-matrix rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-pulse">
        <div className="text-tech-electric text-xs font-mono opacity-60">{"{ }"}</div>
      </div>
    </div>
  );
}
