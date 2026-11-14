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
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { type Location as RouterLocation, useLocation, useNavigate } from 'react-router-dom'
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { HeadlineLine, SecondaryPage } from './SecondaryPages'
import { getContentTitle } from './editorialContent'
import ImageMotion from './ImageMotion'
import { SiteFooter, SiteHeader, type SitePage } from './SiteChrome'
import 'swiper/css'

gsap.registerPlugin(ScrollTrigger)

const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?+*/'

function isInView(element: Element) {
  const bounds = element.getBoundingClientRect()
  return (
    bounds.width > 0 &&
    bounds.height > 0 &&
    bounds.top < window.innerHeight * 0.98 &&
    bounds.bottom > 0 &&
    bounds.left < window.innerWidth &&
    bounds.right > 0
  )
}

function pageColor() {
  const shell = document.querySelector('.app-shell')
  return shell ? getComputedStyle(shell).backgroundColor : '#f4f1e9'
}

function createVeil(host: HTMLElement, color: string) {
  host.classList.add('route-mask-host')
  if (getComputedStyle(host).position === 'static') {
    host.classList.add('route-mask-host-positioned')
  }
  const veil = document.createElement('span')
  veil.className = 'route-veil'
  veil.setAttribute('aria-hidden', 'true')
  veil.style.background = color
  host.append(veil)
  return veil
}

function clearVeils(hosts: HTMLElement[]) {
  hosts.forEach((host) => {
    host.querySelectorAll('.route-veil').forEach((veil) => veil.remove())
    host.classList.remove('route-mask-host', 'route-mask-host-positioned', 'is-route-hidden')
    host.style.backgroundColor = ''
  })
}

function splitIntoLines(element: HTMLElement) {
  if (element.dataset.routeOriginal != null) {
    return gsap.utils.toArray<HTMLElement>('.route-line-inner', element)
  }
  const original = element.textContent ?? ''
  const words = original.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return []

  element.dataset.routeOriginal = original
  const probes: HTMLSpanElement[] = []
  element.replaceChildren()
  words.forEach((word, index) => {
    const probe = document.createElement('span')
    probe.textContent = word
    element.append(probe)
    probes.push(probe)
    if (index < words.length - 1) element.append(document.createTextNode(' '))
  })

  const groups: string[][] = []
  let currentTop = probes[0]?.offsetTop ?? 0
  let bucket: string[] = []
  probes.forEach((probe) => {
    if (bucket.length && Math.abs(probe.offsetTop - currentTop) > 3) {
      groups.push(bucket)
      bucket = []
      currentTop = probe.offsetTop
    }
    bucket.push(probe.textContent ?? '')
  })
  if (bucket.length) groups.push(bucket)

  element.replaceChildren()
  return groups.map((group) => {
    const line = document.createElement('span')
    line.className = 'route-line'
    const inner = document.createElement('span')
    inner.className = 'route-line-inner'
    inner.textContent = group.join(' ')
    line.append(inner)
    element.append(line)
    inner.style.width = `${inner.offsetWidth}px`
    return inner
  })
}

function restoreLines(element: HTMLElement) {
  if (element.dataset.routeOriginal == null) return
  element.textContent = element.dataset.routeOriginal
  delete element.dataset.routeOriginal
}

function scrambleLine(line: HTMLElement) {
  const original = Array.from(line.textContent ?? '')
  const progress = { value: 0 }
  return {
    progress,
    render: () => {
      const settled = Math.floor(progress.value * original.length)
      line.textContent = original
        .map((character, index) => {
          if (index < settled || /\s/.test(character)) return character
          return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)]
        })
        .join('')
    },
  }
}

function getVisibleImageHosts() {
  return gsap.utils.toArray<HTMLElement>('main .image-motion').filter(isInView)
}

