// 인쇄 모드에서 갤러리 모달을 평탄화해 인라인으로 그리는 섹션.
// 각 카테고리(갤러리)별로 제목 + 요약 + 사진 그리드를 차례로 펼침.
export function InlineGallery({ galleries }) {
  if (!galleries || galleries.length === 0) return null;

  return (
    <div className="pcard-block print-galleries">
      <h4 className="pcard-blocktitle">화면 모음</h4>
      {galleries.map((g) => (
        <section key={g.id} className="print-gal-section">
          <header className="print-gal-head">
            <h5 className="print-gal-title">{g.title}</h5>
            {g.summary && <p className="print-gal-summary">{g.summary}</p>}
          </header>
          <div className="print-gal-grid">
            {g.items.map((item, i) => (
              <figure key={i} className="print-gal-item">
                <div className="print-gal-imgwrap">
                  <img src={item.src} alt={item.caption} loading="eager" />
                </div>
                <figcaption className="print-gal-cap">
                  {item.tag && <span className="print-gal-tag">{item.tag}</span>}
                  <p>{item.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
