import CommentForm from './comment-form/commentForm'
import { CommentItems } from './comment-item/commentItems'
import { CommentPanel } from './comment-panel/commentPanel'
import styles from './commentSystem.module.scss'

class CommentSystem {
	commentSection = document.createElement('section')
	commentItems = new CommentItems()
	commentPanel = new CommentPanel(this.commentItems.commentsWrapper)
	commentForm = new CommentForm(
		this.commentItems.commentsWrapper,
		this.commentPanel
	)

	private addStyle() {
		this.commentSection.classList.add(styles.comment_system)
	}

	public draw() {
		this.commentSection.append(
			this.commentPanel.drawCommentPanel(this.commentForm.getCommentsLength),
			this.commentForm.draw(),
			this.commentItems.draw()
		)

		this.addStyle()

		return this.commentSection
	}
}

export default CommentSystem
