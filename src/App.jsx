import { useState, useRef, useEffect } from "react";

const COMPANIES = [
  { no:1, sector:"공부방·홈스쿨", company:"㈜금성출판사", brand:"푸르넷", url:"https://purunet.kumsung.co.kr" },
  { no:2, sector:"초등교육", company:"㈜대교", brand:"눈높이", url:"https://www.noonnoppi.com" },
  { no:3, sector:"중국어학습프로그램", company:"㈜대교", brand:"차이홍", url:"https://www.caihong.co.kr" },
  { no:4, sector:"영유아교육", company:"㈜한솔교육", brand:"신기한한글나라", url:"https://www.eduhansol.com" },
  { no:5, sector:"중등이러닝", company:"㈜금성출판사", brand:"푸르넷에듀", url:"https://purunet.kumsung.co.kr" },
  { no:6, sector:"수학프랜차이즈", company:"(주)미래엔에듀플러스", brand:"미래엔수학", url:"https://www.miraenmath.co.kr" },
  { no:7, sector:"영어프랜차이즈", company:"㈜삼성출판사", brand:"삼성영어셀레나", url:"https://www.samsungenglish.com" },
  { no:8, sector:"어린이전집", company:"㈜아람북스", brand:"문어빵", url:"https://www.arambooks.com" },
  { no:9, sector:"유·초등 교양도서", company:"㈜도서출판성우", brand:"릴라팝/뒤집기", url:"https://www.sungwoobook.com" },
  { no:10, sector:"독서토론논술", company:"㈜한솔교육", brand:"플라톤독서토론논술", url:"https://www.jrplaton.com" },
  { no:11, sector:"초등수학앱", company:"㈜매쓰마스터", brand:"일프로연산", url:"https://www.1promath.com" },
  { no:12, sector:"학습교구", company:"스콜라스㈜", brand:"스콜라스", url:"https://www.scholas.co.kr" },
  { no:13, sector:"유아미술", company:"㈜놀작에듀", brand:"크키크", url:"https://www.crekic.com" },
  { no:14, sector:"중등교육", company:"㈜대교", brand:"대교써밋", url:"https://summit.daekyo.com" },
  { no:15, sector:"초중등 영어교육", company:"㈜공터영어", brand:"공터영어", url:"https://www.oter.co.kr" },
  { no:16, sector:"유아자연교구", company:"루시", brand:"루시키드", url:"https://lucykid.com" },
  { no:17, sector:"수학전문책방", company:"데카르트수학책방", brand:"데카르트수학책방", url:"https://www.instagram.com/descartes_mathbookshop" },
];

const QUICK = [
  "수상 후 브랜드 인지도를 높이는 방법은?",
  "SNS 마케팅 전략을 알려주세요",
  "학부모 신뢰도 강화 방법은?",
  "경쟁 브랜드 차별화 전략은?",
  "수상 스토리텔링 방법은?",
  "온·오프라인 통합 브랜드 관리 전략은?",
];

function buildSystem(c) {
  return `당신은 2026년 여성신문 제21회 학부모가 뽑은 교육브랜드대상 수상 기업 전용 브랜드 전략 AI 컨설턴트입니다.

현재 상담 기업:
- 수상 부문: ${c.sector}
- 기업명: ${c.company}
- 브랜드명: ${c.brand}
- 홈페이지: ${c.url}

전문 영역: 수상 후 브랜드 자산 극대화, 학부모 신뢰 마케팅, SNS·디지털 전략, 경쟁 차별화, PR·스토리텔링, 위기 대응.

응답 방식: ${c.sector} 부문 특성에 맞는 실질적 액션 플랜. 단기(3개월)/중기(1년)/장기(3년) 로드맵 포함. 한국어, 전문적이고 따뜻한 톤.`;
}

