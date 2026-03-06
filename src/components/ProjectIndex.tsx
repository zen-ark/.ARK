import { useRef, useState, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ProjectIndexCard from "./ProjectIndexCard"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const SCRAMBLE_DURATION = 600
const SCRAMBLE_INTERVAL = 30

function useTextScramble(text: string) {
	const [display, setDisplay] = useState(text)
	const frameRef = useRef<number>(0)
	const startRef = useRef<number>(0)

	useEffect(() => {
		const target = text
		startRef.current = performance.now()
		frameRef.current = 0

		const tick = () => {
			const elapsed = performance.now() - startRef.current
			const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1)
			const revealCount = Math.floor(progress * target.length)

			let result = ""
			for (let i = 0; i < target.length; i++) {
				if (target[i] === " ") {
					result += " "
				} else if (i < revealCount) {
					result += target[i]
				} else {
					result += CHARS[Math.floor(Math.random() * CHARS.length)]
				}
			}

			setDisplay(result)

			if (progress < 1) {
				frameRef.current = requestAnimationFrame(tick)
			} else {
				setDisplay(target)
			}
		}

		frameRef.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(frameRef.current)
	}, [text])

	return display
}

const projects = [
	{
		title: "eID \u2014 ein dynamisches Branding f\u00FCr eine vielf\u00E4ltige Schweiz",
		label: "Bundesamt f\u00FCr Informatik BIT",
		category: "Brand Experience",
		images: [
			"/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13046.jpg",
			"/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13037.jpg",
		],
		link: "/projects/zenintelligence",
	},
	{
		title: "Gemeinsam f\u00FCr eine gerechte Welt",
		label: "Amnesty International",
		category: "Brand Experience",
		images: ["/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13037.jpg"],
		link: "/projects/swiss-fintech",
	},
	{
		title: "Investments f\u00FCr Profis",
		label: "Swiss Life Asset Managers",
		category: "Finance / Web",
		images: [
			"/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13046.jpg",
			"/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13037.jpg",
		],
		link: "/projects/ark-system",
	},
	{
		title: "Urbanes Toolbike",
		label: "Monopole",
		category: "E-Commerce",
		images: ["/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13046.jpg"],
		link: "/projects/inversa",
	},
	{
		title: "Gute Fahrt mit der neuen BLS Mobil App",
		label: "BLS",
		category: "Business Platform",
		images: [
			"/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13037.jpg",
			"/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13046.jpg",
		],
		link: "/projects/modular-ui",
	},
]

function StickyLabel({ text }: { text: string }) {
	const scrambled = useTextScramble(text)

	return (
		<span
			className="block font-sans text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-[#0A0A0A] whitespace-nowrap"
			style={{
				writingMode: "vertical-rl",
			}}
		>
			{scrambled}
		</span>
	)
}

export default function ProjectIndex() {
	const sectionRef = useRef<HTMLElement>(null)
	const cardRefs = useRef<(HTMLDivElement | null)[]>([])
	const [activeIndex, setActiveIndex] = useState(0)

	const setCardRef = useCallback((el: HTMLDivElement | null, index: number) => {
		cardRefs.current[index] = el
	}, [])

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				let bestIndex = activeIndex
				let bestRatio = 0

				entries.forEach((entry) => {
					const idx = cardRefs.current.indexOf(entry.target as HTMLDivElement)
					if (idx !== -1 && entry.intersectionRatio > bestRatio) {
						bestRatio = entry.intersectionRatio
						bestIndex = idx
					}
				})

				if (bestRatio > 0) {
					setActiveIndex(bestIndex)
				}
			},
			{
				threshold: [0, 0.25, 0.5, 0.75, 1],
				rootMargin: "-20% 0px -20% 0px",
			}
		)

		cardRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref)
		})

		return () => observer.disconnect()
	}, [])

	return (
		<section ref={sectionRef} className="relative bg-white">
			<div className="flex">
				{/* Sticky left column with scramble label -- bottom-aligned */}
				<div className="hidden md:block w-[120px] lg:w-[160px] flex-shrink-0 pl-4 md:pl-16 xl:pl-24">
					<div className="sticky bottom-0 top-[calc(100vh-80px)] flex items-end justify-start h-0">
						<div className="relative -translate-y-8">
							<StickyLabel text={projects[activeIndex]?.label ?? ""} />
						</div>
					</div>
				</div>

				{/* Project cards */}
				<div className="flex-1 min-w-0 pl-6 md:pl-10">
					{projects.map((project, index) => (
						<div
							key={project.link}
							ref={(el) => setCardRef(el, index)}
						>
							{/* Mobile-only client label */}
							<span className="block md:hidden font-mono text-xs uppercase tracking-wider text-neutral-500 mt-16 mb-2 px-4">
								{project.label}
							</span>
							<ProjectIndexCard
								title={project.title}
								category={project.category}
								images={project.images}
								link={project.link}
								index={index}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
