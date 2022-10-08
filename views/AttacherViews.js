import React from 'react';
import PlayerViews from './PlayerViews.js';

const exports = { ...PlayerViews };

exports.Wrapper = class extends React.Component {
    render() {
        const { content } = this.props;

        return (
            <div className="Attacher">
                <h2>Attacher (Player 2)</h2>
                {content}
            </div>
        );
    }
}

exports.Attach = class extends React.Component {
    render() {
        const { parent } = this.props;
        const { contInfoStr } = this.state || {};

        return (
            <>
                Please paste the contract info to attach to:
                <br />
                <textarea spellCheck="false"
                    className='ContractInfo'
                    onChange={(e) => this.setState({ contInfoStr: e.currentTarget.value })}
                    placeholder='{}'
                />
                <br />
                <button
                    disabled={!contInfoStr}
                    onClick={() => parent.attach(contInfoStr)}
                >Attach</button>
            </>
        );
    }
}

exports.Attaching = class extends React.Component {
    render() {
        return (
            <>
                Attaching, please wait...
            </>
        );
    }
}

exports.AcceptTerms = class extends React.Component {
    render() {
        const { wager, standardUnit, parent } = this.props;
        const { disabled } = this.state || {};

        return (
            <>
                The terms of the game are:
                <br /> Wager: {wager} {standardUnit}
                <br />
                <button
                    disabled={disabled}
                    onClick={() => {
                        this.setState({ disabled: true });
                        parent.termsAccepted();
                    }}
                >Accept terms and pay wager</button>
            </>
        );
    }
}

exports.WaitingForTurn = class extends React.Component {
    render() {
        return (
            <>
                Waiting for the other player...
                <br />Think about which move you want to play.
            </>
        );
    }
}

export default exports;