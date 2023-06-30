import { ICommentInfo } from '../comment-form/commentForm'

import styles from './commentItems.module.scss'
import Toolbar from './toolbar/toolbar'

export class CommentItems {
	commentsWrapper: HTMLElement

	private _commentsInfo: ICommentInfo[] | undefined

	constructor() {
		this.commentsWrapper = document.createElement('div')
        
        if(localStorage.getItem('comment')){
            this._commentsInfo = [...JSON.parse(<string>localStorage.getItem('comment'))]
                .reverse()
        }

        if(this._commentsInfo) this.draw()
        this.addStyle()        
	}

    private addStyle() {
        this.commentsWrapper.classList.add(styles.comments_wrapper)
    }

    private draw() {
        this._commentsInfo?.forEach((item) => {
            const commentsItem = document.createElement('div')
            const commentsItemImage = document.createElement('img')
            const commentsItemInfo = document.createElement('div')
            const commentsItemToolbar = new Toolbar(item.voteCount as number).draw()

            const imageProps = [
                ['src', `${item?.image}`],
                ['alt', 'user']
            ]
    
            for (const [attr, val] of imageProps) {
                commentsItemImage.setAttribute(attr, val)
            }
    
            const commentsItemInfoWrapper = document.createElement('div')
            const commentsItemInfoNameAndDate = document.createElement('div')
    
            for(const elem in item) {
                const paragraphElement = document.createElement('p')
    
                if(elem === 'author' || elem === 'date') {
                    paragraphElement.innerText = `${item[elem]}`
                    commentsItemInfoNameAndDate.append(paragraphElement)
                    commentsItemInfoWrapper.append(commentsItemInfoNameAndDate)
                }
    
                if(elem === 'comment') {
                    paragraphElement.innerText = `${item[elem]}`
    
                    commentsItemInfoWrapper.append(paragraphElement)
                }
            }
        
            commentsItemInfo.append(commentsItemInfoWrapper, commentsItemToolbar)
            commentsItem.append(commentsItemImage, commentsItemInfo)
            this.commentsWrapper.append(commentsItem)
        })
	}
}