export default function App() {
  const [company, setCompany] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("select");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const filtered = COMPANIES.filter(c =>
    c.brand.includes(search) || c.company.includes(search) || c.sector.includes(search)
  );

  const select = (c) => {
    setCompany(c);
    setMessages([{ role:"assistant", content:`안녕하세요! **${c.company}** · **${c.brand}** 브랜드 전략 AI입니다. 🏆\n\n2026 여성신문 교육브랜드대상 **${c.sector}** 부문 수상을 축하드립니다! 수상 브랜드의 가치를 어떻게 극대화할지 함께 전략을 수립해 드리겠습니다. 무엇이 궁금하신가요?` }]);
    setView("chat");
  };

  const send = async (text) => {
    const t = text || input.trim();
    if (!t || loading) return;
    setInput("");
    const next = [...messages, { role:"user", content:t }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystem(company),
          messages: next.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "응답을 받을 수 없습니다.";
      setMessages([...next, { role:"assistant", content:reply }]);
    } catch {
      setMessages([...next, { role:"assistant", content:"오류가 발생했습니다. 다시 시도해주세요." }]);
    } finally { setLoading(false); }
  };

  const md = (t) => t
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br/>")
    .replace(/^/,"<p>").replace(/$/,"</p>");

  return (
    <div style={{ fontFamily:"'Noto Sans KR',sans-serif", maxWidth:860, margin:"0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}
        .d1{animation:blink 1.2s 0s infinite}.d2{animation:blink 1.2s .2s infinite}.d3{animation:blink 1.2s .4s infinite}
        .card:hover{border-color:#185FA5!important;box-shadow:0 2px 10px rgba(10,61,98,.15)!important;transform:translateY(-1px)}
        .card{transition:all .15s ease;cursor:pointer}
        .qbtn:hover{background:#e8f0fe!important;color:#0a3d62!important}
        strong{font-weight:700}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background:"#0a3d62", borderRadius:16, padding:"2rem 2rem 1.5rem", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ display:"inline-block", background:"rgba(255,215,0,.2)", border:"1px solid rgba(255,215,0,.5)", color:"#FFD700", fontSize:11, padding:"3px 12px", borderRadius:20, marginBottom:8 }}>
          🏆 2026 · 제21회 여성신문 학부모가 뽑은 교육브랜드대상
        </div>
        <h1 style={{ color:"#fff", fontSize:22, fontWeight:700, margin:"0 0 4px", lineHeight:1.3 }}>브랜드 전략 AI 컨설턴트</h1>
        <p style={{ color:"rgba(255,255,255,.7)", fontSize:13 }}>수상 브랜드 전용 · 17개 기업 맞춤 전략 제공</p>
        <span style={{ position:"absolute", right:24, top:"50%", transform:"translateY(-50%)", fontSize:56, opacity:.12 }}>🎯</span>
      </div>

      {view === "select" && (
        <>
          {/* Stats */}
          <div style={{ display:"flex", gap:0, background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, marginBottom:16, overflow:"hidden" }}>
            {[["17","수상 브랜드"],["17","교육 부문"],["21","회차"],["AI","맞춤 전략"]].map(([n,l],i) => (
              <div key={i} style={{ flex:1, textAlign:"center", padding:"14px 0", borderRight:i<3?"1px solid #e0e0e0":"none" }}>
                <div style={{ fontSize:22, fontWeight:700, color:"#0a3d62" }}>{n}</div>
                <div style={{ fontSize:11, color:"#888" }}>{l}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize:14, color:"#666", marginBottom:10 }}>브랜드를 선택하면 맞춤 AI 전략 상담이 시작됩니다.</p>
          <input
            style={{ width:"100%", padding:"10px 14px", fontSize:14, border:"1.5px solid #ddd", borderRadius:8, marginBottom:12, outline:"none", boxSizing:"border-box" }}
            placeholder="브랜드명, 기업명, 부문으로 검색..."
            value={search} onChange={e=>setSearch(e.target.value)}
          />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:10 }}>
            {filtered.map(c => (
              <div key={c.no} className="card"
                style={{ background:"#fff", border:"1px solid #e8e8e8", borderRadius:12, padding:"14px 16px" }}
                onClick={()=>select(c)}>
                <span style={{ fontSize:11, color:"#185FA5", background:"#E6F1FB", padding:"2px 8px", borderRadius:20, display:"inline-block", marginBottom:6, fontWeight:500 }}>{c.sector}</span>
                <p style={{ fontSize:16, fontWeight:700, color:"#1a1a2e", marginBottom:2 }}>{c.brand}</p>
                <p style={{ fontSize:12, color:"#888" }}>{c.company}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "chat" && company && (
        <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:16, overflow:"hidden" }}>
          {/* Chat header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background:"#f8f9fa", borderBottom:"1px solid #e8e8e8" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"#0a3d62", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🏆</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:15, color:"#1a1a2e" }}>{company.brand}</p>
              <p style={{ fontSize:12, color:"#888" }}>{company.company} · {company.sector} 수상</p>
            </div>
            <button onClick={()=>setView("select")}
              style={{ fontSize:12, padding:"5px 12px", border:"1px solid #ddd", borderRadius:20, background:"#fff", cursor:"pointer", color:"#666" }}>
              ← 브랜드 변경
            </button>
          </div>

          {/* Messages */}
          <div style={{ height:440, overflowY:"auto", padding:18, display:"flex", flexDirection:"column", gap:12, background:"#fdfdfd" }}>
            {messages.map((m,i) => (
              m.role === "user"
                ? <div key={i} style={{ alignSelf:"flex-end", background:"#0a3d62", color:"#fff", borderRadius:"16px 16px 4px 16px", padding:"10px 14px", maxWidth:"75%", fontSize:14, lineHeight:1.6 }}>{m.content}</div>
                : <div key={i} style={{ alignSelf:"flex-start", background:"#f0f4f8", color:"#1a1a2e", borderRadius:"16px 16px 16px 4px", padding:"10px 14px", maxWidth:"86%", fontSize:14, lineHeight:1.7, border:"1px solid #e4e9f0" }}
                    dangerouslySetInnerHTML={{__html:md(m.content)}}/>
            ))}
            {loading && (
              <div style={{ alignSelf:"flex-start", background:"#f0f4f8", borderRadius:"16px 16px 16px 4px", padding:"10px 14px", display:"flex", gap:5, border:"1px solid #e4e9f0" }}>
                {[1,2,3].map(n=><div key={n} className={`d${n}`} style={{ width:8, height:8, borderRadius:"50%", background:"#999" }}/>)}
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Quick prompts */}
          <div style={{ padding:"8px 16px", display:"flex", gap:6, flexWrap:"wrap", borderTop:"1px solid #eee", background:"#fff" }}>
            {QUICK.map((q,i)=>(
              <button key={i} className="qbtn" disabled={loading}
                style={{ fontSize:12, padding:"5px 10px", border:"1px solid #ddd", borderRadius:20, background:"#fff", cursor:"pointer", color:"#555" }}
                onClick={()=>send(q)}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display:"flex", gap:8, padding:"10px 16px", borderTop:"1px solid #eee", background:"#f8f9fa" }}>
            <input
              style={{ flex:1, padding:"10px 14px", border:"1.5px solid #ddd", borderRadius:8, fontSize:14, outline:"none" }}
              value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
              placeholder="브랜드 전략에 대해 질문하세요..." disabled={loading}
            />
            <button onClick={()=>send()} disabled={loading}
              style={{ padding:"10px 20px", background:"#0a3d62", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:600, opacity:loading?.6:1 }}>
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
