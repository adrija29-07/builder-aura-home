import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-durga-cream via-amber-50 to-durga-gold/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-durga-red rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-durga-gold rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-durga-orange rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-durga-saffron rounded-full blur-2xl"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-durga-red via-durga-gold to-durga-orange bg-clip-text text-transparent mb-4 leading-tight">
              শুভ দুর্গা পূজা
            </h1>
            <h2 className="text-4xl md:text-6xl font-semibold text-durga-maroon mb-6">
              Durga Puja Festival
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-durga-maroon/80 mb-8 leading-relaxed max-w-3xl mx-auto">
            Celebrating the divine feminine power, victory of good over evil, and the homecoming of Goddess Durga
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-16 bg-gradient-to-r from-durga-red to-durga-gold rounded-full"></div>
            <div className="mx-4 w-8 h-8 bg-durga-gold rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-durga-red rounded-full"></div>
            </div>
            <div className="h-1 w-16 bg-gradient-to-r from-durga-gold to-durga-orange rounded-full"></div>
          </div>

          {/* Festival Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-durga-gold/30 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-durga-red to-durga-orange rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🕉️</span>
              </div>
              <h3 className="text-xl font-semibold text-durga-maroon mb-2">Divine Worship</h3>
              <p className="text-durga-maroon/70">Sacred rituals and prayers honoring Maa Durga</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-durga-gold/30 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-durga-gold to-durga-saffron rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold text-durga-maroon mb-2">Cultural Programs</h3>
              <p className="text-durga-maroon/70">Traditional dance, music, and artistic performances</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-durga-gold/30 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-durga-orange to-durga-red rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🏛️</span>
              </div>
              <h3 className="text-xl font-semibold text-durga-maroon mb-2">Pandal Hopping</h3>
              <p className="text-durga-maroon/70">Explore beautifully decorated temporary temples</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex justify-center">
            <Button className="bg-gradient-to-r from-durga-red to-durga-orange hover:from-durga-red/90 hover:to-durga-orange/90 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Explore Celebrations
            </Button>
            <Button variant="outline" className="border-2 border-durga-gold text-durga-maroon hover:bg-durga-gold/10 font-semibold py-3 px-8 rounded-full text-lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-durga-gold/20 to-transparent"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-8 animate-pulse">
        <div className="w-3 h-3 bg-durga-gold rounded-full"></div>
      </div>
      <div className="absolute top-1/3 right-12 animate-pulse delay-1000">
        <div className="w-2 h-2 bg-durga-red rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-pulse delay-500">
        <div className="w-4 h-4 bg-durga-orange rounded-full"></div>
      </div>
    </div>
  );
}
