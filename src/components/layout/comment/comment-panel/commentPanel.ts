import styles from './commentPanel.module.scss'

class CommentPanel {
	divPanel: HTMLElement = document.createElement('div')
	divElement: HTMLElement = document.createElement('div')
	counterComment: HTMLElement = document.createElement('span')

	private addStyles() {
		this.divPanel.classList.add(styles.comment_panel)
	}

	public addElementsAndDraw() {
		this.counterComment.append('(0)')
		this.divElement.append('Комментарии', this.counterComment)
		this.divPanel.append(this.divElement)

		this.addStyles()
	}
}

export default CommentPanel
