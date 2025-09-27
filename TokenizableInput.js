import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";

const KEYS = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8
}

export default class TokenizableInput extends Component {

    static defaultProps = {
        placeHolder: null,
        separatingCharacters: ";-"
    }

    constructor(props) {
        super(props)

        this.state = {
            newText: ''
        }
    }


    handleKeyDown(e) {
        const newText = this.state.newText || ""

        // When tag save keys are pressed, add the tag
        if (e.keyCode === KEYS.ENTER || this.props.separatingCharacters.includes(e.key) ) {
            e.preventDefault()

            if (newText.length > 0) {
                this.addToken(newText, this.props.separatingCharacters)
                this.setState({ newText: "" })
            }
        }

        if (e.keyCode === KEYS.TAB ) {
            if (newText.length > 0) {
                e.preventDefault()
                this.addToken(newText)
                this.setState({ newText: "" })
            }
        }

        // If backspace is pressed and field is blank, send last token to field
        if (e.keyCode === KEYS.BACKSPACE && newText.length === 0) {
            e.preventDefault()
            this.setState({ newText: this.deleteToken(this.props.tokensList.length - 1) })
        }
    }

    handleBlur(e) {
        if (this.state.newText.length > 0) {
            this.addToken(this.state.newText)
        }
        this.setState({ newText: "" })
    }

    addToken(token, separatingCharacters) {
        const toAdd = token.split(new RegExp( "[" + separatingCharacters + "\n\r\t ]+" )).filter(t => t.length > 0)
        if (toAdd.length > 0) {
            let newList = this.props.tokensList.slice()
            newList.push(...toAdd)
            this.props.updateTokensList(newList)
        }
    }

    deleteToken(index) {
        let newList = this.props.tokensList.slice()
        const removedToken = newList[index]
        newList.splice(index, 1)
        this.props.updateTokensList(newList)
        return removedToken
    }

    render() {
        return (
            <div className="rounded-md bg-gray-100 border-transparent focus-within:border-gray-500 focus-within:ring-0 flex flex-row flex-wrap w-full items-start gap-1" type="text">
                {this.props.tokensList.map((token, i) => <Token key={i} token={token} deleteToken={() => this.deleteToken(i)} />)}
                <input
                    className="w-full bg-transparent appearance-none !outline-none"
                    onKeyDown={this.handleKeyDown.bind(this)}
                    onChange={e => this.setState({ newText: e.target.value })}
                    onBlur={this.handleBlur.bind(this)}
                    value={this.state.newText}
                    placeholder={this.props.placeholder || ("Usa invio, tab o " + this.props.separatingCharacters + " per separare gli elementi." )}
                    />
            </div>
        )
    }
}

class Token extends Component {
    render() {
        return (
            <div className="flex flex-row rounded bg-gray-200 max-w-full" style={{ overflowWrap: "anywhere" }}>
                <div className="p-1 pl-2">
                    {this.props.token}
                </div>
                <div role="button" className="flex flex-row items-center hover:bg-[#FFBDAD] hover:text-[#DE350B] px-2"
                    onClick={() => this.props.deleteToken()}>
                    <FontAwesomeIcon icon={solid('x')} className="text-[0.5rem]" />
                </div>
            </div>
        )
    }
}

