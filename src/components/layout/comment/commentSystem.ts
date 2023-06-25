import CommentForm from './comment-form/commentForm'
import { CommentItem } from './comment-item/commentItem'
import styles from './commentSystem.module.scss'

class CommentSystem {
	commentSection: HTMLElement
	commentForm: CommentForm
	commentItem: CommentItem

	constructor() {
		this.commentSection = document.createElement('section')
		this.commentForm = new CommentForm()
		this.commentItem = new CommentItem()

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
			this.commentItem.wrapperDivElement
		)
	}
}

export default CommentSystem
