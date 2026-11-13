import {
  ArrowUpRight,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'

export type SitePage =
  | 'home'
  | 'solutions'
  | 'experiences'
  | 'features'
  | 'blog'
  | 'register'

const pageTitles: Record<SitePage, string> = {
  home: 'Trang chủ',
  solutions: 'Giải pháp',
  experiences: 'Trải nghiệm',
  features: 'Tính năng',
  blog: 'Tạp chí',
  register: 'Đăng ký trải nghiệm',
}

const mainLinks: Array<{ page: Exclude<SitePage, 'home' | 'register'>; href: string }> = [
  { page: 'solutions', href: '/solutions' },
  { page: 'experiences', href: '/experiences' },
  { page: 'features', href: '/fonctionnalites' },
  { page: 'blog', href: '/blog' },
]

function Brand() {
  return (
    <span className="brand-lockup">
      <span className="brand-mark"><span /></span>
      <span className="brand-name">LUMI<span className="brand-dot">.</span></span>
      <small>VIỆT NAM</small>
    </span>
  )
}

export function SiteHeader({
  page,
  theme,
  onToggleTheme,
}: {
  page: SitePage
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}) {
  return (
    <header className="site-header">
      <a href="/" className="brand" aria-label="LUMI Việt Nam — Trang chủ">
        <Brand />
      </a>
      <input className="nav-toggle-input" type="checkbox" id="nav-toggle" aria-label="Mở menu" />
      <label className="menu-toggle" htmlFor="nav-toggle" aria-label="Bật hoặc tắt menu">
        <Menu className="menu-icon" size={19} />
        <X className="close-icon" size={19} />
      </label>
      <nav className="main-nav" aria-label="Điều hướng chính">
        {mainLinks.map(({ page: item, href }) => (
          <a
            href={href}
            className={page === item ? 'nav-link is-current' : 'nav-link'}
            key={item}
          >
            {pageTitles[item]}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
          title={theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <a href="/dang-ky" className="header-cta">
          Đăng ký trải nghiệm <ArrowUpRight size={15} />
        </a>
      </div>
    </header>
  )
}

const footerGroups = [
  {
    title: 'KHÁM PHÁ',
    links: [
      ['Giải pháp', '/solutions'],
      ['Điểm đến', '/solutions#diem-den'],
      ['Di sản & văn hóa', '/solutions#di-san'],
      ['Thiên nhiên', '/solutions#thien-nhien'],
      ['Ẩm thực', '/solutions#am-thuc'],
    ],
  },
  {
    title: 'TRẢI NGHIỆM',
    links: [
      ['Tạp chí hành trình', '/experiences'],
      ['Chuyện kể Việt Nam', '/experiences#cau-chuyen'],
      ['Không gian 360°', '/experiences#360'],
      ['Tính năng', '/fonctionnalites'],
      ['Câu hỏi thường gặp', '/#cau-hoi'],
    ],
  },
  {
    title: 'VỀ LUMI',
    links: [
      ['Tạp chí', '/blog'],
      ['Lời mời kết nối', '/dang-ky'],
      ['Tuyên ngôn', '/#hanh-trinh'],
      ['Liên hệ', '/dang-ky'],
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href="/" className="footer-wordmark" aria-label="LUMI — Về đầu trang">
        LUMI<span>.</span>
      </a>
      <div className="footer-main">
        <div className="footer-note">
          <span className="footer-kicker">KỂ CHUYỆN VIỆT NAM BẰNG CẢM XÚC</span>
          <p>Những miền đất thân quen,<br />qua một góc nhìn mới.</p>
        </div>
        {footerGroups.map((group) => (
          <nav className="footer-group" aria-label={group.title} key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map(([label, href]) => (
              <a href={href} key={label}>{label}</a>
            ))}
          </nav>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2026 LUMI JOURNAL · MỘT VIỆT NAM, VẠN ĐIỀU MUỐN KỂ.</span>
        <span>ĐÂY LÀ TRANG GIỚI THIỆU — KHÔNG BÁN TOUR HAY NHẬN ĐẶT PHÒNG.</span>
        <a href="/dang-ky">GỬI LỜI NHẮN <ArrowUpRight size={13} /></a>
      </div>
    </footer>
  )
}
