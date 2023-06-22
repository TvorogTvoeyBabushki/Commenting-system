import CommentSystem from './comment/commentSystem'
import Footer from './footer/footer'
import styles from './layout.module.scss'
import { AppDivElement } from '@/constants/appDivElement'

class Layout extends AppDivElement {
	sectionElement: HTMLElement | null | undefined
	children: Node
	footer: Footer
	commentSystem: CommentSystem

	constructor(children: HTMLElement) {
		super()

		this.app
		this.sectionElement
		this.children = children
		this.footer = new Footer()
		this.commentSystem = new CommentSystem()
	}

	public createAndDraw() {
		this.sectionElement = document.createElement('section')
		this.sectionElement.classList.add(styles.layout)

		this.sectionElement?.append(
			this.children,
			this.footer.footerElement,
			this.commentSystem.commentSection
		)
		this.app?.append(this.sectionElement)
	}
}

export default Layout
