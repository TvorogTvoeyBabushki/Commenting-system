import { ICommentInfo } from '../comment-form/commentForm'

import styles from './commentItem.module.scss'
import Toolbar from './toolbar/toolbar'

export class CommentItem {
	wrapperDivElement: HTMLElement
	imageElement: HTMLElement
	infoDivElement: HTMLElement
    toolbar: Toolbar

	private _commentInfo: ICommentInfo | undefined

	constructor() {
		this.wrapperDivElement = document.createElement('div')
		this.imageElement = document.createElement('img')
		this.infoDivElement = document.createElement('div')
        this.toolbar = new Toolbar()
        
        if(localStorage.getItem('comment')){
            this._commentInfo = [...JSON.parse(<string>localStorage.getItem('comment'))].at(-1)
        }

        if(this._commentInfo) this.draw()
        this.addStyle()        
	}

    private addStyle() {
        this.wrapperDivElement.classList.add(styles.wrapper_comment)
    }

    private draw() {
		const imageProps = [
			['src', `${this._commentInfo?.image}`],
			['alt', 'user']
		]

		for (const [attr, val] of imageProps) {
			this.imageElement.setAttribute(attr, val)
		}

        const wrapperInfoDivElement = document.createElement('div')
        const nameAndDateDivElement = document.createElement('div')

        for(const elem in this._commentInfo) {
            const paragraphElement = document.createElement('p')

            if(elem === 'author' || elem === 'date') {
                paragraphElement.innerText = `${this._commentInfo[elem]}`
                nameAndDateDivElement.append(paragraphElement)
                wrapperInfoDivElement.append(nameAndDateDivElement)
            }

            if(elem === 'comment') {
                paragraphElement.innerText = `${this._commentInfo[elem]}`

                wrapperInfoDivElement.append(paragraphElement)
            }
        }
    
        this.infoDivElement.append(wrapperInfoDivElement, this.toolbar.draw())
		this.wrapperDivElement.append(this.imageElement, this.infoDivElement)
	}
}