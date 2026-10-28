import { useMemo, useState } from 'react'
import {
  Bird, Search, Bell, ChevronDown, Plus, Globe2, Hash, Home, Compass,
  MessageCircle, Bookmark, Settings2, Sparkles, Send, Image, Smile,
  MoreHorizontal, Heart, MessageSquare, Share2, TrendingUp, Flame,
  ShieldCheck, ArrowUpRight, PanelLeftClose, X, Check, Bot, Zap, Users,
  Newspaper, Cpu, Scale, Music2, Landmark, BriefcaseBusiness, CircleHelp
} from 'lucide-react'

const categories = [
  { name: 'Semua diskusi', icon: Globe2, count: '12.8k' },
  { name: 'Teknologi', icon: Cpu, count: '2.4k' },
  { name: 'Ekonomi & Pasar', icon: TrendingUp, count: '1.8k' },
  { name: 'Politik', icon: Landmark, count: '1.2k' },
  { name: 'Hukum', icon: Scale, count: '860' },
  { name: 'Sosial & Budaya', icon: Users, count: '1.6k' },
  { name: 'Hiburan', icon: Music2, count: '2.1k' },
  { name: 'Berita terkini', icon: Newspaper, count: '3.2k' },
]

const initialPosts = [
  {
    id: 1, community: 'Indonesia · Teknologi', flag: '🇮🇩', handle: '@nadia.tech',
    time: '12 menit lalu', title: 'Apakah AI akan membantu UMKM Indonesia tumbuh lebih cepat?',
    body: 'Banyak usaha kecil mulai memakai AI untuk membuat konten, melayani pelanggan, dan membaca tren pasar. Menurut kalian, apa manfaat paling nyata yang sudah dirasakan — dan apa tantangan terbesarnya?',
    tags: ['AI', 'UMKM', 'Diskusi'], likes: 128, comments: 36, shares: 12,
    avatar: 'NT', color: 'from-cyan-500 to-blue-600', kind: 'Diskusi',
  },
  {
    id: 2, community: 'Indonesia · Sosial', flag: '🇮🇩', handle: '@ruangwarga',
    time: '28 menit lalu', title: '💡 Kritik & saran: ruang publik yang lebih nyaman untuk semua',
    body: 'Yuk bahas ide sederhana yang bisa membuat lingkungan tempat tinggal kita lebih aman, bersih, dan ramah untuk semua kalangan. Sampaikan kritik dengan alasan dan usulan solusi, ya.',
    tags: ['Kritik & Saran', 'Komunitas'], likes: 94, comments: 51, shares: 8,
    avatar: 'RW', color: 'from-violet-500 to-fuchsia-600', kind: 'Kritik & Saran',
  },
  {
    id: 3, community: 'Global · Hiburan', flag: '🌏', handle: '@pixelplanet',
    time: '41 menit lalu', title: 'Game indie apa yang menurutmu wajib dicoba tahun ini?',
    body: 'Cari rekomendasi game indie dari berbagai negara! Ceritakan game favoritmu, alasan kamu suka, dan platform tempat kamu memainkannya.',
    tags: ['Gaming', 'Rekomendasi'], likes: 72, comments: 24, shares: 19,
    avatar: 'PP', color: 'from-orange-500 to-pink-600', kind: 'Hiburan',
  },
]

const aiModels = [
  { id: 'ChatGPT', color: 'text-emerald-300', bg: 'bg-emerald-400/10', icon: '✳' },
  { id: 'Gemini', color: 'text-blue-300', bg: 'bg-blue-400/10', icon: '✦' },
  { id: 'Claude', color: 'text-orange-300', bg: 'bg-orange-400/10', icon: '✳' },
]

function Avatar({ children, color = 'from-cyan-500 to-blue-600', size = 'md' }) {
  return <div className={`grid shrink-0 place-items-center rounded-xl bg-gradient-to-br ${color} font-bold text-white ${size === 'sm' ? 'h-8 w-8 text-[10px]' : 'h-10 w-10 text-xs'}`}>{children}</div>
}

