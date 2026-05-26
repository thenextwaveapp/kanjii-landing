import Link from 'next/link';
import LandingEffects from '@/components/LandingEffects';
import WaitlistForm from '@/components/WaitlistForm';

export default function Home() {
  return (
    <>
      <LandingEffects />
      {/* NAV */}
      <nav>
        <div className="nav-logo">Kanj<span>ii</span> <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: '14px', color: '#555', fontWeight: '400' }}>漢字</span></div>
        <Link href="/blog" className="nav-cta">Blog</Link>
      </nav>
      
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title">
              Learn Japanese<br />the way it's <span style={{ color: 'var(--accent)' }}> actually used.</span>
            </h1>
            <p className="hero-sub">
              Kanjii teaches you to write Japanese like a native. <strong>Write your way to fluency.</strong>
            </p>
            <p className="hero-tag">Coming soon to iOS & Android</p>
            <div className="hero-actions">
              <a href="#waitlist" className="btn-primary">
                Join the Waitlist
              </a>
            </div>
          </div>
      
          {/* Phone mockup */}
          <div className="phone-wrap">
            <div className="phone-glow"></div>
            <div className="phone" id="phone">
              <div className="phone-notch"></div>
      
              {/* Screen 1: Home */}
              <div className="phone-screen" id="screen1">
                <div className="phone-topbar">
                  <div>
                    <div className="phone-logo">Kanj<span>ii</span></div>
                    <div className="phone-greeting">Good evening, Alex</div>
                    <div className="phone-streak">7 day streak 🔥</div>
                  </div>
                  <div className="phone-avatar">A</div>
                </div>
      
                <div className="phone-stats">
                  <div className="phone-stat">
                    <div className="phone-stat-val">142</div>
                    <div className="phone-stat-label">Kanji</div>
                  </div>
                  <div className="phone-stat-div"></div>
                  <div className="phone-stat">
                    <div className="phone-stat-val">831</div>
                    <div className="phone-stat-label">Correct</div>
                  </div>
                  <div className="phone-stat-div"></div>
                  <div className="phone-stat">
                    <div className="phone-stat-val">12</div>
                    <div className="phone-stat-label">Best streak</div>
                  </div>
                </div>
      
                <div className="phone-card-primary">
                  <div className="phone-card-icon">✏️</div>
                  <div className="phone-card-title">Practice</div>
                  <div className="phone-card-sub">Type Japanese sentences to earn kanji</div>
                </div>
      
                <div className="phone-card-secondary">
                  <div className="phone-card-icon" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>漢</div>
                  <div className="phone-card-title">Study</div>
                  <div className="phone-card-sub">Review your kanji collection</div>
                </div>
      
                <div className="phone-card-secondary">
                  <div className="phone-card-icon">📚</div>
                  <div className="phone-card-title">Basics</div>
                  <div className="phone-card-sub">Learn hiragana, katakana & how Japanese works</div>
                </div>
              </div>
      
              {/* Screen 2: Typing practice */}
              <div className="phone-screen-2" id="screen2">
                <div style={{ height: '20px' }}></div>
                <div className="sentence-display">
                  <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>N4 · Daily Life</div>
                  <div className="sentence-jp" id="sentence-jp">毎日日本語を<br />勉強しています</div>
                  <div className="sentence-en" id="sentence-en">I study Japanese every day</div>
                </div>
                <div style={{ position: 'relative' }}>
                  <div className="grade-badge" id="grade-badge">○</div>
                  <div className="typing-bar">
                    <span className="typing-text" id="typing-text"></span><span className="typing-cursor"></span>
                  </div>
                </div>
              </div>
      
            </div>
          </div>
        </div>
      </section>
      
      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track" id="marquee">
          <div className="marquee-item"><span className="marquee-jp">毎日</span><span className="marquee-en">every day</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">勉強</span><span className="marquee-en">study</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">電車</span><span className="marquee-en">train</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">食べる</span><span className="marquee-en">to eat</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">学校</span><span className="marquee-en">school</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">友達</span><span className="marquee-en">friend</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">水</span><span className="marquee-en">water</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">仕事</span><span className="marquee-en">work</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">東京</span><span className="marquee-en">Tokyo</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">日本語</span><span className="marquee-en">Japanese</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">漢字</span><span className="marquee-en">kanji</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">音楽</span><span className="marquee-en">music</span><span className="marquee-dot">●</span></div>
          {/* duplicate for seamless loop */}
          <div className="marquee-item"><span className="marquee-jp">毎日</span><span className="marquee-en">every day</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">勉強</span><span className="marquee-en">study</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">電車</span><span className="marquee-en">train</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">食べる</span><span className="marquee-en">to eat</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">学校</span><span className="marquee-en">school</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">友達</span><span className="marquee-en">friend</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">水</span><span className="marquee-en">water</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">仕事</span><span className="marquee-en">work</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">東京</span><span className="marquee-en">Tokyo</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">日本語</span><span className="marquee-en">Japanese</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">漢字</span><span className="marquee-en">kanji</span><span className="marquee-dot">●</span></div>
          <div className="marquee-item"><span className="marquee-jp">音楽</span><span className="marquee-en">music</span><span className="marquee-dot">●</span></div>
        </div>
      </div>
      
      {/* WHAT MAKES IT DIFFERENT */}
      <section id="how">
        <div className="section-inner">
          <p className="section-tag reveal">The difference</p>
          <h2 className="section-title reveal">No flashcards.<br />No videos.<br /><span style={{ color: 'var(--accent)' }}>Real sentences.</span></h2>
          <p className="section-sub reveal">Most language learning apps teach you to recognize Japanese kanji in isolation. Kanjii teaches you to produce it — the way you'll actually produce it every day.</p>
      
          <div className="diff-grid reveal">
            <div className="diff-card accent-card">
              <div className="diff-num" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>IME</div>
              <div className="diff-title">Type with a real Japanese keyboard</div>
              <div className="diff-desc">Every answer is typed using the same input method native speakers use. Not multiple choice. Not word banks. If you can type it, you know it.</div>
            </div>
            <div className="diff-card">
              <div className="diff-num">漢</div>
              <div className="diff-title">Your personal kanji library</div>
              <div className="diff-desc">Every kanji you encounter builds a personal profile — readings, meanings, context, mastery state. Search by kanji, meaning, hiragana, or romaji.</div>
            </div>
            <div className="diff-card">
              <div className="diff-num">N5→N1</div>
              <div className="diff-title">JLPT-structured progression</div>
              <div className="diff-desc">Real benchmark levels from absolute beginner to near-native. Track your horizon across all five JLPT levels as kanji accumulate.</div>
            </div>
            <div className="diff-card accent-card">
              <div className="diff-num" style={{ fontFamily: '\'Noto Serif JP\',sans-serif' }}>文</div>
              <div className="diff-title">Sentences in context, not isolation</div>
              <div className="diff-desc">Tap any kanji to reveal furigana and meaning. Full Neural2 text-to-speech at adjustable speed. Language as it actually exists.</div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="divider"></div>
      
      {/* FEATURES */}
      <section className="features-section">
        <div className="section-inner">
          <p className="section-tag reveal">Everything you need</p>
          <h2 className="section-title reveal">Built for the whole journey.</h2>
          <p className="section-sub reveal">Every tool in Kanjii works together — practice, review, drill, listen, repeat.</p>
          <div className="features-grid reveal">
            <div className="feature-card">
              <span className="feature-icon">✏️</span>
              <div className="feature-title">Sentence Practice</div>
              <div className="feature-desc">Type complete Japanese sentences using your phone's IME. The same way millions of Japanese type everyday.</div>
            </div>
            <div className="feature-card">
              <span className="feature-icon" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: 'var(--accent)' }}>漢</span>
              <div className="feature-title">Kanji Library</div>
              <div className="feature-desc">A searchable dictionary for of over 2,000 kanji you will encounter. See readings, meanings, stroke order, and example sentences.</div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📚</span>
              <div className="feature-title">Structured Learning</div>
              <div className="feature-desc">Curated learning paths — N5 Foundation, Travel Essentials, Business Japanese — with ordered lessons and circular progress tracking.</div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <div className="feature-title">Targeted Kanji Drills</div>
              <div className="feature-desc">Automatically identifies your weakest kanji and builds targeted practice sessions around them.</div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔊</span>
              <div className="feature-title">Neural2 Text-to-Speech</div>
              <div className="feature-desc">Google's Neural2 voices — the same quality used in Google Translate. Adjustable speed. Cached audio. Works in silent mode.</div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌐</span>
              <div className="feature-title">21+ Topic Domains</div>
              <div className="feature-desc">Japanese for every part of your life. Filter by JLPT level and configure sessions from 5 to 20 rounds.</div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="divider"></div>
      
      {/* MASTERY SYSTEM */}
      <section>
        <div className="section-inner">
          <p className="section-tag reveal">Intelligent grading</p>
          <h2 className="section-title reveal">Mastery that<br /><span style={{ color: 'var(--accent)' }}>can slip.</span></h2>
          <p className="section-sub reveal">Kanjii tracks every kanji you've seen, flags what's slipping, and builds targeted drills around your weak spots.</p>
      
          <div className="mastery-demo reveal">
            <div className="mastery-card perfect">
              <span className="mastery-symbol">○</span>
              <div className="mastery-label">Mastered</div>
              <div className="mastery-desc">Perfect match. Animated hanamaru celebration.</div>
              <div className="mastery-score">100% similarity</div>
            </div>
            <div className="mastery-card good">
              <span className="mastery-symbol">△</span>
              <div className="mastery-label">Learning</div>
              <div className="mastery-desc">Close enough to count. Still improving.</div>
              <div className="mastery-score">≥80% similarity</div>
            </div>
            <div className="mastery-card wrong">
              <span className="mastery-symbol">×</span>
              <div className="mastery-label">Needs Work</div>
              <div className="mastery-desc">Below threshold. Flagged for weak kanji drills.</div>
              <div className="mastery-score">{'<'}80% similarity</div>
            </div>
      
          </div>
        </div>
      </section>
      
      <div className="divider"></div>
      
      {/* IME EXPLAINER */}
      <section className="ime-section" id="how-ime">
        <div className="section-inner">
          <p className="section-tag reveal">How Japanese is actually typed</p>
          <h2 className="section-title reveal">The kana keyboard.<br /><span style={{ color: 'var(--accent)' }}>Learn a real skill.</span></h2>
          <p className="section-sub reveal">On a phone, Japanese is typed by tapping kana on a flick keyboard — then selecting the right kanji from suggestions. That moment of recognition is the skill that matters. Kanjii trains exactly that.</p>
      
          <div className="ime-flow reveal">
            <div className="ime-step">
              <div className="ime-step-num">Step 01 — Input</div>
              <div className="ime-step-content"><span className="kana">た</span></div>
              <div className="ime-step-desc">Tap た on the kana flick keyboard — the same keyboard Japanese people use every day</div>
            </div>
            <div className="ime-arrow">→</div>
            <div className="ime-step">
              <div className="ime-step-num">Step 02 — Extend</div>
              <div className="ime-step-content"><span className="kana">たべる</span></div>
              <div className="ime-step-desc">Continue tapping kana to build the reading of the word you want</div>
            </div>
            <div className="ime-arrow">→</div>
            <div className="ime-step">
              <div className="ime-step-num">Step 03 — Select</div>
              <div className="ime-step-content"><span className="kanji">食べる</span></div>
              <div className="ime-step-desc">Pick the right kanji from the suggestion bar — the critical knowledge moment</div>
            </div>
          </div>
      
      
        </div>
      </section>
      
      <div className="divider"></div>
      
      {/* VS COMPARISON */}
      <section className="compare-section">
        <div className="section-inner">
          <p className="section-tag reveal">vs. everything else</p>
          <h2 className="section-title reveal">Built only for Japanese.<br /><span style={{ color: 'var(--accent)' }}>The best experience.</span></h2>
          <p className="section-sub reveal">Most apps treat Japanese like any other language — but Japanese has multiple writing systems, thousands of kanji, and a learning curve that demands a dedicated approach.<br /><br /> Kanjii is built only for the Japanese language.</p>
          <div className="reveal" style={{ overflowX: 'auto', marginTop: '64px' }}>
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="highlight">Kanjii</th>
                  <th>Flashcard apps</th>
                  <th>Other Kanji apps</th>
                  <th>General language apps</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>IME typing practice</td>
                  <td className="highlight"><span className="check">✓</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="cross">✗</span></td>
                </tr>
                <tr>
                  <td>Personal kanji library</td>
                  <td className="highlight"><span className="check">✓</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="partial">partial</span></td>
                  <td><span className="cross">✗</span></td>
                </tr>
                <tr>
                  <td>Animated stroke order</td>
                  <td className="highlight"><span className="check">✓</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="check">✓</span></td>
                  <td><span className="cross">✗</span></td>
                </tr>
                <tr>
                  <td>Sentence-level practice</td>
                  <td className="highlight"><span className="check">✓</span></td>
                  <td><span className="partial">partial</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="check">✓</span></td>
                </tr>
                <tr>
                  <td>Romaji/kana/kanji search</td>
                  <td className="highlight"><span className="check">✓</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="partial">partial</span></td>
                  <td><span className="cross">✗</span></td>
                </tr>
                <tr>
                  <td>Built for Japanese only</td>
                  <td className="highlight"><span className="check">✓</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="check">✓</span></td>
                  <td><span className="cross">✗</span></td>
                </tr>
                <tr>
                  <td>Neural2 TTS voices</td>
                  <td className="highlight"><span className="check">✓</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="cross">✗</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      <div className="divider"></div>
      
      {/* CTA */}
      <section className="cta-section" id="waitlist">
        <div className="cta-inner">
          <span className="cta-jp reveal">頑張って</span>
          <h2 className="cta-title reveal">Learn Japanese <br />the way it's<span style={{ color: 'var(--accent)' }}><br />actually used.</span></h2>
          <p className="cta-sub reveal">Be the first to know when Kanjii launches.</p>
          <WaitlistForm />
        </div>
      </section>
      
      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Kanj<span>ii</span></div>
        <div className="footer-links">
          <Link href="/blog" className="footer-link">Blog</Link>
          <Link href="/support" className="footer-link">Support</Link>
        </div>
        <div className="footer-text">Built for Japanese learners, by a Japanese learner. 頑張って！</div>
        <div className="footer-text">© 2026 Kanjii</div>
      </footer>
    </>
  );
}
