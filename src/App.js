import React, { useState } from 'react';
import './App.css';
import ResultView from './components/ResultView';
import Keyboard from './components/Keyboard';
import Card from "./components/Card";
import food from "./assets/food.jpg";
import { Tooltip } from '@varld/popover';

let output = '';
let history = '';
let symbols = ['*', '-', '+', '/'];

function App() {
	const [state, setState] = useState({
		history: '',
		displayValue: ''
	});
	const updateState = () => {
		setState({ history: history.toString(), displayValue: output.toString() });
	};

	// ONCLICK BUTTON CLICK
	const onClick = (id, keyType, value) => {
		// CONVERT TO STRING
		output = output.toString();
		// GET LAST INPUT VALUE
		let lastInput = output.slice(-1);

		switch (keyType) {
			case 'function':
				functionKey(id, lastInput);
				break;
			case 'operator':
				operatorKey(value, lastInput);
				break;
			case 'number':
				numberKey(value, lastInput);
				break;
			default:
				return;
		}
	};
	const functionKey = (id, lastInput) => {
		const resetOutput = display => {
			// RESET VALUES
			history = '';
			output = '';
			// Update state if display == true
			display && updateState();
		};
		const calculate = lastInput => {
			// CHECK IF LAST INPUT IS NUMBER AND OUTPUT IS NOT EMPTY
			if (!symbols.includes(lastInput) && output) {
				try {
					history = output;
					output = eval(output.replace(/%/g, '*0.01'));
					output = Number.isInteger(output) ? output : output.toFixed(3);
					updateState();
					// UPDATE HISTORY TO RESULT AND RESET OUTPUT
					history = output;
					output = '';
				} catch (error) {
					output = 'Error';
					updateState();
					resetOutput();
				}
			}
		};

		switch (id) {
			case 'clear':
				resetOutput(true);
				break;
			case 'clearBack':
				output = output.slice(0, -1);
				updateState();
				break;
			case 'calc':
				calculate(lastInput);
				break;
			default:
				return;
		}
	};
	const operatorKey = (value, lastInput) => {
		// PREVENT STARTING WITH AN OPERATOR
		if (output === '' && value !== '-') {
			return;
		} else {
			// REPLACE OPERATOR SYMBOL IF LASTINPUT IS OPERATOR
			symbols.includes(lastInput)
				? (output = output.slice(0, -1) + value)
				: (output += value);
		}
		updateState();
	};
	const numberKey = (value, lastInput) => {
		// PREVENT ENTERING . OR % MULTIPY TIMES
		if (value === '.' || value === '%') {
			// PREVENT STARTING WITH '%'
			if (output === '' && value === '%') return;
			lastInput === '.' || lastInput === '%' || (output += value);
		} else {
			output += value;
		}
		updateState();
	};

	const recipeAuthor = "Efecan";
  const recipeItem = {
    title: "Avokado Ezmeli Taco",
    date: "8 Haziran 2021, Sal??",
    image: food,
    description:
      "Bu kremsi ve baharatl?? avokado sosu, g??nl??k taco'lar??n??z?? haz??rlamak i??in harika se??eneklerden biri. Geleneksel olarak flautas veya taquitos ile servis edilir, ancak baz?? vegan enchiladalara da harika bir katk?? sa??lar.",
  };

  const like= 193;
  const isLiked = true;

	return (
		<div className="app">
			<div className="container">
				<Tooltip content="It works as it is">
					<button>How it works?</button>
				</Tooltip>
				<ResultView history={state.history} output={state.displayValue} />
				<Keyboard onClick={onClick} />
			</div>
			<div className="container">
				<Card
          author={recipeAuthor}
          title={recipeItem.title}
          date={recipeItem.date}
          description={recipeItem.description}
          liked={isLiked}
          likeCount={like}
        />
			</div>
		</div>
	);
}

export default App;
