import { useState, useEffect } from 'react'

const IMAGENES = [
  "https://res.cloudinary.com/ds2udm1nc/image/upload/v1776915712/Copilot_20260423_000714_yreyre.png",
  "https://res.cloudinary.com/ds2udm1nc/image/upload/v1776915710/Copilot_20260423_000306_xucvfd.png", 
  "https://res.cloudinary.com/ds2udm1nc/image/upload/v1776915709/Copilot_20260423_000431_k2gk4n.png",
  "https://res.cloudinary.com/ds2udm1nc/image/upload/v1776915707/Copilot_20260422_235149_gx07ic.png"
]

export default function Home() {
  const [idea, setIdea] = useState('')
  const [subreddit, setSubreddit] = useState('startups')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [bgIndex, setBgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % IMAGENES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  async function validar() {
    if (!idea) return
    setLoading(true)
    setResult(null)
    
    const res = await fetch('/api/analizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, subreddit })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  function reset() {
    setResult(null)
    setIdea('')
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        body { font-family: 'Poppins', sans-serif; margin: 0; overflow: hidden; }
       .carousel-bg {
          position: fixed; inset: 0; z-index: -1;
          background-size: cover; background-position: center;
          transition: opacity 1.5s ease-in-out;
        }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
       .float { animation: float 4s ease-in-out infinite; }
      `}</style>

      {IMAGENES.map((img, i) => (
        <div key={i} className="carousel-bg" 
             style={{backgroundImage: `url(${img})`, opacity: i === bgIndex? 1 : 0}} />
      ))}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

      <main className="h-screen w-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-6xl h-full max-h- grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/30">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 float">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="rayo" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#rayo)" d="M55.1,2.1c-1.4-1.9-4.3-1.9-5.7,0L20.5,41.2c-1.1,1.5-0.2,3.6,1.7,3.8l19.4,2.1l-7.1,32.9c-0.6,2.4,4.5,2.9l35.3-27.1c1.8-1.4,1.1-4.2-1.2-4.5L53.7,49L63.4,9.1C64.2,6.5,61.8,4,59.6,5.1L55.1,2.1z"/>
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">¿Tu idea tiene futuro?</h1>
              <p className="text-slate-600">IA analiza tu idea contra Reddit en 60 seg</p>
            </div>

            {!loading &&!result && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tu idea 🌱</label>
                <input value={idea} onChange={e => setIdea(e.target.value)} 
                       onKeyDown={e => e.key === 'Enter' && validar()}
                       placeholder="Ej: vender velas artesanales..."
                       className="w-full p-3 rounded-2xl bg-white border-2 border-orange-200 mb-4 outline-none focus:border-pink-400"/>
                
                <label className="block text-sm font-bold text-slate-700 mb-2">Comunidad 🕵️</label>
                <select value={subreddit} onChange={e => setSubreddit(e.target.value)} 
                        className="w-full p-3 rounded-2xl bg-white border-2 border-orange-200 mb-6 outline-none focus:border-pink-400">
                  <option value="startups">Startups 🚀</option>
                  <option value="entrepreneur">Negocios 💼</option>
                  <option value="argentina">Argentina 🇦🇷</option>
                  <option value="smallbusiness">PyMEs 🛍️</option>
                </select>
                
                <button onClick={validar} disabled={!idea || loading}
                        className="w-full p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition disabled:opacity-50">
                  ✨ Analizar mi idea
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 float">🔮</div>
                <p className="font-bold text-slate-800 text-lg">Consultando a miles de emprendedores...</p>
              </div>
            )}

            {result && (
              <div className="text-center">
                <div className="text-6xl mb-2 float">{result.emoji}</div>
                <div className={`inline-block px-4 py-1 rounded-full font-bold text-sm mb-2 ${result.badge}`}>{result.nivel}</div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">{result.titulo}</h2>
                <p onClick={reset} className="text-pink-600 text-sm font-bold cursor-pointer hover:underline">🔄 Probar otra idea</p>
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/30 h-full overflow-y-auto">
            {!result &&!loading && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-7xl mb-4 opacity-50">📊</div>
                  <p className="text-slate-500 font-semibold">Tu análisis aparece acá</p>
                  <p className="text-slate-400 text-sm mt-1">Escribí tu idea y apretá analizar</p>
                </div>
              </div>
            )}

            {result && (
              <div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">💡 Análisis de IA:</h3>
                <p className="text-slate-700 mb-6 whitespace-pre-wrap">{result.analisis}</p>

                {result.posts && result.posts.length > 0 && (
                  <>
                    <h3 className="font-bold text-slate-700 mb-3">💬 Posts relacionados:</h3>
                    {result.posts.map((post, i) => (
                      <a key={i} href={post.url} target="_blank" 
                         className="block bg-gradient-to-r from-orange-50 to-rose-50 p-3 rounded-2xl mb-3 border border-orange-100 hover:border-orange-300 hover:shadow-md transition">
                        <p className="text-slate-800 font-medium text-sm">{post.title}</p>
                        <p className="text-pink-600 text-xs mt-1 font-bold">Ver charla ↗</p>
                      </a>
                    ))}
                  </>
                )}

                <form action="https://formspree.io/f/mojypkzp" method="POST" className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">¿Te aviso cuando lance la versión pro? 📬</label>
                  <input type="hidden" name="idea_consultada" value={idea} />
                  <div className="flex gap-2">
                    <input type="email" name="email" placeholder="tu@email.com" required
                           className="flex-1 p-3 rounded-xl bg-white border-2 border-orange-200 text-sm focus:border-pink-400 outline-none" />
                    <button type="submit" className="px-5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 text-sm">
                      Avisame
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
    }