function App() {
  const [activeCategory, setActiveCategory] = useState('Semua diskusi')
  const [activeCountry, setActiveCountry] = useState('Indonesia')
  const [countryOpen, setCountryOpen] = useState(false)
  const [sort, setSort] = useState('Untukmu')
  const [search, setSearch] = useState('')
  const [composer, setComposer] = useState('')
  const [selectedAI, setSelectedAI] = useState('ChatGPT')
  const [aiOpen, setAiOpen] = useState(false)
  const [posts, setPosts] = useState(initialPosts)
  const [liked, setLiked] = useState([])
  const [saved, setSaved] = useState([])
  const [notice, setNotice] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [joined, setJoined] = useState(['Indonesia', 'Teknologi'])
  const [activeTab, setActiveTab] = useState('Diskusi')

  const visiblePosts = useMemo(() => {
    const q = search.toLowerCase().trim()
    let result = posts.filter(p => {
      const matchSearch = !q || `${p.title} ${p.body} ${p.handle} ${p.tags.join(' ')} ${p.community}`.toLowerCase().includes(q)
      const matchCategory = activeCategory === 'Semua diskusi' || p.community.toLowerCase().includes(activeCategory.split(' ')[0].toLowerCase()) || p.tags.join(' ').toLowerCase().includes(activeCategory.split(' ')[0].toLowerCase())
      const matchCountry = activeCountry === 'Global' || p.community.includes('Global') || p.community.includes(activeCountry)
      return matchSearch && (activeCategory === 'Semua diskusi' || matchCategory) && matchCountry
    })
    if (sort === 'Populer') result = [...result].sort((a, b) => b.likes - a.likes)
    if (sort === 'Terbaru') result = [...result].reverse()
    return result
  }, [posts, search, activeCategory, activeCountry, sort])

  const notify = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  const submitPost = () => {
    const text = composer.trim()
    if (!text) return
    const aiMatch = text.match(/@(ChatGPT|Gemini|Claude)/i)
    const body = text.replace(/@(ChatGPT|Gemini|Claude)/ig, '').trim()
    const newPost = {
      id: Date.now(), community: `${activeCountry} · ${activeCategory === 'Semua diskusi' ? 'Diskusi umum' : activeCategory}`,
      flag: activeCountry === 'Indonesia' ? '🇮🇩' : activeCountry === 'Malaysia' ? '🇲🇾' : activeCountry === 'Jepang' ? '🇯🇵' : '🌏',
      handle: '@kamu', time: 'baru saja', title: body.length > 90 ? body.slice(0, 87) + '…' : body,
      body, tags: aiMatch ? ['AI', aiMatch[1]] : ['Diskusi baru'], likes: 0, comments: 0, shares: 0,
      avatar: 'K', color: 'from-cyan-400 to-indigo-600', kind: aiMatch ? 'Tanya AI' : 'Diskusi',
    }
    setPosts(prev => [newPost, ...prev])
    setComposer('')
    notify(aiMatch ? `Posting dibuat. Pemanggilan @${aiMatch[1]} masih berupa demo UI; sambungkan API untuk jawaban AI.` : 'Posting berhasil ditambahkan ke feed demo.')
  }

  const callAI = () => {
    if (!composer.trim()) {
      setComposer(`@${selectedAI} bantu saya memahami `)
      notify(`@${selectedAI} ditambahkan ke kolom posting. Isi pertanyaanmu.`)
      return
    }
    if (!composer.includes(`@${selectedAI}`)) setComposer(prev => `@${selectedAI} ${prev}`)
    setAiOpen(false)
    notify(`@${selectedAI} dipilih. Integrasi API diperlukan agar AI benar-benar menjawab.`)
  }

  const toggleJoin = (name) => setJoined(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#080b12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-4 px-4 sm:px-6">
          <button onClick={() => setMobileNav(!mobileNav)} className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden" aria-label="Buka menu"><PanelLeftClose size={19}/></button>
          <div className="flex min-w-[218px] items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-[#071019] shadow-lg shadow-cyan-500/20"><Bird size={23} strokeWidth={2.6}/></div>
            <div><div className="text-[19px] font-extrabold tracking-tight">Bird<span className="text-cyan-300">Chat</span></div><div className="text-[10px] font-medium tracking-[.17em] text-slate-500">COMMUNITY, REIMAGINED</div></div>
          </div>
          <div className="relative hidden max-w-[570px] flex-1 md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari diskusi, komunitas, atau topik..." className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-white/[0.05]"/>
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-600">⌘ K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative rounded-xl border border-white/[0.08] bg-white/[0.025] p-2.5 text-slate-400 transition hover:text-white" aria-label="Notifikasi"><Bell size={18}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300"/></button>
            <button onClick={() => setShowCreate(true)} className="hidden items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 sm:flex"><Plus size={17}/> Buat posting</button>
            <button onClick={() => notify('Profil pengguna: fitur akun akan dibuat pada tahap backend.')} className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1.5 pr-3">
              <Avatar size="sm" color="from-indigo-500 to-violet-600">DK</Avatar><span className="hidden text-xs font-semibold sm:block">doks</span><ChevronDown size={14} className="text-slate-500"/>
            </button>
          </div>
        </div>
        {showNotifications && <div className="absolute right-6 top-[62px] w-[300px] rounded-2xl border border-white/10 bg-[#111722] p-4 shadow-2xl"><div className="mb-3 flex items-center justify-between font-semibold">Notifikasi <button onClick={() => setShowNotifications(false)}><X size={15}/></button></div><p className="text-sm text-slate-400">Belum ada notifikasi baru. Aktivitas komunitas akan muncul di sini.</p></div>}
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[245px_minmax(0,1fr)_290px]">
        <aside className={`${mobileNav ? 'block' : 'hidden'} fixed inset-y-[72px] left-0 z-30 w-[270px] overflow-y-auto border-r border-white/[0.07] bg-[#0a0e16] p-5 lg:sticky lg:top-[72px] lg:block lg:h-[calc(100vh-72px)] lg:w-auto`}>
          <div className="mb-6">
            <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-600">Menu utama</div>
            <nav className="space-y-1">
              {[['Beranda', Home], ['Jelajahi', Compass], ['Pesan', MessageCircle], ['Tersimpan', Bookmark]].map(([label, Icon]) => (
                <button key={label} onClick={() => { setActiveTab(label); if(label === 'Tersimpan') notify('Posting tersimpan ditandai dengan ikon bookmark.'); if(label === 'Pesan') notify('Ruang chat real-time akan diaktifkan setelah backend.') }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${activeTab === label ? 'bg-cyan-300/[0.10] font-semibold text-cyan-200' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'}`}><Icon size={18}/>{label}{label === 'Pesan' && <span className="ml-auto rounded-md bg-cyan-300/10 px-1.5 py-0.5 text-[10px] text-cyan-200">3</span>}</button>
              ))}
            </nav>
          </div>
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between px-3"><span className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-600">Negara / Country</span><button onClick={() => setCountryOpen(!countryOpen)} className="text-slate-500 hover:text-cyan-200"><Plus size={15}/></button></div>
            {countryOpen && <div className="mb-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">{['Indonesia','Malaysia','Jepang','Global'].map(c => <button key={c} onClick={() => {setActiveCountry(c);setCountryOpen(false)}} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-white/5">{c === 'Indonesia' ? '🇮🇩' : c === 'Malaysia' ? '🇲🇾' : c === 'Jepang' ? '🇯🇵' : '🌏'} {c}</button>)}</div>}
            <button onClick={() => setActiveCountry('Indonesia')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${activeCountry === 'Indonesia' ? 'bg-white/[0.055] text-white' : 'text-slate-400 hover:bg-white/[0.04]'}`}><span>🇮🇩</span><span className="flex-1 text-left">Indonesia</span><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/></button>
            <button onClick={() => setActiveCountry('Global')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${activeCountry === 'Global' ? 'bg-white/[0.055] text-white' : 'text-slate-400 hover:bg-white/[0.04]'}`}><span>🌐</span><span className="flex-1 text-left">Global community</span><ArrowUpRight size={13} className="text-slate-600"/></button>
            <button onClick={() => setCountryOpen(!countryOpen)} className="mt-1 flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200"><Plus size={14}/> Jelajahi negara lain</button>
          </div>
          <div className="mb-6">
            <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-600">Kategori</div>
            <div className="space-y-0.5">{categories.map(({name, icon: Icon, count}) => <button key={name} onClick={() => setActiveCategory(name)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] transition ${activeCategory === name ? 'bg-white/[0.07] text-cyan-200' : 'text-slate-400 hover:bg-white/[0.035] hover:text-slate-200'}`}><Icon size={16}/><span className="flex-1">{name}</span><span className="text-[10px] text-slate-600">{count}</span></button>)}</div>
          </div>
          <div className="rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.09] to-blue-500/[0.04] p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><Sparkles size={17}/></div>
            <div className="text-sm font-bold">Bird AI Studio</div><p className="mt-1 text-xs leading-5 text-slate-400">Tiga asisten AI, satu ruang diskusi.</p>
            <button onClick={() => {setAiOpen(true);setComposer(prev => prev || '@ChatGPT ')}} className="mt-3 flex items-center gap-1.5 text-xs font-bold text-cyan-200">Coba AI <ArrowUpRight size={13}/></button>
          </div>
          <div className="mt-5 flex items-center gap-2 px-3 text-[10px] text-slate-600"><ShieldCheck size={13}/> Komunitas aman dimulai dari kita</div>
        </aside>

        <main className="min-w-0 border-x border-white/[0.045]">
          <div className="border-b border-white/[0.07] px-4 py-6 sm:px-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div><div className="mb-2 flex items-center gap-2 text-xs text-slate-500"><span>{activeCountry === 'Indonesia' ? '🇮🇩' : activeCountry === 'Global' ? '🌏' : activeCountry === 'Malaysia' ? '🇲🇾' : '🇯🇵'}</span><span>{activeCountry} community</span><span className="text-slate-700">/</span><span className="text-cyan-200">Public space</span></div><h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">Tempat semua suara <span className="text-gradient">berarti.</span></h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Berbagi ide, bertukar perspektif, dan terhubung dengan komunitas lintas negara.</p></div>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"/><span>2,481 online</span></div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[{n:'12.8k',label:'Anggota aktif',icon:Users},{n:'3,420',label:'Diskusi hari ini',icon:MessageCircle},{n:'18',label:'Negara terhubung',icon:Globe2}].map(({n,label,icon:Icon}) => <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 sm:p-4"><div className="mb-3 flex items-center justify-between"><span className="text-lg font-bold sm:text-xl">{n}</span><Icon size={16} className="text-cyan-300"/></div><div className="text-[10px] text-slate-500 sm:text-xs">{label}</div></div>)}
            </div>
          </div>

          <div className="px-4 pt-5 sm:px-7">
            <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
              {[['Untukmu', Sparkles], ['Terbaru', Zap], ['Populer', Flame]].map(([label, Icon]) => <button key={label} onClick={() => setSort(label)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${sort === label ? 'bg-white text-slate-950' : 'border border-white/[0.08] text-slate-400 hover:bg-white/[0.04]'}`}><Icon size={14}/>{label}</button>)}
              <div className="ml-auto hidden items-center gap-1 text-xs text-slate-500 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/> Feed publik</div>
            </div>

            <section className="mb-6 rounded-2xl border border-white/[0.09] bg-[#0d121c] p-4 sm:p-5">
              <div className="flex gap-3">
                <Avatar color="from-indigo-500 to-violet-600">DK</Avatar>
                <div className="min-w-0 flex-1">
                  <textarea value={composer} onChange={e => setComposer(e.target.value)} placeholder="Apa yang ingin kamu bagikan ke komunitas?" rows={3} className="w-full resize-y bg-transparent py-1 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600"/>
                  <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-3">
                    <button onClick={() => notify('Unggah gambar akan tersedia setelah integrasi penyimpanan file.')} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-white/[0.05] hover:text-cyan-200"><Image size={15}/> <span className="hidden sm:inline">Media</span></button>
                    <button onClick={() => setComposer(prev => prev + ' 😊')} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.05] hover:text-cyan-200" aria-label="Emoji"><Smile size={15}/></button>
                    <div className="relative">
                      <button onClick={() => setAiOpen(!aiOpen)} className="flex items-center gap-1.5 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.07] px-2.5 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/[0.12]"><Sparkles size={14}/> @{selectedAI}<ChevronDown size={12}/></button>
                      {aiOpen && <div className="absolute bottom-10 left-0 z-20 w-44 rounded-xl border border-white/10 bg-[#151b27] p-1.5 shadow-xl">{aiModels.map(ai => <button key={ai.id} onClick={() => {setSelectedAI(ai.id);setAiOpen(false);setComposer(prev => prev.includes(`@${ai.id}`) ? prev : `${prev}${prev ? ' ' : ''}@${ai.id} `)}} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-white/[0.06]"><span className={`${ai.bg} ${ai.color} grid h-6 w-6 place-items-center rounded-md`}>{ai.icon}</span><span className="flex-1">{ai.id}</span>{selectedAI === ai.id && <Check size={13} className="text-cyan-300"/>}</button>)}</div>}
                    </div>
                    <span className="hidden text-[10px] text-slate-600 md:inline">Gunakan @ChatGPT, @Gemini, atau @Claude</span>
                    <button onClick={submitPost} disabled={!composer.trim()} className="ml-auto flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"><Send size={14}/> Posting</button>
                  </div>
                </div>
              </div>
            </section>

            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold">Diskusi komunitas <span className="ml-1 font-normal text-slate-500">({visiblePosts.length})</span></h2><button onClick={() => setActiveCategory('Semua diskusi')} className="text-xs text-cyan-300 hover:text-cyan-100">Lihat semua</button></div>
            <div className="space-y-4 pb-10">
              {visiblePosts.map(post => <article key={post.id} className="group rounded-2xl border border-white/[0.075] bg-[#0c111a] p-4 transition hover:border-white/[0.13] sm:p-5">
                <div className="flex items-start gap-3">
                  <Avatar color={post.color}>{post.avatar}</Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"><span className="font-semibold text-slate-200">{post.handle}</span><span className="text-slate-600">·</span><span className="text-slate-500">{post.time}</span><span className="ml-auto flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-slate-400">{post.flag} {post.community}</span></div>
                    <h3 className="mt-3 text-[15px] font-bold leading-6 text-slate-100 sm:text-base">{post.title}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-[13px] leading-6 text-slate-400">{post.body}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">{post.tags.map(tag => <button key={tag} onClick={() => setSearch(tag)} className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[10px] text-slate-400 hover:border-cyan-300/30 hover:text-cyan-200">#{tag.replaceAll(' ', '')}</button>)}{post.kind === 'Tanya AI' && <span className="flex items-center gap-1 rounded-md border border-violet-300/15 bg-violet-300/[0.07] px-2 py-1 text-[10px] text-violet-200"><Sparkles size={10}/> AI mention</span>}</div>
                    <div className="mt-4 flex items-center gap-1 border-t border-white/[0.06] pt-3">
                      <button onClick={() => setLiked(prev => prev.includes(post.id) ? prev.filter(id => id !== post.id) : [...prev, post.id])} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs transition hover:bg-white/[0.05] ${liked.includes(post.id) ? 'text-pink-300' : 'text-slate-500 hover:text-pink-300'}`}><Heart size={15} fill={liked.includes(post.id) ? 'currentColor' : 'none'}/>{post.likes + (liked.includes(post.id) ? 1 : 0)}</button>
                      <button onClick={() => notify('Komentar real-time akan tersedia setelah backend dan database dipasang.')} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-slate-500 transition hover:bg-white/[0.05] hover:text-cyan-200"><MessageSquare size={15}/>{post.comments}</button>
                      <button onClick={() => notify('Tautan posting demo siap setelah fitur URL publik dibuat.')} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-slate-500 transition hover:bg-white/[0.05] hover:text-cyan-200"><Share2 size={15}/><span className="hidden sm:inline">{post.shares}</span></button>
                      <button onClick={() => setSaved(prev => prev.includes(post.id) ? prev.filter(id => id !== post.id) : [...prev, post.id])} className={`ml-auto rounded-lg p-2 transition hover:bg-white/[0.05] ${saved.includes(post.id) ? 'text-cyan-200' : 'text-slate-600 hover:text-cyan-200'}`} aria-label="Simpan posting"><Bookmark size={15} fill={saved.includes(post.id) ? 'currentColor' : 'none'}/></button>
                      <button onClick={() => notify('Menu laporan konten akan dihubungkan ke sistem moderasi.')} className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.05] hover:text-slate-300" aria-label="Menu posting"><MoreHorizontal size={16}/></button>
                    </div>
                  </div>
                </div>
              </article>)}
              {visiblePosts.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center"><Search className="mx-auto mb-3 text-slate-600" size={26}/><p className="font-semibold">Belum ada diskusi yang cocok</p><p className="mt-1 text-sm text-slate-500">Coba kata kunci atau kategori lain.</p><button onClick={() => {setSearch('');setActiveCategory('Semua diskusi');setActiveCountry('Indonesia')}} className="mt-4 text-xs font-semibold text-cyan-300">Reset filter</button></div>}
            </div>
          </div>
        </main>

        <aside className="hidden space-y-5 p-5 xl:block">
          <section className="rounded-2xl border border-white/[0.07] bg-[#0c111a] p-4">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold">Trending sekarang</h2><TrendingUp size={16} className="text-cyan-300"/></div>
            <div className="space-y-4">{[{tag:'#KecerdasanBuatan',desc:'Teknologi · 2.4k diskusi',num:'1'}, {tag:'#EkonomiDigital',desc:'Ekonomi · 1.8k diskusi',num:'2'}, {tag:'#RuangPublik',desc:'Sosial · 964 diskusi',num:'3'}, {tag:'#IndieGames',desc:'Hiburan · 742 diskusi',num:'4'}].map(t => <button key={t.tag} onClick={() => setSearch(t.tag.replace('#',''))} className="flex w-full items-start gap-3 text-left"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.045] text-[10px] text-slate-500">{t.num}</span><span><span className="block text-xs font-semibold text-slate-200">{t.tag}</span><span className="mt-1 block text-[10px] text-slate-500">{t.desc}</span></span></button>)}</div>
            <button onClick={() => {setSearch('');setActiveCategory('Semua diskusi')}} className="mt-4 w-full border-t border-white/[0.06] pt-3 text-left text-xs font-semibold text-cyan-300">Jelajahi tren <ArrowUpRight size={13} className="inline"/></button>
          </section>

          <section className="overflow-hidden rounded-2xl border border-violet-300/15 bg-gradient-to-br from-violet-400/[0.09] via-[#10101d] to-cyan-400/[0.06] p-4">
            <div className="mb-3 flex items-center justify-between"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200"><Sparkles size={18}/></div><span className="rounded-md border border-violet-300/15 px-2 py-1 text-[9px] font-bold tracking-wide text-violet-200">BETA UI</span></div>
            <h2 className="text-sm font-bold">Satu komunitas. Banyak perspektif AI.</h2><p className="mt-2 text-xs leading-5 text-slate-400">Pilih asisten untuk bantu merangkum, bertukar ide, atau memahami topik yang rumit.</p>
            <div className="mt-4 space-y-2">{aiModels.map(ai => <button key={ai.id} onClick={() => {setSelectedAI(ai.id);setAiOpen(true);setComposer(prev => prev || `@${ai.id} `);notify(`${ai.id} dipilih. Tambahkan pertanyaan di kolom posting.`)}} className="flex w-full items-center gap-2 rounded-xl border border-white/[0.06] bg-black/10 p-2.5 text-left transition hover:border-white/15 hover:bg-white/[0.04]"><span className={`grid h-7 w-7 place-items-center rounded-lg ${ai.bg} ${ai.color}`}>{ai.icon}</span><span className="flex-1 text-xs font-semibold">{ai.id}</span><ArrowUpRight size={13} className="text-slate-600"/></button>)}</div>
            <p className="mt-3 text-[10px] leading-4 text-slate-600">Demo tampilan. Jawaban AI memerlukan API resmi dan konfigurasi backend.</p>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#0c111a] p-4">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold">Komunitas untukmu</h2><Compass size={15} className="text-slate-500"/></div>
            <div className="space-y-4">{[{name:'Teknologi Indonesia',desc:'Diskusi AI, software, startup',members:'18.2k',emoji:'💻'}, {name:'Ruang Warga',desc:'Ide untuk lingkungan lebih baik',members:'9.4k',emoji:'🏙️'}, {name:'Pop Culture Global',desc:'Film, musik, dan gaming',members:'24.1k',emoji:'🎮'}].map((c,i) => <div key={c.name} className="flex items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-lg">{c.emoji}</div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">{c.name}</div><div className="mt-1 truncate text-[10px] text-slate-500">{c.members} anggota</div></div><button onClick={() => {toggleJoin(c.name);notify(joined.includes(c.name) ? `Keluar dari ${c.name}` : `Bergabung ke ${c.name}`)}} className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-bold ${joined.includes(c.name) ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200' : 'border-white/10 text-slate-300 hover:border-cyan-300/30'}`}>{joined.includes(c.name) ? '✓' : 'Gabung'}</button></div>)}</div>
          </section>
          <div className="flex flex-wrap gap-x-3 gap-y-2 px-1 text-[10px] text-slate-600"><button onClick={() => notify('Halaman Tentang BirdChat akan ditambahkan.')}>Tentang</button><button onClick={() => notify('Pedoman komunitas akan ditambahkan.')}>Pedoman</button><button onClick={() => notify('Kebijakan privasi akan ditambahkan.')}>Privasi</button><button onClick={() => notify('Pusat bantuan akan ditambahkan.')}><CircleHelp size={11} className="inline"/> Bantuan</button><span>© 2026 BirdChat</span></div>
        </aside>
      </div>

      <button onClick={() => setShowCreate(true)} className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300 text-slate-950 shadow-xl shadow-cyan-500/20 sm:hidden" aria-label="Buat posting"><Plus size={24}/></button>
      {showCreate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setShowCreate(false)}><div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101621] p-5 shadow-2xl" onClick={e => e.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Buat posting baru</h2><button onClick={() => setShowCreate(false)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"><X size={18}/></button></div><textarea value={composer} onChange={e => setComposer(e.target.value)} placeholder="Mulai percakapan yang bermakna..." rows={5} className="w-full resize-y rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-6 outline-none placeholder:text-slate-600 focus:border-cyan-300/40"/><div className="mt-4 flex items-center justify-between"><button onClick={() => {setAiOpen(true);setShowCreate(false)}} className="flex items-center gap-2 text-xs text-cyan-200"><Sparkles size={15}/> Panggil AI</button><button onClick={() => {submitPost();setShowCreate(false)}} disabled={!composer.trim()} className="rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-slate-950 disabled:opacity-40">Publikasikan</button></div></div></div>}
      {notice && <div role="status" className="fixed bottom-5 left-1/2 z-[60] flex max-w-[calc(100%-32px)] -translate-x-1/2 items-start gap-2 rounded-xl border border-cyan-300/20 bg-[#151e2b] px-4 py-3 text-xs leading-5 text-slate-100 shadow-2xl"><Sparkles size={15} className="mt-0.5 shrink-0 text-cyan-300"/><span>{notice}</span><button onClick={() => setNotice('')} className="ml-1 text-slate-500"><X size={14}/></button></div>}
    </div>
  )
}

export default App
