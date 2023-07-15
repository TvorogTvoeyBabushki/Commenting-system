import { Header } from './header/header'

class Layout {
	sectionElement = document.createElement('section')
	header = new Header()

	public draw(children: HTMLElement) {
		this.sectionElement.append(this.header.draw(), children)

		return this.sectionElement
	}
}

export default Layout
