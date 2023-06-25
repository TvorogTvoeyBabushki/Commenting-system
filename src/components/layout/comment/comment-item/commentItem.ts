import { ICommentInfo } from '../comment-form/commentForm'

import styles from './commentItem.module.scss'

export class CommentItem {
	wrapperDivElement: HTMLElement
	imageElement: HTMLElement
	infoDivElement: HTMLElement

	private _commentInfo: ICommentInfo | undefined

	constructor() {
		this.wrapperDivElement = document.createElement('div')
		this.imageElement = document.createElement('img')
		this.infoDivElement = document.createElement('div')
        
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

        const nameAndDateDivElement = document.createElement('div')
        const toolbar = document.createElement('div')
        const toolbarWrapper = document.createElement('div')

        for(const elem in this._commentInfo) {
            const paragraphElement = document.createElement('p')

            if(elem === 'author' || elem === 'date') {
                paragraphElement.innerText = `${this._commentInfo[elem]}`
                nameAndDateDivElement.append(paragraphElement)
            }

            if(elem === 'comment') {
                paragraphElement.innerText = `${this._commentInfo[elem]}`

                toolbar.insertAdjacentElement('afterbegin', paragraphElement)
            }
            
        }

        const propsIconElement = [
            [
                ['src', '/public/answer-to-comment.png'],
                ['alt', 'icon']
            ],
            [
                ['src', '/public/empty-heart.png'],
                ['alt', 'icon']
            ]
        ]

        const [answer, favorite] = ['Ответить', 'В избранное']
        
        propsIconElement.forEach((item, index) =>{
            const iconElement = document.createElement('img') 

            for (const [attr, val] of item) {
                iconElement.setAttribute(attr, val)
            }
            
            const buttonElement = document.createElement('button')
            const text = index === 0 ? answer : favorite            

            buttonElement.append(iconElement, text)
            toolbarWrapper.append(buttonElement)
            toolbar.append(toolbarWrapper)
        } ) 

    
        this.infoDivElement.append(nameAndDateDivElement, toolbar)

		this.wrapperDivElement.append(this.imageElement, this.infoDivElement)
	}
}
