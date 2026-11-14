import { useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
} from 'lucide-react'
import type { SitePage } from './SiteChrome'
import ImageMotion from './ImageMotion'
import {
  experienceItems,
  featureItems,
  resolveContentRoute,
  solutionItems,
  storyItems,
  type EditorialSection,
  type ExperienceItem,
  type StoryItem,
  type SolutionItem,
} from './editorialContent'

export function HeadlineLine({ children }: { children: ReactNode }) {
  return (
    <span className="headline-line">
      <span className="headline-line-inner">{children}</span>
    </span>
  )
}

function ImageCard({
  image,
  alt,
  className = '',
}: {
  image: string
  alt: string
  className?: string
}) {
  return (
    <ImageMotion className={`editorial-image ${className}`}>
      <img
        src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=1400&q=85`}
        alt={alt}
        loading="lazy"
      />
      <span className="image-motion-light" aria-hidden="true" />
    </ImageMotion>
  )
}

function PageIntro({
  index,
  label,
  title,
  description,
  image,
  backHref,
  backLabel,
}: {
  index: string
  label: string
  title: ReactNode
  description: string
  image: string
  backHref?: string
  backLabel?: string
}) {
  return (
    <section className="subpage-hero section-shell">
      <div className="subpage-copy">
        {backHref && (
          <a className="detail-back-link" href={backHref}>
            <ArrowLeft size={14} /> {backLabel}
          </a>
        )}
        <span className="eyebrow"><span className="eyebrow-line" /> {label}</span>
        <h1 data-text-reveal>{title}</h1>
        <p>{description}</p>
        <a className="round-link" href="#page-content">
          <span><ArrowDown size={17} /></span>
          <span>ĐI TIẾP<br />KHÁM PHÁ</span>
        </a>
        <span className="subpage-index">LUMI JOURNAL · {index}</span>
      </div>
      <ImageCard image={image} alt={label} className="subpage-hero-image" />
    </section>
  )
}

function SolutionsPage() {
  return (
    <>
      <PageIntro
        index="01"
        label="NHỮNG CÁCH KỂ VIỆT NAM"
        title={<><HeadlineLine>Mỗi miền</HeadlineLine><HeadlineLine>đất</HeadlineLine><HeadlineLine>mở ra một</HeadlineLine><HeadlineLine><em>câu chuyện.</em></HeadlineLine></>}
        description="Khám phá những sắc thái khác nhau của Việt Nam qua hành trình hình ảnh, âm thanh và tương tác."
        image="photo-1470770841072-f978cf4d019e"
      />
      <section id="page-content" className="content-section section-shell">
        <div className="section-marker" data-reveal><span className="marker-number">01</span><span className="marker-line" /><span className="eyebrow">CHỌN ĐIỀU BẠN MUỐN KHÁM PHÁ</span></div>
        <div className="editorial-heading" data-reveal>
          <h2 data-text-reveal><HeadlineLine>Nhìn gần hơn.</HeadlineLine><HeadlineLine><em>Cảm sâu hơn.</em></HeadlineLine></h2>
          <p>Mỗi bộ sưu tập là một cánh cửa dẫn vào vẻ đẹp thiên nhiên, di sản và đời sống Việt Nam.</p>
        </div>
        <div className="solution-grid">
          {solutionItems.map((item) => (
            <a id={item.slug} className="solution-card" data-reveal href={`/solutions/${item.slug}`} key={item.slug}>
              <ImageCard image={item.image} alt={item.title} />
              <div className="solution-card-meta"><span>{item.number} / LUMI COLLECTION</span><ArrowUpRight size={17} /></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="card-action">KHÁM PHÁ CHỦ ĐỀ <ArrowUpRight size={14} /></span>
            </a>
          ))}
        </div>
        <div className="destination-highlights" id="diem-den">
          <div className="editorial-heading" data-reveal>
            <h2 data-text-reveal><HeadlineLine>Hai miền đất,</HeadlineLine><HeadlineLine><em>hai nhịp kể.</em></HeadlineLine></h2>
            <p>Mở thêm những lát cắt về Huế và miền Tây — nơi di sản, sông nước và đời sống gặp nhau.</p>
          </div>
          <div className="destination-highlight-grid">
            {experienceItems.filter((item) => item.slug === 'hue' || item.slug === 'mien-tay').map((item) => (
              <a className="destination-card" data-reveal href={`/experiences/${item.slug}`} key={item.slug}>
                <ImageCard image={item.image} alt={item.destination} />
                <span className="card-kicker">{item.region} · {item.type}</span>
                <h3>{item.destination}</h3>
                <p>{item.description}</p>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>
      <ConnectBanner />
    </>
  )
}

function ExperiencesPage() {
  const [filter, setFilter] = useState('TẤT CẢ')
  const filters = ['TẤT CẢ', ...new Set(experienceItems.map((item) => item.type))]
  const visible = experienceItems.filter((item) => filter === 'TẤT CẢ' || item.type === filter)

  return (
    <>
      <PageIntro
        index="02"
        label="MỞ RA, LẮNG NGHE, CHẠM VÀO"
        title={<><HeadlineLine>Không chỉ nhìn.</HeadlineLine><HeadlineLine><em>Hãy bước vào.</em></HeadlineLine></>}
        description="Những lát cắt đa phương tiện đưa bạn gần hơn với vùng đất và con người Việt Nam."
        image="photo-1518509562904-e7ef99cdcc86"
      />
      <section id="page-content" className="content-section section-shell">
        <div className="section-marker" data-reveal><span className="marker-number">02</span><span className="marker-line" /><span className="eyebrow">CHỌN MỘT TRẢI NGHIỆM</span></div>
        <div className="editorial-heading" data-reveal>
          <h2 data-text-reveal><HeadlineLine>Một chạm,</HeadlineLine><HeadlineLine><em>một miền nhớ.</em></HeadlineLine></h2>
          <p>Mỗi địa danh có một trang kể chuyện riêng bằng hình ảnh và ghi chép biên tập; chưa yêu cầu tài khoản hay thiết bị đặc biệt.</p>
        </div>
        <div className="filter-row" aria-label="Lọc trải nghiệm">
          {filters.map((item) => (
            <button type="button" className={filter === item ? 'filter-chip is-selected' : 'filter-chip'} onClick={() => setFilter(item)} key={item}>{item}</button>
          ))}
        </div>
        <div className="experience-grid" id="cau-chuyen">
          {visible.map((item) => (
            <article className="experience-card" data-reveal id={item.slug === 'ninh-binh' ? '360' : undefined} key={item.slug}>
              <a className="experience-card-button" href={`/experiences/${item.slug}`} aria-label={`Mở câu chuyện ${item.title}`}>
                <ImageCard image={item.image} alt={item.title} />
                <span className="experience-card-arrow"><ArrowUpRight size={19} /></span>
              </a>
              <span className="card-kicker">{item.number} / {item.region} · {item.type}</span>
              <a className="experience-card-title-link" href={`/experiences/${item.slug}`}><h3>{item.title}</h3></a>
              <p>{item.description}</p>
              <a className="card-action" href={`/experiences/${item.slug}`}>MỞ CÂU CHUYỆN <ArrowUpRight size={14} /></a>
            </article>
          ))}
        </div>
      </section>
      <ConnectBanner />
    </>
  )
}

function BlogPage() {
  const [filter, setFilter] = useState('TẤT CẢ')
  const categories = ['TẤT CẢ', ...new Set(storyItems.map((story) => story.category))]
  const visibleStories = storyItems.filter((story) => filter === 'TẤT CẢ' || story.category === filter)

  return (
    <>
      <PageIntro
        index="03"
        label="TẠP CHÍ LUMI"
        title={<><HeadlineLine>Những điều</HeadlineLine><HeadlineLine>đáng để</HeadlineLine><HeadlineLine><em>kể lại.</em></HeadlineLine></>}
        description="Ghi chép từ những cung đường, góc bếp và cuộc gặp gỡ làm nên một Việt Nam nhiều sắc màu."
        image="photo-1470770841072-f978cf4d019e"
      />
      <section id="page-content" className="content-section section-shell">
        <div className="section-marker" data-reveal><span className="marker-number">03</span><span className="marker-line" /><span className="eyebrow">NHẬT KÝ ĐƯỜNG XA</span></div>
        <div className="editorial-heading" data-reveal>
          <h2 data-text-reveal><HeadlineLine>Đọc một chút.</HeadlineLine><HeadlineLine><em>Mơ thật xa.</em></HeadlineLine></h2>
          <p>Những câu chuyện ngắn về cảnh sắc, con người và văn hóa Việt Nam.</p>
        </div>
        <div className="filter-row" aria-label="Lọc bài viết">
          {categories.map((category) => (
            <button type="button" className={filter === category ? 'filter-chip is-selected' : 'filter-chip'} onClick={() => setFilter(category)} key={category}>{category}</button>
          ))}
        </div>
        <div className="story-grid">
          {visibleStories.map((story, index) => (
            <article className={`story-card ${index === 0 && filter === 'TẤT CẢ' ? 'story-card-featured' : ''}`} data-reveal key={story.title}>
              <ImageCard image={story.image} alt={story.title} />
              <div className="story-meta"><span>{story.category} · {story.destination}</span><span>{story.read}</span></div>
              <a className="story-title-link" href={`/blog/${story.slug}`}><h3>{story.title}</h3></a>
              <p>{story.excerpt}</p>
              <a href={`/blog/${story.slug}`} className="text-link">Đọc câu chuyện <ArrowUpRight size={15} /></a>
            </article>
          ))}
        </div>
      </section>
      <ConnectBanner />
    </>
  )
}

function FeaturesPage() {
  return (
    <>
      <PageIntro
        index="04"
        label="CÔNG CỤ KỂ CHUYỆN"
        title={<><HeadlineLine>Công nghệ,</HeadlineLine><HeadlineLine>để cảm xúc</HeadlineLine><HeadlineLine><em>dẫn đường.</em></HeadlineLine></>}
        description="Từng định dạng được lựa chọn để đưa bạn lại gần hơn với vẻ đẹp và câu chuyện của Việt Nam."
        image="photo-1518509562904-e7ef99cdcc86"
      />
      <section id="page-content" className="content-section section-shell">
        <div className="section-marker" data-reveal><span className="marker-number">04</span><span className="marker-line" /><span className="eyebrow">NHỮNG LỚP TRẢI NGHIỆM</span></div>
        <div className="editorial-heading" data-reveal>
          <h2 data-text-reveal><HeadlineLine>Chạm vào</HeadlineLine><HeadlineLine><em>từng chi tiết.</em></HeadlineLine></h2>
          <p>Một bộ sưu tập hình ảnh tĩnh giới thiệu những cách LUMI kể chuyện về điểm đến — chưa có tour 360° hay mô hình 3D tương tác.</p>
        </div>
        <div className="feature-card-grid">
          {featureItems.map((item) => (
            <article className="feature-card" data-reveal key={item.number}>
              <ImageCard image={item.image} alt={item.title} />
              <span className="card-kicker">{item.number} / LUMI STORY TOOLS</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <ConnectBanner />
    </>
  )
}

function TwoLineTitle({ title }: { title: string }) {
  const words = title.split(/\s+/)
  const splitAt = Math.ceil(words.length / 2)
  return (
    <>
      <HeadlineLine>{words.slice(0, splitAt).join(' ')}</HeadlineLine>
      <HeadlineLine><em>{words.slice(splitAt).join(' ')}</em></HeadlineLine>
    </>
  )
}

function EditorialBlocks({ sections }: { sections: EditorialSection[] }) {
  return (
    <div className="editorial-block-list">
      {sections.map((section, index) => (
        <section className={section.image ? 'editorial-block has-image' : 'editorial-block'} data-reveal key={section.title}>
          <div className="editorial-block-copy">
            <span className="block-index">0{index + 1} / LUMI JOURNAL</span>
            <h2 data-text-reveal>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {section.image && <ImageCard image={section.image} alt={section.title} />}
        </section>
      ))}
    </div>
  )
}

function DetailMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="section-marker" data-reveal>
      <span className="marker-number">{number}</span>
      <span className="marker-line" />
      <span className="eyebrow">{label}</span>
    </div>
  )
}

function SolutionDetailPage({ item }: { item: SolutionItem }) {
  const related = experienceItems.filter((experience) => item.relatedExperiences.includes(experience.slug))

  return (
    <>
      <PageIntro
        index={`${item.number} / GIẢI PHÁP`}
        label="MỘT CÁCH KỂ VIỆT NAM"
        title={<TwoLineTitle title={item.title} />}
        description={item.description}
        image={item.image}
        backHref="/solutions"
        backLabel="TẤT CẢ GIẢI PHÁP"
      />
      <section id="page-content" className="detail-content section-shell">
        <DetailMarker number={item.number} label="CÂU CHUYỆN CỦA CHỦ ĐỀ" />
        <p className="detail-lead" data-reveal>{item.intro}</p>
        <EditorialBlocks sections={item.sections} />
        <RelatedExperiences items={related} heading="Những hành trình liên quan" />
      </section>
      <ConnectBanner />
    </>
  )
}

function RelatedExperiences({ items, heading }: { items: ExperienceItem[]; heading: string }) {
  return (
    <section className="related-section">
      <div className="editorial-heading" data-reveal>
        <h2 data-text-reveal><HeadlineLine>Đi tiếp</HeadlineLine><HeadlineLine><em>câu chuyện.</em></HeadlineLine></h2>
        <p>{heading}</p>
      </div>
      <div className="related-link-grid">
        {items.map((item) => (
          <a className="related-link-card" data-reveal href={`/experiences/${item.slug}`} key={item.slug}>
            <ImageCard image={item.image} alt={item.destination} />
            <span className="card-kicker">{item.region} · {item.type}</span>
            <h3>{item.title}</h3>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  )
}

function ExperienceDetailPage({ item }: { item: ExperienceItem }) {
  const relatedStories = storyItems.filter((story) => story.experienceSlug === item.slug)

  return (
    <>
      <PageIntro
        index={`${item.number} / TRẢI NGHIỆM`}
        label={`${item.region} · ${item.type}`}
        title={<TwoLineTitle title={item.title} />}
        description={item.description}
        image={item.image}
        backHref="/experiences"
        backLabel="TẤT CẢ TRẢI NGHIỆM"
      />
      <section id="page-content" className="detail-content section-shell">
        <DetailMarker number={item.number} label={`MỘT CÂU CHUYỆN TỪ ${item.destination.toUpperCase()}`} />
        <p className="detail-lead" data-reveal>{item.intro}</p>
        <EditorialBlocks sections={item.sections} />
        <section className="detail-gallery" data-reveal>
          <div className="editorial-heading">
            <h2 data-text-reveal><HeadlineLine>Một vài</HeadlineLine><HeadlineLine><em>khung cảnh.</em></HeadlineLine></h2>
            <p>Những hình ảnh gợi mở thêm sắc thái của {item.destination}.</p>
          </div>
          <div className="detail-gallery-grid">
            {item.gallery.map((image, index) => (
              <ImageCard image={image} alt={`${item.destination} — khung cảnh ${index + 1}`} key={`${image}-${index}`} />
            ))}
          </div>
        </section>
        {relatedStories.length > 0 && (
          <div className="story-followup">
            <span className="eyebrow">ĐỌC THÊM TỪ TẠP CHÍ LUMI</span>
            {relatedStories.map((story) => (
              <a className="text-link" href={`/blog/${story.slug}`} key={story.slug}>
                {story.title} <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        )}
      </section>
      <ConnectBanner />
    </>
  )
}

function StoryDetailPage({ story }: { story: StoryItem }) {
  const experience = story.experienceSlug
    ? experienceItems.find((item) => item.slug === story.experienceSlug)
    : undefined
  const relatedStories = storyItems.filter((item) => item.slug !== story.slug).slice(0, 2)

  return (
    <>
      <PageIntro
        index="03 / TẠP CHÍ LUMI"
        label={`${story.category} · ${story.destination}`}
        title={<TwoLineTitle title={story.title} />}
        description={story.excerpt}
        image={story.image}
        backHref="/blog"
        backLabel="TẤT CẢ BÀI VIẾT"
      />
      <section id="page-content" className="detail-content section-shell">
        <DetailMarker number={story.number} label={`MỘT GHI CHÉP TỪ ${story.destination.toUpperCase()}`} />
        <div className="story-detail-meta" data-reveal>
          <span>{story.category}</span>
          <span>{story.read} ĐỌC</span>
        </div>
        <p className="detail-lead" data-reveal>{story.excerpt}</p>
        <EditorialBlocks sections={story.sections} />
        {experience && (
          <a className="story-experience-link" data-reveal href={`/experiences/${experience.slug}`}>
            <ImageCard image={experience.image} alt={experience.destination} />
            <span>
              <span className="card-kicker">TIẾP TỤC KHÁM PHÁ</span>
              <strong>{experience.title}</strong>
            </span>
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        )}
        <div className="related-story-links">
          <span className="eyebrow">CÓ THỂ BẠN CŨNG THÍCH</span>
          {relatedStories.map((item) => (
            <a className="text-link" href={`/blog/${item.slug}`} key={item.slug}>
              {item.title} <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
      </section>
      <ConnectBanner />
    </>
  )
}

function RegisterPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <>
      <PageIntro
        index="05"
        label="GỬI LỜI NHẮN CHO LUMI"
        title={<><HeadlineLine>Hãy kể chúng tôi</HeadlineLine><HeadlineLine>điều bạn <em>muốn khám phá.</em></HeadlineLine></>}
        description="Chia sẻ miền đất bạn yêu thích. Biểu mẫu này chỉ minh họa giao diện — không gửi hay lưu dữ liệu."
        image="photo-1470770841072-f978cf4d019e"
      />
      <section id="page-content" className="register-section section-shell">
        <div className="register-aside" data-reveal>
          <div className="section-marker"><span className="marker-number">05</span><span className="marker-line" /><span className="eyebrow">MỘT LỜI MỜI KẾT NỐI</span></div>
          <h2 data-text-reveal><HeadlineLine>Một câu hỏi</HeadlineLine><HeadlineLine>có thể mở ra</HeadlineLine><HeadlineLine><em>một hành trình.</em></HeadlineLine></h2>
          <p>Chọn chủ đề bạn yêu thích và gửi lời nhắn thử nghiệm. Không cần tạo tài khoản, không có đặt tour hay đặt phòng.</p>
          <span className="register-note"><AudioLines size={17} /> TĨNH LẶNG · RIÊNG TƯ · KHÔNG LƯU DỮ LIỆU</span>
        </div>
        <form className="interest-form" onSubmit={handleSubmit} data-reveal>
          <span className="form-kicker">BIỂU MẪU MINH HỌA · 01 / 01</span>
          <label>Họ và tên<input name="name" type="text" autoComplete="name" placeholder="Tên của bạn" required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" placeholder="ban@email.com" required /></label>
          <label>Miền đất bạn muốn khám phá
            <select name="interest" defaultValue="" required>
              <option value="" disabled>Chọn một chủ đề</option>
              <option>Thiên nhiên & miền núi</option>
              <option>Di sản & văn hóa</option>
              <option>Ẩm thực địa phương</option>
              <option>Biển & hải đảo</option>
            </select>
          </label>
          <label>Lời nhắn<textarea name="message" rows={3} placeholder="Điều gì khiến bạn tò mò?" /></label>
          <button type="submit" className="form-submit">{sent ? 'ĐÃ XEM LỜI NHẮN' : 'GỬI LỜI NHẮN'} <ArrowUpRight size={17} /></button>
          <p className={sent ? 'form-disclaimer is-confirmed' : 'form-disclaimer'} role="status">
            {sent ? 'Cảm ơn bạn đã ghé LUMI. Đây là bản minh họa: thông tin không được gửi đi hoặc lưu lại.' : 'Bản demo tĩnh — nội dung biểu mẫu không được gửi đến máy chủ.'}
          </p>
        </form>
      </section>
    </>
  )
}

function ConnectBanner() {
  return (
    <section className="connect-banner section-shell" data-reveal>
      <div><span className="eyebrow">MỘT CÂU CHUYỆN ĐANG CHỜ BẠN</span><h2 data-text-reveal><HeadlineLine>Chọn một miền đất</HeadlineLine><HeadlineLine><em>để bắt đầu.</em></HeadlineLine></h2></div>
      <a className="cta-button" href="/dang-ky">Gửi lời nhắn <ArrowRight size={17} /></a>
    </section>
  )
}

export function SecondaryPage({
  page,
  pathname,
}: {
  page: SitePage
  pathname: string
}) {
  const route = resolveContentRoute(pathname)
  if (route?.collection === 'solutions') {
    const item = solutionItems.find((solution) => solution.slug === route.slug)
    if (item) return <SolutionDetailPage item={item} />
  }
  if (route?.collection === 'experiences') {
    const item = experienceItems.find((experience) => experience.slug === route.slug)
    if (item) return <ExperienceDetailPage item={item} />
  }
  if (route?.collection === 'blog') {
    const story = storyItems.find((item) => item.slug === route.slug)
    if (story) return <StoryDetailPage story={story} />
  }

  if (page === 'solutions') return <SolutionsPage />
  if (page === 'experiences') return <ExperiencesPage />
  if (page === 'features') return <FeaturesPage />
  if (page === 'blog') return <BlogPage />
  if (page === 'register') return <RegisterPage />
  return null
}
