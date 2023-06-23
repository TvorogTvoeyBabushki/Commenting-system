import CommentForm from './comment-form/commentForm'
import styles from './commentSystem.module.scss'

class CommentSystem {
	commentSection: HTMLElement
	commentForm: CommentForm

	constructor() {
		this.commentSection = document.createElement('section')
		this.commentForm = new CommentForm()

		this.addStyle()
		this.draw()
	}

	private addStyle() {
		this.commentSection.classList.add(styles.comment_system)
	}

	public draw() {
		this.commentSection.append(
			this.commentForm.drawCommentPanel(),
			this.commentForm.formElement
		)
	}
}

export default CommentSystem
