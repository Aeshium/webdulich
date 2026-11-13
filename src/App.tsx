import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Camera,
  Compass,
  Headphones,
  MoveUpRight,
  Play,
  Scan,
  Sparkles as SparklesIcon,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { HeadlineLine, SecondaryPage } from './SecondaryPages'
import ImageMotion from './ImageMotion'
import { SiteFooter, SiteHeader, type SitePage } from './SiteChrome'
import 'swiper/css'

gsap.registerPlugin(ScrollTrigger)

type RouteScramble = {
  progress: { value: number }
  render: () => void
  cleanup: () => void
}

type RouteMask = {
  host: HTMLElement
  mask: HTMLSpanElement
  images: HTMLImageElement[]
  imageOpacities: string[]
}

const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?+*/'

function createRouteScramble(target: HTMLElement): RouteScramble | null {
  const bounds = target.getBoundingClientRect()
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    if (!node.parentElement?.closest('.route-mask')) textNodes.push(node)
  }

  const glyphs: { element: HTMLSpanElement; value: string }[] = []
  textNodes.forEach((node) => {
    const text = node.textContent ?? ''
    let offset = 0
    Array.from(text).forEach((character) => {
      const start = offset
      offset += character.length
      if (/\s/.test(character)) return

      const range = document.createRange()
      range.setStart(node, start)
      range.setEnd(node, offset)
      const rect = range.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const glyph = document.createElement('span')
      glyph.className = 'route-scramble-glyph'
      glyph.textContent = character
      glyph.style.left = `${rect.left - bounds.left}px`
      glyph.style.top = `${rect.top - bounds.top}px`
      glyph.style.width = `${rect.width}px`
      glyph.style.height = `${rect.height}px`
      glyphs.push({ element: glyph, value: character })
    })
  })

  if (!glyphs.length) return null

  const originalColor = target.style.color
  const overlay = document.createElement('span')
  overlay.className = 'route-scramble'
  overlay.setAttribute('aria-hidden', 'true')
  overlay.style.color = getComputedStyle(target).color
  glyphs.forEach(({ element }) => overlay.append(element))

  const positionedByScramble = getComputedStyle(target).position === 'static'
  if (positionedByScramble) target.classList.add('route-scramble-host-positioned')
  target.style.color = 'transparent'
  target.append(overlay)

  const progress = { value: 0 }
  const render = () => {
    const settledCount = Math.floor(progress.value * glyphs.length)
    glyphs.forEach(({ element }, index) => {
      if (index < settledCount) return
      element.textContent =
        scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)]
    })
  }
  render()

  return {
    progress,
    render,
    cleanup: () => {
      overlay.remove()
      target.style.color = originalColor
      if (positionedByScramble) target.classList.remove('route-scramble-host-positioned')
    },
  }
}

const destinations = [
  {
    number: '01',
    name: 'Hà Giang',
    region: 'ĐÔNG BẮC',
    description: 'Chạm mây trên cung đường đá, lắng nghe nhịp sống bản làng.',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=85',
    tag: 'ĐƯỜNG CHÂN TRỜI',
  },
  {
    number: '02',
    name: 'Hội An',
    region: 'MIỀN TRUNG',
    description: 'Một miền ký ức vàng ươm bên dòng sông Hoài yên ả.',
    image:
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1400&q=85',
    tag: 'NHỊP SỐNG DI SẢN',
  },
  {
    number: '03',
    name: 'Ninh Bình',
    region: 'BẮC BỘ',
    description: 'Mở lối giữa những dãy núi đá và miền sông nước xanh trong.',
    image:
      'https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=1400&q=85',
    tag: 'THIÊN NHIÊN KỂ CHUYỆN',
  },
  {
    number: '04',
    name: 'Phú Quốc',
    region: 'NAM BỘ',
    description: 'Đón nắng cuối ngày trên hòn đảo ngọc giữa biển trời.',
    image:
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=85',
    tag: 'MỘT CHÚT BIỂN XANH',
  },
]

