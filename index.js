import React from 'react';
import * as backend from './build/index.main.mjs';
import { loadStdlib, ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';

import AppViews from './views/AppViews.js';
import DeployerViews from './views/DeployerViews.js';
import AttacherViews from './views/AttacherViews.js';
import { renderDOM, renderView } from './views/render.js';

import './index.css';

const reach = loadStdlib(process.env);
reach.setWalletFallback(reach.walletFallback({
  providerEnv: 'TestNet',
  MyAlgoConnect
}));

const choices = { 'Zero': 0, 'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5 };
const results = { 'Zero': 0, 'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5, 'Six': 6, 'Seven': 7, 'Eight': 8, 'Nine': 9, 'Ten': 10 };
const intToOutcome = ['Player2 Won!', 'Draw!', 'Player1 Won!'];
const { standardUnit } = reach;
const defaults = { defaultFundAmt: '10', defaultWager: '3', standardUnit };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { view: 'ConnectAccount', ...defaults };
  }

  async componentDidMount() {
    const acc = await reach.getDefaultAccount();
    const balAtomic = await reach.balanceOf(acc);
    const bal = reach.formatCurrency(balAtomic, 4);
    this.setState({ acc, bal });
    if (await reach.canFundFromFaucet()) {
      this.setState({ view: 'FundAccount' });
    } else {
      this.setState({ view: 'DeployerOrAttacher' });
    }
  }

  async fundAccount(fundAmount) {
    await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
    this.setState({ view: 'DeployerOrAttacher' });
  }

  async skipFundAccount() { this.setState({ view: 'DeployerOrAttacher' }); }
  selectAttacher() { this.setState({ view: 'Wrapper', ContentView: Attacher }); }
  selectDeployer() { this.setState({ view: 'Wrapper', ContentView: Deployer }); }
  render() { return renderView(this, AppViews); }
}

class Player extends React.Component {
  random() { return reach.hasRandom.random(); }

  async getChoice() {
    const hand = await new Promise(resolveHandP => {
      this.setState({ view: 'getChoice', playable: true, resolveHandP });
    });
    this.setState({ view: 'WaitingForResults', hand });
    return choices[hand];
  }

  async getGuess() {
    const guess = await new Promise(resolveGuessP => {
      this.setState({ view: 'GetGuess', playable: true, resolveGuessP });
    });
    this.setState({ view: 'WaitingForResults', guess });
    return results[guess];
  }

  playHand(hand) { this.state.resolveHandP(hand); }
  playGuess(guess) { this.state.resolveGuessP(guess); }
  showTimeout() { this.setState({ view: 'Timeout' }); }
  getResult(i) { this.setState({ view: 'Done', result: intToOutcome[i] }); }
}

class Deployer extends Player {
  constructor(props) {
    super(props);
    this.state = { view: 'SetWager' };
  }

  setWager(wager) { this.setState({ view: 'Deploy', wager }); }

  async deploy() {
    const cont = this.props.acc.contract(backend);
    this.setState({ view: 'Deploying', cont });
    this.wager = reach.parseCurrency(this.state.wager); // UInt
    this.deadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector]; // UInt
    backend.Player1(cont, this);
    const contInfoStr = JSON.stringify(await cont.getInfo(), null, 2);
    this.setState({ view: 'WaitingForAttacher', contInfoStr });
  }

  render() { return renderView(this, DeployerViews); }
}
class Attacher extends Player {
  constructor(props) {
    super(props);
    this.state = { view: 'Attach' };
  }

  attach(contInfoStr) {
    const cont = this.props.acc.contract(backend, JSON.parse(contInfoStr));
    this.setState({ view: 'Attaching' });
    backend.Player2(cont, this);
  }

  async acceptWager(wagerAtomic) {
    const wager = reach.formatCurrency(wagerAtomic, 4);
    return await new Promise(resolveAcceptedP => {
      this.setState({ view: 'AcceptTerms', wager, resolveAcceptedP });
    });
  }

  termsAccepted() {
    this.state.resolveAcceptedP();
    this.setState({ view: 'WaitingForTurn' });
  }

  render() { return renderView(this, AttacherViews); }
}

renderDOM(<App />);