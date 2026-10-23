import { useEffect, useRef, useState } from 'react'
import { CalendarPlus, ChevronDown, Clock3, Heart, MapPin, Volume2, VolumeX, Shirt, Gift, RotateCcw } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
gsap.registerPlugin(ScrollTrigger)
const wedding = {
  first: 'Amit Roy',
  second: 'Sreya Mandal',
  date: '2027-01-29T00:00:00+05:30',
  groomParents: 'Arun Roy & Tapasi Roy',
  brideFather: 'Srimanta Mandal',
  brideMother: 'Sipra Mandal',
  groomAddress: ['6/1 Akshay Chakraborty Lane', 'Howrah – 711104'],
  brideAddress: ['468 Raja Bazar, Medinipur College', 'Medinipur – 721101'],
  venue: 'Parinoy The Banquet',
  venueAddress: 'Midnapore, West Bengal',
  venueMapUrl: 'https://share.google/HmjJBVYDWi4dgXI1S',
}
const weddingDate = new Date(wedding.date)
const dateLabel = weddingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
const weekday = weddingDate.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Asia/Kolkata' })
const asset = name => `/assets/${name}`
function Ornament() { return <div className="ornament" aria-hidden="true"><span/><Heart size={10} fill="currentColor"/><span/></div> }
function Section({ title, icon: Icon, children, className = '' }) { return <section className={`section ${className}`}><div className="reveal">{Icon && <Icon className="section-icon"/>}{title && <><h2>{title}</h2><Ornament/></>}{children}</div></section> }
function ScratchHeart() {
  const canvas = useRef(null), previous = useRef(null), strokes = useRef(0)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const ctx = canvas.current.getContext('2d');ctx.globalCompositeOperation='source-over'
    const gradient = ctx.createRadialGradient(140,100,5,140,100,160)
    gradient.addColorStop(0,'#e0dfbe'); gradient.addColorStop(1,'#7b8d70')
    ctx.fillStyle = gradient; ctx.fillRect(0,0,280,250)
    let seed=23
    for(let i=0;i<11000;i++){seed=(seed*16807)%2147483647;const x=seed%280;seed=(seed*16807)%2147483647;const y=seed%250;ctx.fillStyle=i%2?'#ffffff55':'#435c4333';ctx.fillRect(x,y,1.2,1.2)}
  }, [])
  function scratch(e) {
    if (!previous.current || revealed) return
    const r=canvas.current.getBoundingClientRect(), point={x:(e.clientX-r.left)*280/r.width,y:(e.clientY-r.top)*250/r.height}
    const ctx=canvas.current.getContext('2d');ctx.globalCompositeOperation='destination-out';ctx.lineWidth=34;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(previous.current.x,previous.current.y);ctx.lineTo(point.x,point.y);ctx.stroke();previous.current=point
    if(++strokes.current>45) setRevealed(true)
  }
  return <div className="heart-wrap"><div className="heart-date"><span>You're Invited!</span><strong>{dateLabel}</strong><span>{weekday}</span></div><canvas ref={canvas} width="280" height="250" className={revealed?'scratched':''} aria-hidden="true" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);const r=e.currentTarget.getBoundingClientRect();previous.current={x:(e.clientX-r.left)*280/r.width,y:(e.clientY-r.top)*250/r.height};scratch(e)}} onPointerMove={scratch} onPointerUp={()=>{previous.current=null}} onPointerCancel={()=>{previous.current=null}}/><button className="scratch-access" onClick={()=>setRevealed(true)}>{revealed?'Date revealed':'Reveal date without scratching'}</button></div>
}
function Countdown() {
  const [now,setNow]=useState(Date.now())
  useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[])
  const seconds=Math.max(0,Math.floor((new Date(wedding.date)-now)/1000))
  return <div className="countdown">{[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60].map((n,i)=><div key={i}><strong>{String(n).padStart(2,'0')}</strong><span>{['DAYS','HOURS','MINUTES','SECONDS'][i]}</span></div>)}</div>
}
function Gallery() {
  const [index,setIndex]=useState(0)
  useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const id=setInterval(()=>setIndex(i=>(i+1)%4),4500);return()=>clearInterval(id)},[])
  return <div className="gallery">{[1,2,3,4].map((n,i)=><img key={n} src={asset(`slide-${n}.jpg`)} alt={`Wedding floral arrangement ${n}`} className={i===index?'active':''}/>)}<div className="dots">{[0,1,2,3].map(i=><button key={i} className={i===index?'active':''} aria-label={`Show photo ${i+1}`} aria-pressed={i===index} onClick={()=>setIndex(i)}/>)}</div></div>
}
function saveDate() {
  // All-day event until a ceremony time is confirmed; DTEND is exclusive.
  const day=wedding.date.slice(0,10)
  const nextDay=new Date(`${day}T00:00:00Z`)
  nextDay.setUTCDate(nextDay.getUTCDate()+1)
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')
  const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','BEGIN:VEVENT','UID:amit-sreya-wedding-2027@local',`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${day.replaceAll('-','')}`,`DTEND;VALUE=DATE:${nextDay.toISOString().slice(0,10).replaceAll('-','')}`,`SUMMARY:${wedding.first} & ${wedding.second} Wedding`,`LOCATION:${wedding.venue}\\, ${wedding.venueAddress}`,'DESCRIPTION:Ceremony time to be announced.','END:VEVENT','END:VCALENDAR'].join('\r\n')
  const url=URL.createObjectURL(new Blob([content],{type:'text/calendar'})),a=document.createElement('a');a.href=url;a.download='wedding.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
export default function App() {
  const root=useRef(null), video=useRef(null), audio=useRef(null), heroText=useRef(null), smoothScroll=useRef(null), playAttempt=useRef(0)
  const [phase,setPhase]=useState('closed'),[ready,setReady]=useState(false),[muted,setMuted]=useState(true),[error,setError]=useState(''),[staticHero,setStaticHero]=useState(false)
  useEffect(()=>()=>{playAttempt.current+=1},[])
  useEffect(()=>{const old=document.body.style.overflow;document.body.style.overflow=phase==='open'?'':'hidden';return()=>{document.body.style.overflow=old}},[phase])
  useEffect(()=>{
    if(phase!=='open')return
    const media=gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const lenis=new Lenis({lerp:0.085,smoothWheel:true,syncTouch:false,anchors:true})
      smoothScroll.current=lenis
      const tick=time=>lenis.raf(time*1000)
      lenis.on('scroll',ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.utils.toArray('.reveal',root.current).forEach(el=>gsap.from(el,{
        autoAlpha:0,y:18,duration:1.15,ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 94%',once:true},
      }))
      ScrollTrigger.refresh()
      return()=>{
        gsap.ticker.remove(tick)
        lenis.off('scroll',ScrollTrigger.update)
        lenis.destroy()
        smoothScroll.current=null
      }
    },root)
    return()=>media.revert()
  },[phase])
  useEffect(()=>{
    if(phase!=='opening')return
    let lastTime=video.current.currentTime, lastProgress=Date.now()
    const watchdog=setInterval(()=>{
      if(video.current.currentTime>lastTime){lastTime=video.current.currentTime;lastProgress=Date.now()}
      else if(Date.now()-lastProgress>12000){setError('The video is taking too long. You can open the invitation without the animation.');clearInterval(watchdog)}
    },1000)
    // timeupdate fires only a few times per second. Follow video time each
    // animation frame so the text stays smooth without drifting on buffering.
    const tick=()=>{
      const progress=gsap.utils.clamp(0,1,(video.current.currentTime-6.2)/2)
      const eased=progress*progress*(3-2*progress)
      heroText.current.style.setProperty('--reveal',eased)
    }
    gsap.ticker.add(tick)
    return()=>{gsap.ticker.remove(tick);clearInterval(watchdog)}
  },[phase])
  function skipOpening() {
    playAttempt.current+=1
    video.current.pause()
    setStaticHero(true)
    setError('')
    setPhase('open')
  }
  async function open() {
    // Safari may not preload a frame until play() is called by a user tap.
    // Never disable this action based on loadeddata or readyState.
    if(phase!=='closed')return
    const attempt=++playAttempt.current
    const media=video.current
    setError('');setPhase('opening')
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){skipOpening();return}
    media.muted=true
    media.defaultMuted=true
    media.playsInline=true
    try{
      if(media.error)media.load()
      await media.play()
      if(attempt!==playAttempt.current)media.pause()
    }catch{
      if(attempt!==playAttempt.current)return
      setPhase('closed');setError('Playback could not start. Tap to retry or open without the animation.')
    }
  }
  async function toggleMusic(){if(!audio.current.paused){audio.current.pause();setMuted(true)}else{try{await audio.current.play();setMuted(false)}catch{setError('Music could not play. Please try again.')}}}
  function replay(){playAttempt.current+=1;if(smoothScroll.current)smoothScroll.current.scrollTo(0,{immediate:true,force:true});else window.scrollTo({top:0,behavior:'instant'});video.current.pause();if(video.current.readyState>=1)video.current.currentTime=0;if(heroText.current)heroText.current.style.setProperty('--reveal',0);setStaticHero(false);setError('');setPhase('closed')}
  return <main ref={root}>
    <audio ref={audio} src={asset('music.mp3')} loop preload="none"/>
    <button className="sound" onClick={toggleMusic} aria-label={muted?'Play music':'Pause music'}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button>
    <section className={`hero ${phase} ${staticHero?'static-hero':''}`}>
      <video ref={video} src={asset('opening.mp4')} muted playsInline preload="metadata" onLoadedData={()=>setReady(true)} onEnded={()=>setPhase('open')} onError={()=>setError('The video could not load. You can open the invitation without the animation.')} aria-hidden="true"/>
      {phase==='closed'&&<button className="open-target" onClick={open} aria-label="Open invitation">{!ready&&<span>Tap to open your invitation</span>}</button>}
      {phase==='opening'&&!error&&<button className="skip-opening" onClick={skipOpening}>Open without animation</button>}
      <div className="hero-text" ref={heroText} style={phase==='open'?{'--reveal':1}:undefined} aria-hidden={phase==='closed'}>
        <Heart fill="currentColor" size={24}/><p className="married">We're getting married</p><Ornament/>
        <h1>{wedding.first}</h1><p className="family">Son of<br/>{wedding.groomParents}</p><span className="ampersand">&amp;</span>
        <h1>{wedding.second}</h1><p className="family">Daughter of<br/>{wedding.brideFather} &amp; {wedding.brideMother}</p>
        <p className="hero-date">{dateLabel}</p>
      </div>
      {phase==='open'&&<a className="scroll-cue" href="#welcome">SCROLL<ChevronDown/></a>}
    </section>
    <div className="invitation-body" inert={phase!=='open'}>
      <section className="welcome" id="welcome"><div className="reveal"><Ornament/><p>We are honored to welcome you to the Wedding ceremony of {wedding.first} &amp; {wedding.second}. As they begin their journey together in faith and love,<br/>we thank you for being part of this blessed occasion ♥</p><Ornament/></div></section>
      <Section title="Our Families" icon={Heart}>
        <div className="family-details"><h3>{wedding.first}</h3><p>Son of {wedding.groomParents}</p><address>{wedding.groomAddress.map(line=><span key={line}>{line}</span>)}</address></div>
        <Ornament/>
        <div className="family-details"><h3>{wedding.second}</h3><p>Daughter of {wedding.brideFather} &amp; {wedding.brideMother}</p><address>{wedding.brideAddress.map(line=><span key={line}>{line}</span>)}</address></div>
      </Section>
      <Section title="Scratch to Reveal"><ScratchHeart/><button className="pill" onClick={saveDate}><CalendarPlus size={16}/>Save the Date</button></Section>
      <Section className="gallery-section"><Ornament/><Gallery/></Section>
      <Section title="Counting Down to Forever"><Countdown/></Section>
      <Section title="Wedding Ceremony" icon={Clock3}><p className="day">{weekday}, {dateLabel}</p><p>Ceremony time to be announced.</p></Section>
      <Section title="Venue" icon={MapPin}>
        <h3>{wedding.venue}</h3>
        <p>{wedding.venueAddress}</p>
        <iframe title={`${wedding.venue} map`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Parinoy%20The%20Banquet%20Midnapore%20West%20Bengal&output=embed"/>
        <a className="pill" href={wedding.venueMapUrl} target="_blank" rel="noreferrer"><MapPin size={16}/>Open in Google Maps</a>
      </Section>
      <Section title="Dress Code" icon={Shirt}><h3>Women</h3><p>Elegant formal attire in pastel or jewel tones</p><h3>Men</h3><p>Suit or traditional formal wear</p></Section>
      <Section title="Gifts" icon={Gift}><p>Your love, blessings, and presence are the greatest gifts we could ever ask for.</p></Section>
      <footer><p>We can't wait to celebrate with you!</p><h2>{wedding.first} &amp; {wedding.second}</h2><Ornament/><button className="replay" onClick={replay}><RotateCcw size={14}/> Replay invitation</button></footer>
    </div>
    {error&&<div className="error" role="alert">{error}<button onClick={()=>setError('')} aria-label="Dismiss">×</button>{phase!=='open'&&<button className="error-open" onClick={skipOpening}>Open without animation</button>}</div>}
  </main>
}

