import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger, useGSAP)
}

interface PortfolioAnimationProps {
	children: React.ReactNode
}

export default function PortfolioAnimation({ children }: PortfolioAnimationProps) {
	const containerRef = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const container = containerRef.current
			if (!container) return

			const logo = container.querySelector(".shain-logo-wrapper")
			const letters = container.querySelectorAll(".shain-logo .letter")
			const intro = container.querySelector(".portfolio-intro-content")
			const grid = container.querySelector(".projects-grid-content")
			const projectItems = Array.from(container.querySelectorAll(".project-item"))
			const sectionHeaders = Array.from(
				container.querySelectorAll(".projects-section-header"),
			)
			const firstSectionHeader = sectionHeaders[0]
			const restSectionHeaders = sectionHeaders.slice(1)
			const previouslyStrip = container.querySelector(".previously-strip")

			if (!logo || !intro || !grid) {
				gsap.set([intro, ...projectItems, ...sectionHeaders].filter(Boolean), {
					autoAlpha: 1,
					y: 0,
				})
				if (previouslyStrip) {
					gsap.set(previouslyStrip, { autoAlpha: 1, x: 0 })
				}
				gsap.set(letters, { autoAlpha: 1, y: 0 })
				return
			}

			const prefersReducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)",
			).matches

			if (prefersReducedMotion) {
				gsap.set(logo, { autoAlpha: 1 })
				gsap.set(letters, { y: 0, autoAlpha: 1 })
				gsap.set(intro, { y: 0, autoAlpha: 1 })
				gsap.set([...projectItems, ...sectionHeaders], { y: 0, autoAlpha: 1 })
				if (previouslyStrip) {
					gsap.set(previouslyStrip, { autoAlpha: 1, x: 0 })
				}
				return
			}

			const firstTwo = projectItems.slice(0, 2)
			const remaining = projectItems.slice(2)

			gsap.set(logo, { autoAlpha: 1 })
			gsap.set(letters, { y: 120, autoAlpha: 0 })
			gsap.set(intro, { autoAlpha: 0, y: 30 })
			gsap.set(projectItems, { autoAlpha: 0, y: 50 })
			gsap.set(sectionHeaders, { autoAlpha: 0, y: 50 })
			if (previouslyStrip) {
				gsap.set(previouslyStrip, { autoAlpha: 0, x: -40 })
			}

			const tl = gsap.timeline({
				defaults: { ease: "power3.inOut" },
			})

			tl.to(letters, {
				y: 0,
				autoAlpha: 1,
				duration: 1.4,
				stagger: 0.08,
			})
				.to(
					intro,
					{
						y: 0,
						autoAlpha: 1,
						duration: 1,
					},
					"-=0.8",
				)
				.add(() => {
					const firstReveal = [
						...(firstSectionHeader ? [firstSectionHeader] : []),
						...firstTwo,
					]
					if (firstReveal.length > 0) {
						gsap.to(firstReveal, {
							autoAlpha: 1,
							y: 0,
							duration: 1,
							stagger: 0.15,
							ease: "power3.out",
							overwrite: true,
						})
					}

					if (previouslyStrip) {
						gsap.to(previouslyStrip, {
							autoAlpha: 1,
							x: 0,
							duration: 1,
							delay: 0.2,
							ease: "power3.out",
							overwrite: true,
						})
					}

					if (remaining.length > 0) {
						ScrollTrigger.batch(remaining, {
							onEnter: (batch) => {
								gsap.to(batch, {
									autoAlpha: 1,
									y: 0,
									duration: 1,
									stagger: 0.15,
									ease: "power3.out",
									overwrite: true,
								})
							},
							onLeaveBack: () => {},
							start: "top 90%",
						})
					}

					if (restSectionHeaders.length > 0) {
						ScrollTrigger.batch(restSectionHeaders, {
							onEnter: (batch) => {
								gsap.to(batch, {
									autoAlpha: 1,
									y: 0,
									duration: 1,
									ease: "power3.out",
									overwrite: true,
								})
							},
							onLeaveBack: () => {},
							start: "top 90%",
						})
					}
				}, "-=0.4")

			const mm = gsap.matchMedia()

			mm.add("(min-width: 768px)", () => {
				gsap.to(logo, {
					y: () => ScrollTrigger.maxScroll(window) * 0.15,
					ease: "none",
					scrollTrigger: {
						trigger: document.body,
						start: "top top",
						end: "bottom bottom",
						scrub: 0.5,
						invalidateOnRefresh: true,
					},
				})
			})

			return () => mm.revert()
		},
		{ scope: containerRef },
	)

	return (
		<div ref={containerRef} className="portfolio-anim-wrapper">
			{children}
		</div>
	)
}
