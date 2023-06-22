import CommentForm from './comment-form/commentForm'
import CommentPanel from './comment-panel/commentPanel'
import styles from './commentSystem.module.scss'

class CommentSystem {
	commentSection: HTMLElement
	commentPanel: CommentPanel
	commentForm: CommentForm

	constructor() {
		this.commentSection = document.createElement('section')
		this.commentPanel = new CommentPanel()
		this.commentForm = new CommentForm()

		this.addStyle()
		this.draw()
	}

	private addStyle() {
		this.commentSection.classList.add(styles.comment_system)
	}

	private draw() {
		this.commentPanel.addElementsAndDraw()
		this.commentSection.append(
			this.commentPanel.divPanel,
			this.commentForm.formElement
		)
	}
}

export default CommentSystem
