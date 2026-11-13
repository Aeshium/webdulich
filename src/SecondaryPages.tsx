import { useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Camera,
  Compass,
  Headphones,
  Scan,
  Sparkles,
} from 'lucide-react'
import type { SitePage } from './SiteChrome'
import ImageMotion from './ImageMotion'

const stories = [
  {
    category: 'THIÊN NHIÊN',
    title: 'Một ngày trôi theo dòng nước Ninh Bình',
    excerpt: 'Len qua miền núi đá, lắng nghe nhịp chèo khua giữa thung xanh.',
    image: 'photo-1501785888041-af3ef285b470',
    read: '06 PHÚT',
  },
  {
    category: 'VĂN HÓA',
    title: 'Hội An, khi phố lên đèn',
    excerpt: 'Những sắc màu, tiếng rao và câu chuyện cũ còn ở lại bên sông.',
    image: 'photo-1528181304800-259b08848526',
    read: '04 PHÚT',
  },
  {
    category: 'ẨM THỰC',
    title: 'Hương vị theo chân người miền Trung',
    excerpt: 'Từ căn bếp nhỏ đến mâm cơm ấm, ẩm thực là một cách để nhớ.',
    image: 'photo-1504674900247-0877df9cc836',
    read: '05 PHÚT',
  },
  {
    category: 'CHUYỆN ĐƯỜNG XA',
    title: 'Qua những khúc quanh Hà Giang',
    excerpt: 'Cung đường mở ra núi cao, chợ phiên và những cuộc gặp tình cờ.',
    image: 'photo-1464822759023-fed622ff2c3b',
    read: '07 PHÚT',
  },
]

const experiences = [
  {
    number: '01',
    type: 'KHÔNG GIAN 360°',
    title: 'Đi giữa miền non nước',
    description: 'Mở rộng góc nhìn, chậm rãi khám phá cảnh sắc Ninh Bình.',
    image: 'photo-1501785888041-af3ef285b470',
  },
  {
    number: '02',
    type: 'ÂM THANH & CÂU CHUYỆN',
    title: 'Nghe Hội An kể chuyện',
    description: 'Một chuyến tản bộ bằng âm thanh giữa những con phố cổ.',
    image: 'photo-1528181304800-259b08848526',
  },
  {
    number: '03',
    type: 'BỘ SƯU TẬP HÌNH ẢNH',
    title: 'Sắc xanh miền biển',
    description: 'Gom những khoảnh khắc trong veo dọc theo bờ biển Việt Nam.',
    image: 'photo-1510414842594-a61c69b5ae57',
  },
]

const solutionItems = [
  ['01', 'Miền đất & thiên nhiên', 'Từ núi cao, rừng sâu đến những miền biển đầy nắng.', 'photo-1464822759023-fed622ff2c3b', 'thien-nhien'],
  ['02', 'Di sản & văn hóa', 'Chạm vào ký ức địa phương qua kiến trúc và chuyện kể.', 'photo-1528181304800-259b08848526', 'di-san'],
  ['03', 'Ẩm thực bản địa', 'Khám phá văn hóa vùng miền qua hương vị và con người.', 'photo-1504674900247-0877df9cc836', 'am-thuc'],
]

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
}: {
  index: string
  label: string
  title: ReactNode
  description: string
  image: string
}) {
  return (
    <section className="subpage-hero section-shell">
      <div className="subpage-copy">
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
          {solutionItems.map(([number, title, description, image, id]) => (
            <article id={id} className="solution-card" data-reveal key={number}>
              <ImageCard image={image} alt={title} />
              <div className="solution-card-meta"><span>{number} / LUMI COLLECTION</span><ArrowUpRight size={17} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <ConnectBanner />
    </>
  )
}

function ExperiencesPage({ onOpenExperience }: { onOpenExperience: () => void }) {
  const [filter, setFilter] = useState('TẤT CẢ')
  const filters = ['TẤT CẢ', 'KHÔNG GIAN 360°', 'ÂM THANH & CÂU CHUYỆN', 'BỘ SƯU TẬP HÌNH ẢNH']
  const visible = experiences.filter((item) => filter === 'TẤT CẢ' || item.type === filter)

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
          <p>Khám phá thử các định dạng trải nghiệm. Mỗi nội dung mở ra ngay trên trang, không cần đăng nhập.</p>
        </div>
        <div className="filter-row" aria-label="Lọc trải nghiệm">
          {filters.map((item) => (
            <button type="button" className={filter === item ? 'filter-chip is-selected' : 'filter-chip'} onClick={() => setFilter(item)} key={item}>{item}</button>
          ))}
        </div>
        <div className="experience-grid">
          {visible.map((item) => (
            <article className="experience-card" data-reveal key={item.number}>
              <button type="button" className="experience-card-button" onClick={onOpenExperience} aria-label={`Mở trải nghiệm ${item.title}`}>
                <ImageCard image={item.image} alt={item.title} />
                <span className="experience-card-arrow"><ArrowUpRight size={19} /></span>
              </button>
              <span className="card-kicker">{item.number} / {item.type}</span>
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

function BlogPage() {
  const [filter, setFilter] = useState('TẤT CẢ')
  const categories = ['TẤT CẢ', ...new Set(stories.map((story) => story.category))]
  const visibleStories = stories.filter((story) => filter === 'TẤT CẢ' || story.category === filter)

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
              <div className="story-meta"><span>{story.category}</span><span>{story.read}</span></div>
              <h3>{story.title}</h3>
              <p>{story.excerpt}</p>
              <a href="/dang-ky" className="text-link">Theo dấu câu chuyện <ArrowUpRight size={15} /></a>
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
          <p>Các tính năng được giới thiệu ở mức ý tưởng. Trải nghiệm mô hình 3D chuyên sâu sẽ được bổ sung sau.</p>
        </div>
        <div className="feature-list">
          {[
            [Scan, 'Không gian mở rộng', 'Hình ảnh toàn cảnh giúp bạn quan sát cảnh sắc từ nhiều góc độ.'],
            [Headphones, 'Âm thanh bản địa', 'Tiếng gió, tiếng nước và lời kể tạo nên cảm nhận gần gũi về một miền đất.'],
            [Camera, 'Những câu chuyện bằng hình', 'Bộ sưu tập ảnh được biên tập theo chủ đề, địa danh và cảm hứng.'],
            [Compass, 'Dẫn lối khám phá', 'Các điểm chạm nội dung gợi ý cho bạn những hướng khám phá tiếp theo.'],
          ].map(([Icon, title, description], index) => {
            const FeatureIcon = Icon as typeof Scan
            return (
              <article className="feature-row" data-reveal key={String(title)}>
                <span className="feature-row-number">0{index + 1}</span>
                <span className="feature-row-icon"><FeatureIcon size={20} /></span>
                <h3>{String(title)}</h3>
                <p>{String(description)}</p>
                <Sparkles size={16} />
              </article>
            )
          })}
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
  onOpenExperience,
}: {
  page: SitePage
  onOpenExperience: () => void
}) {
  if (page === 'solutions') return <SolutionsPage />
  if (page === 'experiences') return <ExperiencesPage onOpenExperience={onOpenExperience} />
  if (page === 'features') return <FeaturesPage />
  if (page === 'blog') return <BlogPage />
  if (page === 'register') return <RegisterPage />
  return null
}
