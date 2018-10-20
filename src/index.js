import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function Container({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "75vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          width: "auto",
          padding: "1rem 2rem",
          backgroundColor: "rgba(147, 128, 108, 0.1)",
          borderRadius: "3px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          textAlign: "center"
        }}
      >
        {children}
      </div>
    </div>
  );
}

class App extends React.Component {
  state = {
    isUpdating: false,
    address: null,
    balance: null,
    price: null
  };

  checkBalance = () => {
    const { isUpdating, address } = this.state;

    if (isUpdating) {
      return;
    }

    fetch(`https://blockchain.info/q/addressbalance/${address}`)
      .then(result => result.json())
      .then(result => {
        const balance = result / 100000000;
        return this.setState({ balance });
      })
      .then(() => fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`))
      .then(result => result.json())
      .then(result => {
        debugger;
        this.setState({ price: result.market_data.current_price.usd });
      })
      .finally(() => {
        this.setState({ isUpdating: false });
      });

    this.setState({
      isUpdating: true
    });
  };

  render() {
    const { isUpdating, address, balance, price } = this.state;

    return (
      <Container>
        <h1>Bitcoin Value Checker</h1>
        <h2>
          Enter your wallet address, and we'll tell you how much your Bitcoin is
          worth
        </h2>
        <input
          type="text"
          placeholder="1H249dGj9kFUjJMeVnB7uGrqYo1x9v4fbq"
          value={address}
          onChange={evt => this.setState({ address: evt.target.value })}
        />
        <button
          disabled={this.isUpdating}
          type="button"
          onClick={() => this.checkBalance()}
        >
          Check balance
        </button>
        {balance &&
          price && (
            <p>
              The wallet provided contains {balance} BTC, which, at ${price.toFixed(
                2
              )}{" "}
              is worth about ${(balance * price).toFixed(2)}
            </p>
          )}
      </Container>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