async function waitForRouteImages(hosts: HTMLElement[]) {
  await Promise.all(
    hosts.flatMap((host) =>
      gsap.utils.toArray<HTMLImageElement>('img', host).map(async (image) => {
        image.loading = 'eager'
        const deadline = performance.now() + 1200
        const remainingTime = () => Math.max(0, deadline - performance.now())
        let loadTimedOut = false
        if (!image.complete) {
          await new Promise<void>((resolve) => {
            let timeoutId: number
            const finish = () => {
              window.clearTimeout(timeoutId)
              image.removeEventListener('load', finish)
              image.removeEventListener('error', finish)
              resolve()
            }
            image.addEventListener('load', finish, { once: true })
            image.addEventListener('error', finish, { once: true })
            timeoutId = window.setTimeout(() => {
              loadTimedOut = true
              finish()
            }, remainingTime())
            if (image.complete) finish()
          })
        }
        if (loadTimedOut) {
          console.error(`Route transition image timed out: ${image.currentSrc}`)
          return
        }
        if (!image.naturalWidth) {
          console.error(`Route transition image failed to load: ${image.currentSrc}`)
          return
        }
        let decodeTimedOut = false
        let decodeTimeoutId: number | undefined
        try {
          await Promise.race([
            image.decode(),
            new Promise<void>((resolve) => {
              decodeTimeoutId = window.setTimeout(() => {
                decodeTimedOut = true
                resolve()
              }, remainingTime())
            }),
          ])
        } catch (error) {
          console.error(`Route transition image failed to decode: ${image.currentSrc}`, error)
        } finally {
          window.clearTimeout(decodeTimeoutId)
        }
        if (decodeTimedOut) {
          console.error(`Route transition image decode timed out: ${image.currentSrc}`)
        }
      }),
    ),
  )
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
  const location = useLocation()
  const navigate = useNavigate()
  const [activeQuestion, setActiveQuestion] = useState<number | null>(0)
  const [experienceOpen, setExperienceOpen] = useState(false)
  const [displayLocation, setDisplayLocation] = useState<RouterLocation>(location)
  const page = getCurrentPage(displayLocation.pathname)
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.localStorage.getItem('lumi-theme') === 'dark' ? 'dark' : 'light',
  )
  const swiperRef = useRef<SwiperInstance | null>(null)
  const routeTransitioning = useRef(false)
  const navigationPending = useRef(false)
  const reducedMotionScrollReset = useRef(false)
  const locationRef = useRef(location)
  locationRef.current = location
  const experienceClose = () => setExperienceOpen(false)

  useEffect(() => {
    const preventWheelDuringNavigation = (event: WheelEvent) => {
      if (routeTransitioning.current || navigationPending.current) event.preventDefault()
    }
    const preventKeyScrollDuringNavigation = (event: KeyboardEvent) => {
      if (!routeTransitioning.current && !navigationPending.current) return
      if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) return
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, [contenteditable="true"]')) return
      event.preventDefault()
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
        url.search === window.location.search
      ) return
      if (routeTransitioning.current || navigationPending.current) {
        event.preventDefault()
        return
      }
      event.preventDefault()
      navigationPending.current = true
      navigate(`${url.pathname}${url.search}${url.hash}`)
    }
    history.scrollRestoration = 'manual'
    document.addEventListener('click', handleClick)
    document.addEventListener('wheel', preventWheelDuringNavigation, { passive: false })
    document.addEventListener('keydown', preventKeyScrollDuringNavigation)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('wheel', preventWheelDuringNavigation)
      document.removeEventListener('keydown', preventKeyScrollDuringNavigation)
    }
  }, [navigate])

  useEffect(() => {
    if (
      location.pathname === displayLocation.pathname &&
      location.search === displayLocation.search
    ) return
    if (routeTransitioning.current) return

    const destination = location
    const closeMenu = () => {
      const menuToggle = document.querySelector<HTMLInputElement>('#nav-toggle')
      if (menuToggle) menuToggle.checked = false
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reducedMotionScrollReset.current = true
      setDisplayLocation(destination)
      closeMenu()
      return
    }

    routeTransitioning.current = true
    navigationPending.current = false
    document.documentElement.classList.add('is-navigating')

    const hosts = getVisibleImageHosts()
    const heroPhoto = document.querySelector<HTMLElement>('.hero-photo')
    if (heroPhoto) {
      gsap.killTweensOf(heroPhoto)
      gsap.set(heroPhoto, { clearProps: 'clipPath' })
    }

    const darkVeils = hosts.map((host) => {
      const veil = createVeil(host, '#1a1a1a')
      gsap.set(veil, { scaleX: 0, transformOrigin: 'right center', visibility: 'visible' })
      return veil
    })
    const paperVeils = hosts.map((host) => {
      const veil = createVeil(host, pageColor())
      gsap.set(veil, { scaleX: 0, transformOrigin: 'right center', visibility: 'visible' })
      return veil
    })
    const headings = gsap.utils.toArray<HTMLElement>('main .headline-line-inner').filter((line) => isInView(line))
    const descriptions = gsap.utils
      .toArray<HTMLElement>('main .hero-description, main .subpage-copy > p')
      .filter(isInView)
    gsap.killTweensOf(descriptions)
    gsap.set(descriptions, { clearProps: 'opacity,transform,clipPath' })
    const descriptionLines = descriptions.flatMap(splitIntoLines)
    const blocks = gsap.utils
      .toArray<HTMLElement>('main .eyebrow, main .topline-note, main .topline-pill, main .hero-index, main .subpage-index, main h3, main .round-link, main p')
      .filter((element) => isInView(element) && !descriptions.includes(element) && !element.closest('.image-motion, .route-line'))
    const panels = gsap.utils
      .toArray<HTMLElement>(
        'main .feature-section, main .connect-banner, main .closing-cta, main .stats-graphic, main .stat-cell, main .interest-form, main .solution-card, main .destination-card, main .experience-card, main .story-card, main .feature-card, main .editorial-block, main .related-link-card, main .story-experience-link, main .feature-row, main blockquote, main .quote-source',
      )
      .filter(isInView)
    const aside = gsap.utils.toArray<HTMLElement>('main .hero-aside').filter(isInView)
    const footer = document.querySelector<HTMLElement>('.site-footer')
    const footerVisible = Boolean(footer && isInView(footer))
    const activeTargets = [...headings, ...descriptionLines, ...blocks, ...panels, ...aside, ...darkVeils, ...paperVeils]
    if (activeTargets.length) gsap.killTweensOf(activeTargets)

    let completed = false
    const commit = () => {
      if (completed) return
      completed = true
      closeMenu()
      setDisplayLocation(destination)
    }
    const timeline = gsap.timeline({ onComplete: commit })
    if (darkVeils.length) {
      timeline.to(darkVeils, { scaleX: 1, duration: 0.34, ease: 'power3.inOut' }, 0)
      timeline.to(paperVeils, { scaleX: 1, duration: 0.3, ease: 'power3.inOut' }, 0.27)
    }
    if (headings.length) {
      timeline.to(headings, { yPercent: -100, duration: 0.48, stagger: 0.02, ease: 'power3.in' }, 0)
    }
    if (descriptionLines.length) {
      timeline.fromTo(
        descriptionLines,
        { clipPath: 'inset(0 0% 0 0)' },
        { clipPath: 'inset(0 100% 0 0)', duration: 0.4, stagger: 0.02, ease: 'power2.in' },
        0,
      )
    }
    if (blocks.length) {
      timeline.fromTo(
        blocks,
        { clipPath: 'inset(0 0% 0 0)' },
        { clipPath: 'inset(0 100% 0 0)', duration: 0.38, stagger: 0.015, ease: 'power2.in' },
        0,
      )
    }
    if (panels.length) {
      timeline.fromTo(
        panels,
        { clipPath: 'inset(0 0% 0 0)' },
        { clipPath: 'inset(0 100% 0 0)', duration: 0.5, stagger: 0.02, ease: 'power2.in' },
        0,
      )
    }
    if (aside.length) {
      timeline.to(aside, { opacity: 0, y: -16, duration: 0.4, ease: 'power2.in' }, 0)
    }
    if (footer && footerVisible) {
      timeline.fromTo(
        footer,
        { clipPath: 'inset(0% 0 0 0)' },
        { clipPath: 'inset(100% 0 0 0)', duration: 0.52, ease: 'power2.in' },
        0,
      )
    }
    if (!timeline.duration()) commit()

    return () => {
      timeline.kill()
      if (!completed) {
        routeTransitioning.current = false
        navigationPending.current = false
        document.documentElement.classList.remove('is-navigating')
        clearVeils(hosts)
        descriptions.forEach(restoreLines)
        const transformTargets = [...headings, ...aside]
        const clipTargets = [...blocks, ...panels]
        if (transformTargets.length) gsap.set(transformTargets, { clearProps: 'transform,opacity' })
        if (clipTargets.length) gsap.set(clipTargets, { clearProps: 'clipPath' })
        if (footer) gsap.set(footer, { clearProps: 'clipPath' })
      }
    }
  }, [location, displayLocation.pathname, displayLocation.search])

  useLayoutEffect(() => {
    if (reducedMotionScrollReset.current) {
      reducedMotionScrollReset.current = false
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
      navigationPending.current = false
      const hash = locationRef.current.hash
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
          if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
        })
      })
      return
    }
    if (!routeTransitioning.current) return

    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    const footer = document.querySelector<HTMLElement>('.site-footer')
    if (footer) gsap.set(footer, { clearProps: 'clipPath' })

    const hosts = getVisibleImageHosts()
    const color = pageColor()
    hosts.forEach((host) => {
      host.classList.add('is-route-hidden')
      host.style.backgroundColor = color
    })
    const veils = hosts.map((host) => {
      const veil = createVeil(host, '#1a1a1a')
      gsap.set(veil, { scaleX: 0, transformOrigin: 'left center', visibility: 'visible' })
      return veil
    })
    const headings = gsap.utils.toArray<HTMLElement>(
      'main .hero h1 .headline-line-inner, main .subpage-copy h1 .headline-line-inner',
    )
    const descriptions = gsap.utils.toArray<HTMLElement>('main .hero-description, main .subpage-copy > p')
    const descriptionLines = descriptions.flatMap(splitIntoLines)
    const scrambles = descriptionLines.map(scrambleLine)
    const blocks = gsap.utils.toArray<HTMLElement>(
      'main .hero-topline > *, main .hero-copy > .eyebrow, main .hero-index, main .hero .round-link, main .subpage-copy > .eyebrow, main .subpage-index, main .subpage-copy .round-link',
    )
    const aside = gsap.utils.toArray<HTMLElement>('main .hero-aside')

    const textTimeline = gsap.timeline()
    if (headings.length) {
      textTimeline.fromTo(
        headings,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
        0.05,
      )
    }
    descriptionLines.forEach((line, index) => {
      const scramble = scrambles[index]
      const at = 0.12 + index * 0.1
      textTimeline.fromTo(
        line,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power2.out' },
        at,
      )
      textTimeline.to(
        scramble.progress,
        { value: 1, duration: 0.9, ease: 'none', onUpdate: scramble.render },
        at,
      )
    })
    if (blocks.length) {
      textTimeline.fromTo(
        blocks,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.55, stagger: 0.05, ease: 'power2.out' },
        0.08,
      )
    }
    if (aside.length) {
      textTimeline.fromTo(
        aside,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        0.2,
      )
    }

    let cancelled = false
    let revealTimeline: gsap.core.Timeline | null = null
    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      descriptions.forEach(restoreLines)
      clearVeils(hosts)
      if (headings.length) gsap.set(headings, { clearProps: 'transform' })
      if (blocks.length) gsap.set(blocks, { clearProps: 'clipPath' })
      if (aside.length) gsap.set(aside, { clearProps: 'opacity,transform' })
      routeTransitioning.current = false
      navigationPending.current = false
      document.documentElement.classList.remove('is-navigating')
      const hash = locationRef.current.hash
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
      })
    }

    const coverTimeline = gsap.timeline()
    veils.forEach((veil, index) => {
      coverTimeline.to(veil, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, Math.min(index, 4) * 0.06)
    })

    let pending = 2
    const done = () => {
      pending -= 1
      if (pending <= 0) settle()
    }
    if (textTimeline.duration()) textTimeline.eventCallback('onComplete', done)
    else done()

    void (async () => {
      await Promise.all([
        waitForRouteImages(hosts),
        coverTimeline.duration() ? coverTimeline.then() : Promise.resolve(),
      ])
      if (cancelled) return
      hosts.forEach((host) => host.classList.remove('is-route-hidden'))
      veils.forEach((veil) => gsap.set(veil, { transformOrigin: 'right center' }))
      revealTimeline = gsap.timeline({ delay: 0.05, onComplete: done })
      if (!veils.length) {
        done()
        return
      }
      veils.forEach((veil, index) => {
        revealTimeline?.to(
          veil,
          { scaleX: 0, duration: 0.6, ease: 'power3.inOut' },
          Math.min(index, 4) * 0.06,
        )
      })
    })()

    return () => {
      cancelled = true
      textTimeline.kill()
      coverTimeline.kill()
      revealTimeline?.kill()
      if (!settled) {
        descriptions.forEach(restoreLines)
        clearVeils(hosts)
        if (headings.length) gsap.set(headings, { clearProps: 'transform' })
        if (blocks.length) gsap.set(blocks, { clearProps: 'clipPath' })
        if (aside.length) gsap.set(aside, { clearProps: 'opacity,transform' })
      }
    }
  }, [displayLocation.key])

  useEffect(() => {
    const pageTitle: Record<SitePage, string> = {
      home: 'LUMI — Việt Nam, chạm vào điều kỳ diệu',
      solutions: 'Giải pháp — LUMI Việt Nam',
      experiences: 'Trải nghiệm — LUMI Việt Nam',
      features: 'Tính năng — LUMI Việt Nam',
      blog: 'Tạp chí — LUMI Việt Nam',
      register: 'Đăng ký trải nghiệm — LUMI Việt Nam',
    }
    const detailTitle = getContentTitle(displayLocation.pathname)
    document.title = detailTitle ? `${detailTitle} — LUMI Việt Nam` : pageTitle[page]
  }, [page, displayLocation.pathname])

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
  }, [displayLocation.key])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      const introElements = document.querySelectorAll<HTMLElement>(
        '.hero-copy > :not(h1), .subpage-copy > :not(h1)',
      )
      if (!routeTransitioning.current && introElements.length) {
        gsap.from(introElements, {
          y: 34,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.15,
        })
      }
      if (!routeTransitioning.current && document.querySelector('.hero-photo')) {
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
        if (routeTransitioning.current && element.closest('.hero, .subpage-hero')) return
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
  }, [displayLocation.key])

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
          <SecondaryPage page={page} pathname={displayLocation.pathname} />
        )}
      </main>

      <SiteFooter />
      <ExperienceModal open={experienceOpen} onClose={experienceClose} />
    </div>
  )
}

function getCurrentPage(pathname: string): SitePage {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/solutions' || path.startsWith('/solutions/')) return 'solutions'
  if (path === '/experiences' || path.startsWith('/experiences/')) return 'experiences'
  if (path === '/features' || path === '/fonctionnalites') return 'features'
  if (path === '/blog' || path.startsWith('/blog/')) return 'blog'
  if (path === '/dang-ky') return 'register'
  return 'home'
}

export default App
