import { motion } from "framer-motion"

export interface ProjectIndexCardProps {
	title: string
	category: string
	images: string[]
	link: string
	index: number
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.05,
		},
	},
}

const childVariants = {
	hidden: { opacity: 0, y: 28 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
	},
}

export default function ProjectIndexCard({
	title,
	category,
	images,
	link,
	index,
}: ProjectIndexCardProps) {
	return (
		<motion.article
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ amount: 0.1, once: true }}
			className="py-16 md:py-24"
		>
			{/* Project title */}
			<motion.h3
				variants={childVariants}
				className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-normal leading-snug text-[#0A0A0A] mb-8 md:mb-12 max-w-[60ch]"
				style={{ letterSpacing: "-0.015em" }}
			>
				{title}
			</motion.h3>

			{/* Images -- flush to right edge */}
			<motion.div
				variants={childVariants}
				className={
					images.length > 1
						? "grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5"
						: "w-full"
				}
			>
				{images.map((src, i) => (
					<motion.a
						key={i}
						href={link}
						className="block overflow-hidden"
						whileHover="hover"
					>
						<motion.img
							src={src}
							alt={`${title} — ${i + 1}`}
							width="1200"
							height="900"
							loading={index < 2 ? "eager" : "lazy"}
							decoding="async"
							className="w-full aspect-[4/3] object-cover"
							variants={{
								hover: { scale: 1.03 },
							}}
							transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
						/>
					</motion.a>
				))}
			</motion.div>

			{/* Case Study link */}
			<motion.div
				variants={childVariants}
				className="mt-6 md:mt-8"
			>
				<a
					href={link}
					className="inline-flex items-center gap-2 font-mono text-sm text-neutral-500 hover:text-[#0A0A0A] transition-colors duration-200"
				>
					<span className="text-brand">—</span>
					Case Study
				</a>
			</motion.div>
		</motion.article>
	)
}
