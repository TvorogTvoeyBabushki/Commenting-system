import CommentForm from './comment-form/commentForm'
import { CommentItems } from './comment-item/commentItems'
import styles from './commentSystem.module.scss'

class CommentSystem {
	commentSection: HTMLElement
	commentForm: CommentForm
	commentItems: CommentItems

	constructor() {
		this.commentSection = document.createElement('section')
		this.commentItems = new CommentItems()
		this.commentForm = new CommentForm(this.commentItems.commentsWrapper)

		this.addStyle()
		this.draw()
	}

	private addStyle() {
		this.commentSection.classList.add(styles.comment_system)
	}

	public draw() {
		this.commentSection.append(
			this.commentForm.drawCommentPanel(),
			this.commentForm.formElement,
			this.commentItems.commentsWrapper
		)
	}
}

export default CommentSystem
