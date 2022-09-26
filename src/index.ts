import inquirer from 'inquirer';

const afterAnswerDelayInMs = 500;
const minValue = 1;
const maxValue = 49;
const numbersToChooseAmount = 6;

class App {
  randomNumbers: number[];
  chosenNumbers: number[];
  constructor() {
    this.randomNumbers = [];
    this.chosenNumbers = [];
    this.generateRandomNumbers();
    this.displayNumberPrompt();
  }

  generateRandomNumbers() {
    while (this.randomNumbers.length < numbersToChooseAmount) {
      const randomNumber = Math.floor(Math.random() * maxValue) + minValue;
      if (this.randomNumbers.indexOf(randomNumber) === -1) {
        this.randomNumbers.push(randomNumber);
      }
    }
  }

  declareInputSuffix() {
    return this.chosenNumbers.length as 0 | 1 | 2 | 3 | 4 | 5;
  }

  async displayNumberPrompt() {
    const fieldName = `number${this.declareInputSuffix()}` as const;
    inquirer
      .prompt({
        name: fieldName,
        type: 'number',
        message: 'Pick a number between 1-49.',
        suffix: ` (Picked numbers: ${this.chosenNumbers})`,
        filter: async (input: string) => {
          const validatorResponse = await this.displayResponse(input);
          if (typeof validatorResponse === 'string') {
            console.log('\n', '---------');
            console.log('\n', validatorResponse);
            console.log('\n', '---------');
            return '';
          }
          return +input;
        },
      })
      .then((answers) => {
        const passedNumber = answers[fieldName] as string;
        if (this.isInputValid(passedNumber)) this.chosenNumbers.push(answers[fieldName]);
        if (this.chosenNumbers.length < numbersToChooseAmount) {
          setTimeout(() => {
            this.displayNumberPrompt();
          }, afterAnswerDelayInMs);
          return;
        }
        this.displayResult();
      });
  }

  isInputValid (input: string) {
    return (
      input &&
      parseInt(input) &&
      +input >= minValue &&
      +input <= maxValue &&
      this.chosenNumbers.indexOf(+input) === -1
    );
  }

  async displayResponse (input: string) {
    if (parseInt(input) < 0 || parseInt(input) > maxValue) {
      return 'The picked number is not in the required range.';
    }
    if (this.chosenNumbers.indexOf(parseInt(input)) !== -1) {
      return 'You have already picked that number!';
    }
    if (isNaN(parseInt(input))) {
      return 'Please provide a number!';
    }
  }

  resultSuffix(correctGuesses: number) {
    if (correctGuesses === 6) return 'Amazing!';
    if (correctGuesses >= 3) return 'Not bad at all!';
    if (correctGuesses <=3) return 'Better luck next time!';
  }

  displayResult() {
    console.log('\n', '---------');
    console.log('\n', 'Your numbers:', this.chosenNumbers);
    console.log('\n', 'Generated numbers:', this.randomNumbers);
    const correctGuesses = this.chosenNumbers.filter(
      (number) => this.randomNumbers.indexOf(number) !== -1
    ).length;
    console.log(
      '\n',
      `${correctGuesses}/${numbersToChooseAmount} of your guesses were correct.`,
      this.resultSuffix(correctGuesses)
    );
    console.log('\n', '---------');
    this.displayMenu();
  }

  async displayMenu() {
    inquirer
      .prompt({
        name: 'reset',
        message: 'Do you want to play again?',
        type: 'list',
        default: 'yes',
        choices: ['yes', new inquirer.Separator(), 'no'],
      })
      .then(({ reset }) => {
        reset === 'yes' ? this.setupNewGame() : process.exit(0);
      });
  }

  setupNewGame() {
    new App();
  }
};

const app = new App();
