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
        body { font-family: 'Poppins', sans-serif; margin: 0; }
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

      <main className="min-h-screen w-screen flex items-center justify-center p-2 relative z-10">
        <div className="w-full max-w-6xl grid grid-cols-2 gap-2">
          
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-white/30">
            <div className="text-center mb-3">
              <div className="w-12 h-12 mx-auto mb-2 float">
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
              <h1 className="text-lg font-extrabold text-slate-900 mb-1">¿Idea con futuro?</h1>
            </div>

            {!loading &&!result && (
              <div>
                <input value={idea} onChange={e => setIdea(e.target.value)} 
                       onKeyDown={e => e.key === 'Enter' && validar()}
                       placeholder="Tu idea..."
                       className="w-full p-2 rounded-xl bg-white border-2 border-orange-200 mb-2 text-sm outline-none focus:border-pink-400"/>
                
                <select value={subreddit} onChange={e => setSubreddit(e.target.value)} 
                        className="w-full p-2 rounded-xl bg-white border-2 border-orange-200 mb-2 text-sm outline-none focus:border-pink-400">
                  <option value="startups">Startups 🚀</option>
                  <option value="entrepreneur">Negocios 💼</option>
                  <option value="argentina">Argentina 🇦🇷</option>
                </select>
                
                <button onClick={validar} disabled={!idea || loading}
                        className="w-full p-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-sm shadow-lg active:scale-95 transition disabled:opacity-50">
                  ✨ Analizar
                </button>

                <form action="https://formspree.io/f/mojypkzp" method="POST" className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text- font-bold text-slate-700 mb-1">¿Te aviso si lanzo la pro? 📬</p>
                  <input type="hidden" name="idea_consultada" value={idea} />
                  <input type="email" name="email" placeholder="tu@email.com" required
                         className="w-full p-2 rounded-lg bg-white border border-orange-200 text-xs mb-1" />
                  <button type="submit" className="w-full p-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs">
                    Avisame
                  </button>
                </form>
              </div>
            )}

            {loading && (
              <div className="text-center py-4">
                <div className="text-4xl mb-2 float">🔮</div>
                <p className="font-bold text-slate-800 text-sm">Analizando...</p>
              </div>
            )}

            {result && (
              <div className="text-center">
                <div className="text-4xl mb-1 float">{result.emoji}</div>
                <div className={`inline-block px-2 py-0.5 rounded-full font-bold text-xs mb-1 ${result.badge}`}>{result.nivel}</div>
                <h2 className="text-sm font-bold text-slate-900 mb-2">{result.titulo}</h2>
                <p onClick={reset} className="text-pink-600 text-xs font-bold cursor-pointer">🔄 Otra</p>
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-white/30 overflow-y-auto max-h-">
            {!result &&!loading && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-5xl mb-2 opacity-50">📊</div>
                  <p className="text-slate-500 font-semibold text-xs">Resultado acá</p>
                </div>
              </div>
            )}

            {result && (
              <div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm">💡 Análisis:</h3>
                <p className="text-slate-700 mb-3 whitespace-pre-wrap text-xs">{result.analisis}</p>

                {result.posts && result.posts.length > 0 && (
                  <>
                    <h3 className="font-bold text-slate-700 mb-2 text-sm">💬 Posts:</h3>
                    {result.posts.map((post, i) => (
                      <a key={i} href={post.url} target="_blank" 
                         className="block bg-orange-50 p-2 rounded-xl mb-2 border border-orange-100">
                        <p className="text-slate-800 font-medium text-xs">{post.title}</p>
                        <p className="text-pink-600 text- mt-0.5 font-bold">Ver ↗</p>
                      </a>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
        }
