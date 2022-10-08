import React from 'react';
import logo from './logo.png';

const exports = {};

// Player views must be extended.
// It does not have its own Wrapper view.

exports.GetChoice = class extends React.Component {
    render() {
        const { parent, playable, hand } = this.props;

        return (
            <>
                {hand ? 'It was a draw! Pick again.' : ''}
                <br />
                {!playable ? 'Please wait...' : ''}
                <br />
                <img src={logo} alt="Logo" />
                <h2>Number of fingers</h2>
                <button
                    disabled={!playable}
                    onClick={() => parent.playHand('Zero')}
                >0</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playHand('One')}
                >1</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playHand('Two')}
                >2</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playHand('Three')}
                >3</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playHand('Four')}
                >4</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playHand('Five')}
                >5</button>
            </>

        );
    }
}



exports.GetGuess = class extends React.Component {
    render() {
        const { parent, playable, guess } = this.props;

        return (
            <div>
                {guess ? 'It was a draw! Pick again.' : ''}
                <br />
                {!playable ? 'Please wait...' : ''}
                <br />
                <h2>Guess</h2>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Zero')}
                >0</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('One')}
                >1</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Two')}
                >2</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Three')}
                >3</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Four')}
                >4</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Five')}
                >5</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Six')}
                >6</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Seven')}
                >7</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Eight')}
                >8</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Nine')}
                >9</button>
                <button
                    disabled={!playable}
                    onClick={() => parent.playGuess('Ten')}
                >10</button>
            </div>

        );
    }
}


exports.WaitingForResults = class extends React.Component {
    render() {
        return (
            <>
                Waiting for results...
            </>
        );
    }
}

exports.Done = class extends React.Component {
    render() {
        const { result } = this.props;

        return (
            <>
                Thank you for playing. The result of this game was:
                <br />{result || 'Unknown'}
            </>
        );
    }
}

exports.Timeout = class extends React.Component {
    render() {
        return (
            <>
                There's been a timeout. (Someone took too long.)
            </>
        );
    }
}

export default exports;