import React, { useEffect, useState, useRef } from 'react';
import story from './story.js';
import './styles.css';

const chapters = story.chapters;
const timeline = story.timeline || story.milestones || [];
const art = ['/images/cafe-night.svg', '/images/dawn.svg', '/images/rain-coffee.svg', '/images/road-night.svg'];
const scene = (i) => art[Math.floor(i / 3) % art.length];
const pdf = '/books/novel-hendra-tasya.pdf';
const num = (n) => String(n).padStart(2, '0');
const route = () => { const m = location.hash.match(/^#\/baca\/(\d{1,2})/); return m ? Math.max(0, Math.min(11, +m[1] - 1)) : null; };

function useSaved(key, start) {
  const [value, update] = useState(() => {
    try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : start; }
    catch { return start; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, update];
}
const Button = ({ children, onClick, className = '', disabled = false, title }) =>
  <button type="button" className={className} onClick={onClick} disabled={disabled} title={title}>{children}</button>;

export default function App() {
  const [index, setIndex] = useState(route);
  const [last, setLast] = useSaved('journeyasya-last', 0);
  const [favorites, setFavorites] = useSaved('journeyasya-favorites', []);
  const [notes, setNotes] = useSaved('journeyasya-notes', {});
  const [finished, setFinished] = useSaved('journeyasya-finished', {});
  const [size, setSize] = useSaved('journeyasya-size', 19);
  const [theme, setTheme] = useSaved('journeyasya-theme', 'sepia');
  const [reflection, setReflection] = useSaved('journeyasya-reflection', 'terima-kasih');
  const [toc, setToc] = useState(false);
  const [settings, setSettings] = useState(false);
  const [letter, setLetter] = useState(false);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef(null);

  function openBook(i) {
    const next = Math.max(0, Math.min(11, i));
    setIndex(next); setLast(next); setToc(false); setSettings(false);
    setProgress(0);
    location.hash = '/baca/' + num(next + 1);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }
  function closeBook() {
    setIndex(null);
    location.hash = 'bab';
    setTimeout(() => document.getElementById('bab')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }
  useEffect(() => {
    const fn = () => setIndex(route());
    addEventListener('hashchange', fn);
    return () => removeEventListener('hashchange', fn);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('is-reading', index !== null);
    return () => document.body.classList.remove('is-reading');
  }, [index]);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [index]);
  useEffect(() => {
    const handler = (e) => {
      if (index === null || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) return;
      if (e.key === 'Escape') { if (toc) setToc(false); else if (settings) setSettings(false); else closeBook(); }
      if (e.key === 'ArrowRight' && index < 11) openBook(index + 1);
      if (e.key === 'ArrowLeft' && index > 0) openBook(index - 1);
    };
    addEventListener('keydown', handler);
    return () => removeEventListener('keydown', handler);
  }, [index, toc, settings]);

  const liked = index !== null && favorites.includes(index);
  const toggleFavorite = () => setFavorites(v => liked ? v.filter(n => n !== index) : [...v, index]);
  function trackReading(e) {
    const node = e.currentTarget;
    const total = node.scrollHeight - node.clientHeight;
    const p = total > 0 ? Math.round(node.scrollTop / total * 100) : 100;
    setProgress(p);
    if (p > 90 && index !== null) setFinished(v => v[index] ? v : { ...v, [index]: true });
  }
  const complete = Object.keys(finished).length;

  if (index !== null) {
    const chapter = chapters[index];
    return <div className={'reader theme-' + theme}>
      <div className="reader-line"><i style={{ width: progress + '%' }} /></div>
      <header className="reader-header">
        <Button className="back-link" onClick={closeBook}><span>←</span><b>Beranda</b></Button>
        <div className="reader-heading">JOURNEYASYA<small>Bab {num(index + 1)} dari 12</small></div>
        <div className="reader-tools">
          <Button title="Daftar isi" onClick={() => setToc(!toc)}>☷</Button>
          <Button title="Simpan bab" onClick={toggleFavorite} className={liked ? 'saved' : ''}>{liked ? '♥' : '♡'}</Button>
          <Button title="Pengaturan membaca" onClick={() => setSettings(!settings)}>Aa</Button>
        </div>
      </header>
      {settings && <div className="settings-box">
        <strong>Atur kenyamanan baca</strong>
        <label>Ukuran huruf</label>
        <div className="settings-buttons"><Button disabled={size <= 16} onClick={() => setSize(n => n - 1)}>A−</Button><span>{size} px</span><Button disabled={size >= 25} onClick={() => setSize(n => n + 1)}>A+</Button></div>
        <label>Tema halaman</label>
        <div className="settings-buttons">{[['paper', 'Terang'], ['sepia', 'Sepia'], ['night', 'Gelap']].map(([value, label]) => <Button key={value} className={theme === value ? 'current' : ''} onClick={() => setTheme(value)}>{label}</Button>)}</div>
      </div>}
      <div className="reader-grid">
        <aside className={'book-toc ' + (toc ? 'open' : '')} aria-label="Daftar isi">
          <div className="toc-title"><span>DAFTAR ISI</span><Button title="Tutup daftar isi" onClick={() => setToc(false)}>×</Button></div>
          <div className="toc-progress">{complete} dari 12 bab selesai <div><i style={{ width: complete / 12 * 100 + '%' }} /></div></div>
          {chapters.map((c, i) => <Button key={c.id} className={'toc-chapter ' + (i === index ? 'selected' : '')} onClick={() => openBook(i)}>
            <span>{num(c.id)}</span><div><strong>{c.title}</strong><small>{c.date}</small></div>{favorites.includes(i) && <i>♥</i>}
          </Button>)}
          <a className="toc-pdf" href={pdf} download>↓ Unduh novel PDF</a>
        </aside>
        {toc && <Button className="toc-overlay" onClick={() => setToc(false)} title="Tutup daftar isi" />}
        <div className="reading-scroll" ref={contentRef} onScroll={trackReading}>
          <article className="paper" style={{ '--reader-font': size + 'px' }}>
            <div className="paper-overline">✳ &nbsp; HENDRA & TASYA &nbsp; ✳</div>
            <header className="paper-title">
              <span>BAB {num(chapter.id)} · NOVEL DIGITAL</span>
              <h1>{chapter.title}</h1>
              <p>{chapter.subtitle}</p>
              <div className="paper-meta">⌖ {chapter.place} &nbsp; · &nbsp; {chapter.date}</div>
            </header>
            <figure className="paper-illustration"><img src={scene(index)} alt={'Ilustrasi artistik suasana ' + chapter.place} /><figcaption>ILUSTRASI SUASANA · BUKAN DOKUMENTASI ASLI</figcaption></figure>
            <div className="prose">
              <p className="first">{chapter.paragraphs[0]}</p>
              <blockquote>“{chapter.quote}”</blockquote>
              {chapter.paragraphs.slice(1).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <section className="note-panel">
              <div className="note-head"><strong>✎ Catatan pinggir buku</strong><small>Disimpan di perangkat ini</small></div>
              <textarea aria-label={'Catatan bab ' + chapter.id} placeholder="Apa yang ingin kamu ingat?" value={notes[chapter.id] || ''} rows={3} onChange={e => setNotes(v => ({ ...v, [chapter.id]: e.target.value }))} />
            </section>
            <div className="end-of-chapter">✳<small>AKHIR BAB {num(chapter.id)}</small></div>
            <section className="up-next"><small>HALAMAN BERIKUTNYA</small><h2>{index < 11 ? chapters[index + 1].title : 'Setiap akhir punya caranya sendiri.'}</h2><p>{index < 11 ? chapters[index + 1].subtitle : 'Terima kasih sudah membaca hingga halaman terakhir.'}</p><Button className="btn-fill" onClick={() => index < 11 ? openBook(index + 1) : closeBook()}>{index < 11 ? 'Lanjut bab berikutnya' : 'Kembali ke beranda'} <span>→</span></Button></section>
          </article>
        </div>
      </div>
      <footer className="reader-footer">
        <Button className="toc-mobile" onClick={() => setToc(true)}>☷ <span>Daftar isi</span></Button>
        <Button disabled={index === 0} onClick={() => openBook(index - 1)}>← <span>Sebelumnya</span></Button>
        <small>{num(index + 1)} / 12</small>
        <Button disabled={index === 11} onClick={() => openBook(index + 1)}><span>Berikutnya</span> →</Button>
      </footer>
    </div>;
  }
  const quotes = { 'terima-kasih': 'Aku bisa mensyukuri kenangan tanpa meminta siapa pun menanggungnya.', 'beri-ruang': 'Mengagumi seseorang juga berarti menghormati ruang dan pilihannya.', 'bertumbuh': 'Meski jalannya berubah, aku ingin terus belajar menjadi lebih baik.' };
  return <div className="app">
    <header className="site-head container">
      <a className="logo" href="#awal"><span>J✳</span><div>journeyasya<small>AN INTERACTIVE STORY</small></div></a>
      <nav aria-label="Navigasi utama"><a href="#cerita">Cerita</a><a href="#linimasa">Linimasa</a><a href="#bab">Daftar bab</a><a href="#surat">Surat</a></nav>
      <a className="pdf-link" href={pdf} download>↓ &nbsp; Novel PDF</a>
    </header>
    <main>
      <section className="hero container" id="awal">
        <div className="hero-copy">
          <div className="eyebrow">✦ &nbsp; HENDRA & TASYA · JULI — NOVEMBER 2026</div>
          <h1>Ada nama yang datang sebagai <em>teman,</em> lalu tinggal sebagai <i>kenangan.</i></h1>
          <p>Semua dimulai dari ajakan ngopi dan sebuah “Bayoohhh”. Sebuah perjalanan tentang kagum, tawa, pertemuan sederhana, dan keberanian menghormati ruang.</p>
          <div className="button-row"><Button className="btn-fill" onClick={() => openBook(last)}>{last ? 'Lanjut Bab ' + num(last + 1) : 'Mulai membaca'} <span>→</span></Button><a className="btn-outline" href="#linimasa">Lihat linimasa ↓</a></div>
          <div className="micro">12 BAB NOVEL &nbsp; ✦ &nbsp; 14 MOMEN &nbsp; ✦ &nbsp; 1 PERJALANAN</div>
        </div>
        <div className="book-stage"><div className="cover"><img src="/images/cafe-night.svg" alt="Ilustrasi dua orang di kafe pegunungan pada malam hari" /><div className="cover-fade" /><div className="cover-words"><small>THE JOURNEY OF HENDRA & TASYA</small><strong>Where<br />our story<br /><em>begins.</em></strong><span>SEBUAH CERITA YANG BELUM SELESAI &nbsp; 2026</span></div></div><p>Untuk segala hal yang pernah ada, dan pelajaran yang tinggal.</p></div>
      </section>
      <section id="cerita" className="intro container">
        <div className="eyebrow">01 — PROLOG</div>
        <div className="intro-grid"><h2>Beberapa cerita tidak dimulai dengan kata <em>“cinta”.</em></h2><p>Kadang bermula dari obrolan sederhana, kopi yang mulai dingin, dan kalimat yang membuat seseorang tersenyum. Hendra mulai mengagumi Tasya sebagai seseorang yang memiliki dunia, cerita, dan pilihan sendiri.</p></div>
        <div className="gallery"><figure><img src="/images/cafe-night.svg" alt="Ilustrasi suasana kafe malam" /><figcaption>01 &nbsp; MALAM YANG MENGINGATKAN</figcaption></figure><figure><img src="/images/rain-coffee.svg" alt="Ilustrasi dua cangkir kopi dan surat saat hujan" /><figcaption>02 &nbsp; HARI YANG PERLAHAN BERUBAH</figcaption></figure></div>
        <blockquote>“Ada orang yang datang sebagai pertemuan. Ada pula yang perlahan tinggal sebagai ingatan.”<small>— BAB PERTAMA</small></blockquote>
      </section>
      <section id="linimasa" className="timeline-area">
        <div className="container"><div className="eyebrow">02 — LINIMASA</div><h2>Waktu berjalan.<br /><em>Kenangan tinggal.</em></h2><p className="section-lead">Pilih salah satu momen untuk membuka bab terkait. Ini rangkuman tanggal dan kenangan yang pernah dibagikan, bukan transkrip lengkap.</p>
        <div className="moments">{timeline.map((m,i) => <Button key={m.id || i} className="moment" onClick={() => openBook(m.chapter - 1)}><span className="moment-count">{num(i + 1)}</span><small>{m.day || m.date} · 2026</small><h3>{m.name || m.title}</h3><p>{m.detail || 'Satu momen yang diingat dalam perjalanan mereka.'}</p><b>Buka kisah &nbsp; ↗</b></Button>)}</div><div className="swipe-label">GESER LINIMASA UNTUK MELIHAT SEMUA MOMEN &nbsp; ← →</div></div>
      </section>
      <section id="bab" className="chapters container">
        <div className="eyebrow">03 — NOVEL DIGITAL</div><h2>Dua belas bab.<br /><em>Satu perjalanan.</em></h2><p className="section-lead">Mulai dari awal, atau buka bab yang ingin dikenang. Penanda favorit, catatan, ukuran teks dan pilihan tema akan tersimpan di browser.</p>
        <div className="chapter-cards">{chapters.map((c,i) => <Button key={c.id} className="chapter-card" onClick={() => openBook(i)}><div className="chapter-image"><img src={scene(i)} alt="" loading="lazy" /><span>{num(c.id)}</span>{favorites.includes(i) && <b>♥</b>}</div><div className="chapter-copy"><small>BAB {num(c.id)} &nbsp; · &nbsp; {c.date}</small><h3>{c.title}</h3><p>{c.subtitle}</p><strong>BACA BAB &nbsp; →</strong></div></Button>)}</div>
      </section>
      <section id="surat" className="letter-area">
        <div className="container letter-grid"><div className="letter-text"><div className="eyebrow">04 — UNSENT LETTER</div><h2>Ada kata-kata yang tak harus dikirim untuk <em>berarti.</em></h2><p>Surat fiksi dari sudut pandang Hendra. Tidak harus dikirim untuk berharga, tidak mengharapkan balasan.</p><Button className="btn-fill" onClick={() => setLetter(!letter)}>{letter ? 'Tutup surat' : 'Buka surat'} &nbsp; ✉</Button></div><div className={'envelope ' + (letter ? 'opened' : '')}><div className="letter-paper"><small>UNTUK TASYA,</small><p>Terima kasih atas tawa, percakapan, dan perhatian kecil yang pernah ada. Aku ingin menghormati pilihan dan ruangmu, sekalipun jalannya berbeda.</p><i>— Hendra, dalam cerita ini</i></div><div className="envelope-back" /><div className="envelope-front" /><div className="envelope-flap" /><div className="seal">✳</div></div></div>
      </section>
      <section className="ending container">
        <div className="eyebrow">05 — PILIH REFLEKSI</div><h2>Apa yang dipelajari<br /><em>Hendra?</em></h2><p className="section-lead">Pilihan ini hanya mengubah renungan Hendra, bukan keputusan maupun perasaan Tasya.</p>
        <div className="reflections">{[['terima-kasih','Mensyukuri yang pernah ada'],['beri-ruang','Menghormati ruang dan pilihan'],['bertumbuh','Terus bertumbuh']].map(([id,t]) => <Button key={id} className={reflection === id ? 'active' : ''} onClick={() => setReflection(id)}>{reflection === id ? '●' : '○'} &nbsp; {t}</Button>)}</div>
        <blockquote>“{quotes[reflection]}”</blockquote>
      </section>
      <section className="pdf-area"><div className="container pdf-grid"><div><div className="eyebrow">06 — KEEP THE STORY</div><h2>Bawa cerita ini<br /><em>ke mana pun.</em></h2><p>Unduh novel PDF dan simpan di Files iPhone untuk dibaca kembali.</p></div><a className="btn-fill" href={pdf} download="novel-hendra-tasya.pdf">↓ &nbsp; Download PDF &nbsp; →</a></div></section>
    </main>
    <footer className="site-footer container"><div><b>journeyasya ✳</b><p>One chapter at a time, with care.</p></div><p>Karya naratif dari sudut pandang Hendra. Deskripsi perasaan, suasana dan sebagian adegan adalah dramatisasi, bukan pernyataan tentang perasaan Tasya. Pertimbangkan privasi sebelum membagikan.</p><small>MADE WITH CARE · 2026</small></footer>
    <nav className="mobile-nav" aria-label="Navigasi ponsel"><a href="#awal">⌂<span>Beranda</span></a><a href="#linimasa">◷<span>Linimasa</span></a><Button onClick={() => openBook(last)}>▤<span>Baca</span></Button><a href="#bab">☷<span>Bab</span></a><a href={pdf} download>↓<span>PDF</span></a></nav>
  </div>;
}