const questions = [
  {
    question: 'LUMI là một nền tảng đặt tour hay đặt phòng?',
    answer:
      'Không. LUMI là landing page giới thiệu du lịch Việt Nam qua các định dạng đa phương tiện. Trang không bán tour, không nhận đặt phòng hay thu thập thông tin thanh toán.',
  },
  {
    question: 'Tôi cần cài ứng dụng để trải nghiệm không?',
    answer:
      'Không cần. Những hình ảnh, câu chuyện và trải nghiệm tương tác trên trang được thiết kế để khám phá trực tiếp trên trình duyệt.',
  },
  {
    question: 'Trải nghiệm 3D có dùng được trên điện thoại?',
    answer:
      'Có. Giao diện được thiết kế tương thích với nhiều kích thước màn hình. Bạn có thể chạm, vuốt và khám phá nội dung ngay trên thiết bị của mình.',
  },
  {
    question: 'Trang có tài khoản, backend hay lưu dữ liệu cá nhân không?',
    answer:
      'Không. Đây là website giới thiệu tĩnh phía trình duyệt, không có đăng ký, đăng nhập, dashboard, cơ sở dữ liệu hay API.',
  },
]

function ExperienceModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="experience-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Đóng">
          <X size={20} />
        </button>
        <img
          src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=90"
          alt="Những đảo đá vôi nhô lên giữa làn nước xanh ở Vịnh Hạ Long"
        />
        <div className="modal-caption">
          <span className="eyebrow">VỊNH HẠ LONG · MIỀN DI SẢN</span>
          <h2 id="modal-title">Nơi đá kể chuyện.</h2>
          <p>
            Thuyền lướt giữa làn nước xanh và núi đá trùng điệp. Mỗi góc nhìn
            lại mở ra một câu chuyện khác của miền di sản.
          </p>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(0)
  const [experienceOpen, setExperienceOpen] = useState(false)
  const [page, setPage] = useState<SitePage>(() => getCurrentPage())
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.localStorage.getItem('lumi-theme') === 'dark' ? 'dark' : 'light',
  )
  const swiperRef = useRef<SwiperInstance | null>(null)
  const routeTransitioning = useRef(false)
  const experienceClose = () => setExperienceOpen(false)

  useEffect(() => {
    let navigating = false
    const applyRoute = (url: URL, historyMode: 'push' | 'replace' | 'none') => {
      if (historyMode === 'replace') history.replaceState(null, '', url)
      if (historyMode === 'push') history.pushState(null, '', url)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      setPage(getCurrentPage())
      const menuToggle = document.querySelector<HTMLInputElement>('#nav-toggle')
      if (menuToggle) menuToggle.checked = false
      requestAnimationFrame(() => {
        if (url.hash) {
          document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView()
        }
        ScrollTrigger.refresh()
      })
    }
    const waitForTimeline = (timeline: gsap.core.Timeline) =>
      new Promise<void>((resolve) => timeline.eventCallback('onComplete', resolve))
    const waitForFrame = () =>
      new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
    const waitForPaint = async () => {
      await waitForFrame()
      await waitForFrame()
    }
    const clearMasks = (entries: RouteMask[]) =>
      entries.forEach(({ host, mask, images, imageOpacities }) => {
        mask.remove()
        host.classList.remove('route-mask-host', 'route-mask-host-positioned')
        images.forEach((image, index) => {
          image.style.opacity = imageOpacities[index] ?? ''
        })
      })
    const transitionRoute = async (
      url: URL,
      historyMode: 'push' | 'replace' | 'none' = 'push',
    ) => {
      if (navigating) return
      navigating = true
      routeTransitioning.current = true
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reducedMotion) {
        applyRoute(url, historyMode)
        routeTransitioning.current = false
        navigating = false
        return
      }

      let outgoingMasks: RouteMask[] = []
      let incomingMasks: RouteMask[] = []
      let incomingScrambles: RouteScramble[] = []
      try {
      const outgoingHeadings = gsap.utils.toArray<HTMLElement>(
        'main .hero h1, main .subpage-copy h1',
      )
      const outgoingHeadingLines = outgoingHeadings.flatMap((heading) =>
        gsap.utils.toArray<HTMLElement>('.headline-line-inner', heading),
      )
      const outgoingCopy = gsap.utils.toArray<HTMLElement>(
        'main .hero-copy > .eyebrow, main .hero-description, main .topline-note, main .subpage-copy > .eyebrow, main .subpage-copy > p',
      )
      const getMaskTargets = () => {
        const inViewport = (element: HTMLElement) => {
          const bounds = element.getBoundingClientRect()
          return (
            bounds.width > 0 &&
            bounds.height > 0 &&
            bounds.top < window.innerHeight &&
            bounds.bottom > 0 &&
            bounds.left < window.innerWidth &&
            bounds.right > 0
          )
        }
        return gsap.utils
          .toArray<HTMLElement>('main .image-motion')
          .filter(inViewport)
      }
      const prepareMasks = (targets: HTMLElement[]) =>
        targets.map((host) => {
          host.classList.add('route-mask-host')
          if (getComputedStyle(host).position === 'static') {
            host.classList.add('route-mask-host-positioned')
          }
          const mask = document.createElement('span')
          mask.className = 'route-mask'
          mask.setAttribute('aria-hidden', 'true')
          host.append(mask)
          const images = gsap.utils.toArray<HTMLImageElement>('img', host)
          return {
            host,
            mask,
            images,
            imageOpacities: images.map((image) => image.style.opacity),
          }
        })
      const waitForMaskImages = (entries: RouteMask[]) =>
        Promise.all(
          entries.flatMap(({ images }) =>
            images.map(async (image) => {
              image.loading = 'eager'
              if (!image.complete) {
                await new Promise<void>((resolve) => {
                  const finish = () => resolve()
                  image.addEventListener('load', finish, { once: true })
                  image.addEventListener('error', finish, { once: true })
                  if (image.complete) finish()
                })
              }
              if (!image.naturalWidth) {
                console.error(`Route transition image failed to load: ${image.currentSrc}`)
                return
              }
              try {
                await image.decode()
              } catch (error) {
                console.error(`Route transition image failed to decode: ${image.currentSrc}`, error)
              }
            }),
          ),
        )
      const outgoingIntroElements = gsap.utils.toArray<HTMLElement>(
        'main .hero-copy > :not(h1), main .subpage-copy > :not(h1)',
      )
      gsap.killTweensOf([...outgoingHeadingLines, ...outgoingCopy, ...outgoingIntroElements])
      const outgoingHeroPhoto = document.querySelector<HTMLElement>('.hero-photo')
      if (outgoingHeroPhoto) {
        gsap.killTweensOf(outgoingHeroPhoto)
        gsap.set(outgoingHeroPhoto, { clipPath: 'inset(0 0 0 0)' })
      }
      outgoingMasks = prepareMasks(getMaskTargets())
      gsap.set(
        outgoingMasks.map(({ mask }) => mask),
        { scaleX: 0, transformOrigin: 'right center' },
      )
      const leaveTimeline = gsap.timeline()
      leaveTimeline
        .to(outgoingMasks.map(({ mask }) => mask), {
          scaleX: 1,
          duration: 0.68,
          stagger: 0.025,
          ease: 'power3.inOut',
        })
        .to(
          outgoingHeadingLines,
          {
            yPercent: -110,
            duration: 0.58,
            stagger: 0.06,
            ease: 'power3.in',
          },
          0.08,
        )
        .to(
          outgoingCopy,
          {
            x: -42,
            opacity: 0,
            duration: 0.42,
            stagger: 0.025,
            ease: 'power2.in',
          },
          0.04,
        )
      await waitForTimeline(leaveTimeline)

      document.querySelector('.app-shell')?.classList.add('route-arrival')
      outgoingMasks.forEach(({ images }) => gsap.set(images, { opacity: 0 }))
      await waitForPaint()
      clearMasks(outgoingMasks)
      outgoingMasks = []
      applyRoute(url, historyMode)
      await new Promise<void>((resolve) => window.setTimeout(resolve, 180))

      const incomingHeadings = gsap.utils.toArray<HTMLElement>(
        'main .hero h1, main .subpage-copy h1',
      )
      const incomingHeadingLines = incomingHeadings.flatMap((heading) =>
        gsap.utils.toArray<HTMLElement>('.headline-line-inner', heading),
      )
      const incomingCopy = gsap.utils.toArray<HTMLElement>(
        'main .hero-copy > .eyebrow, main .hero-description, main .topline-note, main .subpage-copy > .eyebrow, main .subpage-copy > p',
      )
      incomingScrambles = gsap.utils
        .toArray<HTMLElement>('main .hero-description, main .subpage-copy > p')
        .map(createRouteScramble)
        .filter((scramble): scramble is RouteScramble => scramble !== null)
      incomingMasks = prepareMasks(getMaskTargets())
      await waitForMaskImages(incomingMasks)
      gsap.set(incomingHeadingLines, { yPercent: 110 })
      gsap.set(incomingCopy, { x: -16, opacity: 0 })
      gsap.set(
        incomingMasks.map(({ mask }) => mask),
        { scaleX: 1, transformOrigin: 'left center' },
      )
      document.querySelector('.app-shell')?.classList.remove('route-arrival')
      const enterTimeline = gsap.timeline({ paused: true })
      enterTimeline
        .to(incomingMasks.map(({ mask }) => mask), {
          scaleX: 0,
          duration: 0.68,
          stagger: 0.025,
          ease: 'power3.inOut',
        })
        .to(
          incomingHeadingLines,
          {
            yPercent: 0,
            duration: 0.82,
            stagger: 0.075,
            ease: 'power3.out',
          },
          0,
        )
        .to(
          incomingCopy,
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.045,
            ease: 'power2.out',
          },
          0.12,
        )
        .to(
          incomingScrambles.map((scramble) => scramble.progress),
          {
            value: 1,
            duration: 0.76,
            stagger: 0.08,
            ease: 'none',
            onUpdate: () => incomingScrambles.forEach((scramble) => scramble.render()),
          },
          0.12,
        )
      enterTimeline.play(0)
      document.querySelector('.app-shell')?.classList.remove('route-arrival')
      await waitForTimeline(enterTimeline)
      incomingScrambles.forEach((scramble) => scramble.cleanup())
      incomingScrambles = []
      clearMasks(incomingMasks)
      incomingMasks = []
      } finally {
        incomingScrambles.forEach((scramble) => scramble.cleanup())
        clearMasks(outgoingMasks)
        clearMasks(incomingMasks)
        document.querySelector('.app-shell')?.classList.remove('route-arrival')
        routeTransitioning.current = false
        navigating = false
      }
    }
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
      if (!target || target.target || target.hasAttribute('download')) return
      const url = new URL(target.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
      ) return
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        !url.hash
      ) return
      event.preventDefault()
      void transitionRoute(url)
    }
    const handlePopState = () => {
      void transitionRoute(new URL(window.location.href), 'none')
    }
    history.scrollRestoration = 'manual'
    document.addEventListener('click', handleClick)
    window.addEventListener('popstate', handlePopState)
    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const pageTitle: Record<SitePage, string> = {
      home: 'LUMI — Việt Nam, chạm vào điều kỳ diệu',
      solutions: 'Giải pháp — LUMI Việt Nam',
      experiences: 'Trải nghiệm — LUMI Việt Nam',
      features: 'Tính năng — LUMI Việt Nam',
      blog: 'Tạp chí — LUMI Việt Nam',
      register: 'Đăng ký trải nghiệm — LUMI Việt Nam',
    }
    document.title = pageTitle[page]
  }, [page])

  useEffect(() => {
    window.localStorage.setItem('lumi-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#171b18' : '#f4f1e9',
    )
  }, [theme])

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      document.documentElement.style.setProperty('--scroll-progress', String(progress))
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [page])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      if (!routeTransitioning.current) {
        const introElements = document.querySelectorAll<HTMLElement>(
          '.hero-copy > :not(h1), .subpage-copy > :not(h1)',
        )
        if (introElements.length) {
          gsap.from(introElements, {
            y: 34,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.15,
          })
        }
      }
      if (document.querySelector('.hero-photo') && !routeTransitioning.current) {
        gsap.from('.hero-photo', {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          delay: 0.25,
        })
      }
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 86%',
              once: true,
            },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((element) => {
        const target = Number(element.dataset.count)
        const counter = { value: 0 }
        gsap.to(counter, {
          value: target,
          duration: 1.65,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = Math.round(counter.value).toString().padStart(2, '0')
          },
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-text-reveal]').forEach((element) => {
        if (routeTransitioning.current && element.matches('.hero h1, .subpage-copy h1')) return
        const lines = gsap.utils.toArray<HTMLElement>('.headline-line-inner', element)
        if (lines.length) {
          gsap.fromTo(
            lines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.82,
              stagger: 0.075,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                once: true,
              },
            },
          )
          return
        }
        gsap.fromTo(
          element,
          { clipPath: 'inset(0 0 100% 0)', y: 20 },
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })
      const statsOrbitRings = gsap.utils.toArray<HTMLElement>('.stats-orbit-ring')
      const statsGraphic = document.querySelector('.stats-graphic')
      if (statsOrbitRings.length && statsGraphic) {
        gsap.fromTo(
          statsOrbitRings,
          { rotate: -18, scale: 0.94 },
          {
            rotate: 18,
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: statsGraphic,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        )
      }
    })
    return () => context.revert()
  }, [page])

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="scroll-progress" aria-hidden="true" />
      <a className="skip-link" href="#main">
        Bỏ qua đến nội dung
      </a>
      <SiteHeader page={page} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />

      <main id="main">
        {page === 'home' ? (
          <>
        <section className="hero section-shell" id="top" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span className="topline-pill"><i /> LUMI TRAVEL JOURNAL · 2026</span>
            <span className="topline-note">MỞ RA MỘT VIỆT NAM RẤT KHÁC</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-line" /> DU LỊCH ĐA PHƯƠNG TIỆN</span>
              <h1 id="hero-title" data-text-reveal><HeadlineLine>Việt Nam,</HeadlineLine><HeadlineLine>chạm vào</HeadlineLine><HeadlineLine><em>điều kỳ diệu.</em></HeadlineLine></h1>
              <p className="hero-description">
                Không chỉ ngắm nhìn. Hãy lắng nghe, khám phá và bước vào những
                miền đất Việt bằng trải nghiệm số sống động.
              </p>
              <a className="round-link" href="#hanh-trinh" aria-label="Khám phá hành trình">
                <span><ArrowDown size={18} /></span>
                <span>KHÁM PHÁ<br />HÀNH TRÌNH</span>
              </a>
              <span className="hero-index">10° 46' N — 106° 41' E</span>
            </div>
            <div className="hero-visual">
              <ImageMotion className="hero-photo">
                <img
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=90"
                  alt="Vịnh Hạ Long với những đảo đá vôi trên làn nước xanh"
                />
                <div className="photo-shade" />
                <span className="image-motion-light" aria-hidden="true" />
                <span className="photo-label"><i /> KHOẢNH KHẮC 01 / 04</span>
                <div className="photo-caption">
                  <span>VỊNH HẠ LONG · MIỀN BẮC</span>
                  <strong>Nơi núi soi bóng nước</strong>
                </div>
                <button
                  className="play-button"
                  onClick={() => setExperienceOpen(true)}
                  aria-label="Mở trải nghiệm hình ảnh"
                >
                  <Play size={16} fill="currentColor" />
                </button>
                </ImageMotion>
                <div className="hero-aside">
                <div className="orbit-art" aria-hidden="true"><span /></div>
                <p>Chuyến đi bắt đầu<br />từ một cái chạm.</p>
                <span className="aside-index">FIG. 01 — KẾT NỐI CẢM XÚC</span>
              </div>
            </div>
          </div>
          <div className="hero-bottomline">
            <span>20° 57' N — 105° 50' E</span>
            <span>ĐƯỢC KỂ BẰNG CÔNG NGHỆ. ĐƯỢC NHỚ BẰNG CẢM XÚC.</span>
            <span>01 / 04</span>
          </div>
        </section>

        <section className="intro-band section-shell" id="hanh-trinh">
          <div className="section-marker" data-reveal>
            <span className="marker-number">01</span>
            <span className="marker-line" />
            <span className="eyebrow">MỘT CÁCH KỂ MỚI</span>
          </div>
          <div className="intro-content" data-reveal>
            <h2 data-text-reveal><HeadlineLine>Mỗi vùng đất</HeadlineLine><HeadlineLine>là một <em>thế giới.</em></HeadlineLine></h2>
            <div className="intro-right">
              <p>
                LUMI đưa vẻ đẹp Việt Nam đến gần hơn qua hình ảnh, âm thanh
                và công nghệ tương tác — để cảm hứng đi xa hơn một khung hình.
              </p>
              <a className="text-link" href="#cong-nghe">
                Cách chúng tôi kể chuyện <MoveUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="benefit-grid" data-reveal>
            <article className="benefit-card">
              <span className="benefit-icon"><Scan size={20} /></span>
              <span className="benefit-number">01 / THỊ GIÁC</span>
              <h3>Khám phá không gian</h3>
              <p>Hình ảnh toàn cảnh và góc nhìn 3D mở ra những nơi bạn chưa từng đến.</p>
            </article>
            <article className="benefit-card">
              <span className="benefit-icon"><Headphones size={20} /></span>
              <span className="benefit-number">02 / THÍNH GIÁC</span>
              <h3>Lắng nghe vùng đất</h3>
              <p>Âm thanh tự nhiên và câu chuyện địa phương đưa bạn đến gần hơn.</p>
            </article>
            <article className="benefit-card">
              <span className="benefit-icon"><Compass size={20} /></span>
              <span className="benefit-number">03 / TƯƠNG TÁC</span>
              <h3>Tự do chạm khám phá</h3>
              <p>Vuốt, chạm và chọn lối đi riêng qua từng miền trải nghiệm.</p>
            </article>
            <article className="benefit-card">
              <span className="benefit-icon"><SparklesIcon size={20} /></span>
              <span className="benefit-number">04 / CẢM XÚC</span>
              <h3>Để dư âm ở lại</h3>
              <p>Những chi tiết nhỏ làm nên ký ức lớn, trước cả khi chuyến đi bắt đầu.</p>
            </article>
          </div>
        </section>

        <section className="destinations-section section-shell" id="diem-den">
          <div className="section-heading" data-reveal>
            <div>
              <div className="section-marker">
                <span className="marker-number">02</span>
                <span className="marker-line" />
                <span className="eyebrow">CHỌN MỘT LỐI RẼ</span>
              </div>
              <h2 data-text-reveal><HeadlineLine>Việt Nam</HeadlineLine><HeadlineLine><em>đang gọi tên.</em></HeadlineLine></h2>
            </div>
            <div className="heading-side">
              <p>Từ miền đá nở hoa đến phố cổ lên đèn — mỗi điểm đến có một nhịp điệu riêng.</p>
              <div className="slider-controls">
                <button onClick={() => swiperRef.current?.slidePrev()} aria-label="Điểm đến trước"><ArrowLeft size={17} /></button>
                <button onClick={() => swiperRef.current?.slideNext()} aria-label="Điểm đến tiếp theo"><ArrowRight size={17} /></button>
              </div>
            </div>
          </div>
          <Swiper
            className="destination-slider"
            modules={[A11y, Autoplay]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1.12}
            spaceBetween={14}
            speed={700}
            autoplay={{ delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              620: { slidesPerView: 2, spaceBetween: 18 },
              980: { slidesPerView: 3, spaceBetween: 22 },
            }}
            a11y={{ enabled: true }}
          >
            {destinations.map((destination) => (
              <SwiperSlide key={destination.number}>
                <article className="destination-card">
                  <ImageMotion className="destination-image">
                    <img src={destination.image} alt={`Cảnh đẹp ${destination.name}`} loading="lazy" />
                    <span className="image-motion-light" aria-hidden="true" />
                    <span className="destination-tag">{destination.tag}</span>
                    <span className="destination-number">{destination.number}</span>
                    <a href="#cong-nghe" className="destination-arrow" aria-label={`Khám phá ${destination.name}`}>
                      <ArrowUpRight size={19} />
                    </a>
                  </ImageMotion>
                  <div className="destination-info">
                    <div className="destination-place">
                      <span>{destination.region}</span>
                      <h3>{destination.name}</h3>
                    </div>
                    <p>{destination.description}</p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="slider-footnote">
            <span>NHỮNG ĐIỂM CHẠM ĐẦU TIÊN</span>
            <span>VUỐT ĐỂ KHÁM PHÁ <ArrowRight size={13} /></span>
          </div>
        </section>

        <section className="feature-section" id="cong-nghe">
          <ImageMotion className="feature-image">
            <img
              src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=2200&q=90"
              alt="Thuyền nhỏ trôi giữa núi non và dòng nước xanh"
              loading="lazy"
            />
            <div className="feature-overlay" />
            <span className="image-motion-light" aria-hidden="true" />
            <span className="feature-image-note">TRÀNG AN · NINH BÌNH · 20° 15' N</span>
            <button
              className="feature-play"
              onClick={() => setExperienceOpen(true)}
              aria-label="Mở trải nghiệm phong cảnh"
            >
              <Play size={18} fill="currentColor" />
            </button>
            <span className="feature-image-caption">Một miền xanh, vạn thanh âm.</span>
          </ImageMotion>
          <div className="feature-copy" data-reveal>
            <div className="section-marker">
              <span className="marker-number">03</span>
              <span className="marker-line" />
              <span className="eyebrow">ĐI SÂU HƠN MỘT KHUNG HÌNH</span>
            </div>
            <h2 data-text-reveal><HeadlineLine>Nghe thấy.</HeadlineLine><HeadlineLine>Nhìn thấy.</HeadlineLine><HeadlineLine><em>Cảm thấy.</em></HeadlineLine></h2>
            <p>
              Không gian 360° đưa bạn đến giữa cảnh sắc. Âm thanh định vị
              dẫn lối qua từng câu chuyện. Công nghệ chỉ là khởi đầu — cảm xúc
              mới là đích đến.
            </p>
            <button className="underlined-button" onClick={() => setExperienceOpen(true)}>
              Mở một khung cảnh <ArrowUpRight size={16} />
            </button>
            <div className="feature-spec">
              <span><Camera size={15} /> ẢNH TOÀN CẢNH</span>
              <span><AudioLines size={15} /> ÂM THANH KHÔNG GIAN</span>
              <span><Scan size={15} /> KHÁM PHÁ TƯƠNG TÁC</span>
            </div>
          </div>
        </section>

        <section className="quote-section section-shell" data-reveal>
          <span className="quote-kicker"><span className="eyebrow-line" /> GHI CHÉP DỌC ĐƯỜNG</span>
          <blockquote>
            “Có những nơi ta chưa đi qua, nhưng chỉ cần nghe kể — đã thấy nhớ.”
          </blockquote>
          <div className="quote-source">
            <span className="quote-avatar">L.</span>
            <span><strong>Một người mê xê dịch</strong><small>GHI CHÉP TỪ MIỀN KÝ ỨC</small></span>
            <span className="quote-asterisk">✳</span>
          </div>
        </section>

        <section className="stats-section section-shell" aria-label="Những lớp khám phá LUMI">
          <div className="stat-cell" data-reveal>
            <strong><span data-count="4">00</span><i>+</i></strong>
            <span className="stat-caption">MIỀN KHÁM PHÁ</span>
          </div>
          <div className="stat-cell" data-reveal>
            <strong><span data-count="3">00</span><i>+</i></strong>
            <span className="stat-caption">LỚP TRẢI NGHIỆM</span>
          </div>
          <p className="stats-description" data-reveal>
            LUMI kể chuyện những miền đất Việt qua hình ảnh, thanh âm và góc nhìn tương tác.
          </p>
          <div className="stats-graphic" aria-hidden="true">
            <div className="stats-orbit-ring ring-one" />
            <div className="stats-orbit-ring ring-two" />
            <div className="stats-orbit-ring ring-three" />
            <div className="stats-orbit-ring ring-four" />
            <span className="stats-symbol"><span /></span>
          </div>
        </section>

        <section className="faq-section section-shell" id="cau-hoi">
          <div className="faq-intro" data-reveal>
            <div className="section-marker">
              <span className="marker-number">04</span>
              <span className="marker-line" />
              <span className="eyebrow">TRƯỚC KHI LÊN ĐƯỜNG</span>
            </div>
            <h2 data-text-reveal><HeadlineLine>Điều bạn</HeadlineLine><HeadlineLine>muốn <em>biết.</em></HeadlineLine></h2>
            <p>Một vài lời giải đáp nhỏ trước khi bạn bắt đầu khám phá.</p>
          </div>
          <div className="faq-list" data-reveal>
            {questions.map((item, index) => (
              <article className={activeQuestion === index ? 'faq-item is-active' : 'faq-item'} key={item.question}>
                <button
                  className="faq-question"
                  aria-expanded={activeQuestion === index}
                  onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                >
                  <span className="faq-index">0{index + 1}</span>
                  <span>{item.question}</span>
                  <span className="faq-toggle">{activeQuestion === index ? '−' : '+'}</span>
                </button>
                {activeQuestion === index && <p className="faq-answer">{item.answer}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="closing-cta section-shell" id="bat-dau">
          <div className="cta-topline"><span>ĐIỀU KỲ DIỆU Ở RẤT GẦN</span><span>05 / LỜI MỜI</span></div>
          <div className="cta-content" data-reveal>
            <span className="eyebrow"><span className="eyebrow-line" /> MỘT CHUYẾN ĐI BẮT ĐẦU TỪ ĐÂY</span>
            <h2 data-text-reveal><HeadlineLine>Việt Nam đang chờ</HeadlineLine><HeadlineLine><em>bạn khám phá.</em></HeadlineLine></h2>
            <a href="#diem-den" className="cta-button">
              Bắt đầu hành trình <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="cta-decor" aria-hidden="true">
            <div className="cta-orbit cta-orbit-one" />
            <div className="cta-orbit cta-orbit-two" />
            <span>VN</span>
          </div>
        </section>
          </>
        ) : (
          <SecondaryPage page={page} onOpenExperience={() => setExperienceOpen(true)} />
        )}
      </main>

      <SiteFooter />
      <ExperienceModal open={experienceOpen} onClose={experienceClose} />
    </div>
  )
}

function getCurrentPage(): SitePage {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/solutions') return 'solutions'
  if (path === '/experiences') return 'experiences'
  if (path === '/features' || path === '/fonctionnalites') return 'features'
  if (path === '/blog') return 'blog'
  if (path === '/dang-ky') return 'register'
  return 'home'
}

export default App
