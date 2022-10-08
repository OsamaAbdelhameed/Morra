import React from 'react';
import PlayerViews from './PlayerViews.js';

const exports = { ...PlayerViews };

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
    render() {
        const { content } = this.props;
        return (
            <div className="Deployer">
                <h2>Deployer (Player1)</h2>
                {content}
            </div>
        );
    }
}

exports.SetWager = class extends React.Component {
    render() {
        const { parent, defaultWager, standardUnit } = this.props;
        const wager = (this.state || {}).wager || defaultWager;

        return (
            <div>
                <input
                    type='number'
                    placeholder={defaultWager}
                    onChange={(e) => this.setState({ wager: e.currentTarget.value })}
                /> {standardUnit}
                <br />
                <button
                    onClick={() => parent.setWager(wager)}
                >Set wager</button>
            </div>
        );
    }
}

exports.Deploy = class extends React.Component {
    render() {
        const { parent, wager, standardUnit } = this.props;

        return (
            <div>
                Wager (pay to deploy): <strong>{wager}</strong> {standardUnit}
                <br />
                <button
                    onClick={() => parent.deploy()}
                >Deploy</button>
            </div>
        );
    }
}

exports.Deploying = class extends React.Component {
    render() {
        return (
            <div>Deploying... <br />please wait.</div>
        );
    }
}

exports.WaitingForAttacher = class extends React.Component {
    async copyToClipboard(button) {
        const { contInfoStr } = this.props;
        navigator.clipboard.writeText(contInfoStr);
        const origInnerHTML = button.innerHTML;
        button.innerHTML = 'Copied!';
        button.disabled = true;
        await sleep(1000);
        button.innerHTML = origInnerHTML;
        button.disabled = false;
    }

    render() {
        const { contInfoStr } = this.props;

        return (
            <>
                Waiting for Attacher to join...
                <br /> Please give them this contract info:
                <pre className='ContractInfo'>
                    {contInfoStr}
                </pre>
                <button
                    onClick={(e) => this.copyToClipboard(e.currentTarget)}
                >Copy to clipboard</button>
            </>
        )
    }
}

export default exports;