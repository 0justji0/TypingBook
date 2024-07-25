import React, { useState, useEffect } from 'react'; // 리액트 라이브러리와 훅을 임포트
import './App.css'; // CSS 파일 임포트
import theLittlePrince from './Book/the_little_prince.txt'; // 텍스트 파일을 임포트
//되나
//음
//1
//2
//3

// 타이핑 게임에 사용할 단어 리스트
const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'];

function App() {
    const [gameMode, setGameMode] = useState('');
    const [fallingWords, setFallingWords] = useState([]);
    const [gameInterval, setGameInterval] = useState(null);
    const [inputWord, setInputWord] = useState('');
    const [mistakes, setMistakes] = useState(0);
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [bookText, setBookText] = useState('');
    const [typedText, setTypedText] = useState('');
    const [inputText, setInputText] = useState('');
    const maxMistakes = 6;
    const [countdown, setCountdown] = useState(null);
    const [isWordGuessed, setIsWordGuessed] = useState(false);

    const hangmanWords = [
        { word: 'javascript', hint: 'A popular programming language.' },
        { word: 'hangman', hint: 'A classic word guessing game.' },
        { word: 'coding', hint: 'Writing instructions for computers.' },
        { word: 'developer', hint: 'A person who creates software.' },
        { word: 'computer', hint: 'An electronic device for storing and processing data.' },
        { word: 'kimhayoon', hint: '대한민국에서 제일 많은 성, 가장 낮은 단계, 파도에 햇빛이 일렁일렁 비치는거의 앞글자' },
        { word: 'yiminji', hint: '숫자 2, 여자 중에 흔한 이름' },
        { word: 'parkjonghyo', hint: '흥부가 뭘 갈라서 부자가 됐음, 1월1일이 될 때 치는거, 부모에게 해야하는 것' },
        { word: 'tom n jerry', hint: 'MJ favorite game' }
    ];

    useEffect(() => {
        if (gameMode === 'typing') {
            const interval = setInterval(() => {
                createWord();
                moveWords();
            }, 1000);
            setGameInterval(interval);
            return () => clearInterval(interval);
        }
    }, [gameMode]);

    useEffect(() => {
        if (gameMode === 'typingBook') {
            fetch(theLittlePrince)
                .then(response => response.text())
                .then(text => setBookText(text));
        }
    }, [gameMode]);

    useEffect(() => {
        if (isWordGuessed) {
            let counter = 5;
            setCountdown(counter);
            const interval = setInterval(() => {
                counter -= 1;
                setCountdown(counter);
                if (counter === 0) {
                    clearInterval(interval);
                    startHangmanGame();
                    setCountdown(null);
                    setIsWordGuessed(false);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isWordGuessed]);

    const startGame = () => {
        setGameMode('typing');
        setFallingWords([]);
        setInputWord('');
    };

    const startHangmanGame = () => {
        const randomIndex = Math.floor(Math.random() * hangmanWords.length);
        const selectedWord = hangmanWords[randomIndex].word;
        const selectedHint = hangmanWords[randomIndex].hint;
        setGameMode('hangman');
        setGuessedLetters([]);
        setMistakes(0);
        setFallingWords([{ word: selectedWord, hint: selectedHint, guessed: '' }]);
    };

    const startTypingBook = () => {
        setGameMode('typingBook');
        setTypedText('');
        setInputText('');
    };

    const createWord = () => {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setFallingWords(prevWords => [...prevWords, { word: randomWord, top: 0, left: Math.random() * (window.innerWidth - 100) }]);
    };

    const moveWords = () => {
        setFallingWords(prevWords => prevWords.map(word => ({ ...word, top: word.top + 10 })));
    };

    const handleInputChange = (e) => {
        setInputWord(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            const index = fallingWords.findIndex(word => word.word === inputWord.trim());
            if (index !== -1) {
                setFallingWords(prevWords => prevWords.filter((_, i) => i !== index));
                setInputWord('');
            }
        }
    };

    const handleHangmanInput = (e) => {
        const inputLetter = e.target.value.toLowerCase();
        if (inputLetter && inputLetter.length === 1 && /^[a-z]$/.test(inputLetter)) {
            if (!guessedLetters.includes(inputLetter)) {
                setGuessedLetters([...guessedLetters, inputLetter]);
                if (!fallingWords[0].word.includes(inputLetter)) {
                    setMistakes(prev => prev + 1);
                }
            }
            e.target.value = '';
        }
    };

    const handleTyping = (e) => {
        const value = e.target.value;
        setInputText(value);
        if (bookText.startsWith(value)) {
            setTypedText(value);
        }
    };

    const handleTypingKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (bookText.startsWith(inputText)) {
                setTypedText(prev => prev + inputText);
                setInputText('');
            }
        }
    };

    const drawHangman = () => {
        const hangmanStages = [
            `\n\n\n\n\n\n_______\n |     |\n |     |\n`,
            `\n\n\n\n\n\n_______\n |     |\n |     |\n |     O\n`,
            `\n\n\n\n\n\n_______\n |     |\n |     |\n |     O\n |     |\n`,
            `\n\n\n\n\n\n_______\n |     |\n |     |\n |     O\n |    /|\n`,
            `\n\n\n\n\n\n_______\n |     |\n |     |\n |     O\n |    /|\\\n`,
            `\n\n\n\n\n\n_______\n |     |\n |     |\n |     O\n |    /|\\\n |    /\n`,
            `\n\n\n\n\n\n_______\n |     |\n |     |\n |     O\n |    /|\\\n |    / \\\n`
        ];
        return hangmanStages[mistakes];
    };

    const updateHangmanDisplay = () => {
        if (fallingWords.length === 0) return null;
        const word = fallingWords[0].word;
        const hint = fallingWords[0].hint;
        const displayWord = word.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');

        // 모든 글자를 맞췄는지 확인
        const wordGuessed = word.split('').every(letter => guessedLetters.includes(letter));
        if (wordGuessed && !isWordGuessed) {
            setIsWordGuessed(true);
        }

        return (
            <div>
                <p>{displayWord}</p>
                <p>Hint: {hint}</p>
                <p>Mistakes: {mistakes}/{maxMistakes}</p>
                <pre>{drawHangman()}</pre>
                {wordGuessed && <p>정답입니다! {countdown}초 뒤에 다음 문제가 출제됩니다!</p>} {/* 정답 알림 및 카운트다운 표시 */}
            </div>
        );
    };

    const resetGame = () => {
        setGameMode('');
        clearInterval(gameInterval);
        setFallingWords([]);
        setInputWord('');
        setMistakes(0);
        setGuessedLetters([]);
    };

    return (
        <div className="App">
            <button id="backButton" onClick={resetGame} style={{ display: gameMode !== '' ? 'block' : 'none', fontSize: '0.8rem', marginLeft: '20px' }}>Back</button>
            <h1>Typing and Hangman Games!</h1>
            {gameMode === '' && (
                <>
                    <button id="TypingBook" onClick={startTypingBook}>Start TypingBook</button>
                    <button id="startButton" onClick={startGame}>Start Typing Game</button>
                    <button id="hangmanButton" onClick={startHangmanGame}>Start Hangman Game</button>
                </>
            )}
            {gameMode === 'typing' && (
                <>
                    <div id="gameArea" style={{ display: 'block' }}>
                        {fallingWords.map((word, index) => (
                            <div key={index} className="falling-word" style={{ top: word.top, left: word.left }}>{word.word}</div>
                        ))}
                    </div>
                    <div id="inputArea" style={{ display: 'block' }}>
                        <input
                            type="text"
                            id="wordInput"
                            value={inputWord}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            placeholder="여기에 영어를 입력해서 지워주세요"
                            autoFocus
                        />
                    </div>
                </>
            )}
            {gameMode === 'hangman' && (
                <>
                    <div id="hangmanArea" style={{ display: 'block' }}>
                        {updateHangmanDisplay()}
                    </div>
                    <div id="hangmanInputArea" style={{ display: 'block' }}>
                        <input
                            type="text"
                            id="hangmanInput"
                            onChange={handleHangmanInput}
                            placeholder="여기에 글자를 입력하세요"
                            autoFocus
                        />
                    </div>
                </>
            )}
            {gameMode === 'typingBook' && (
                <div className="typingBookContainer">
                    <div className="bookText" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                        <span style={{ color: 'black' }}>{typedText}</span>
                        <span style={{ color: 'gray' }}>{bookText.slice(typedText.length)}</span>
                    </div>
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleTyping}
                        onKeyDown={handleTypingKeyDown}
                        placeholder="책 내용을 타이핑하세요"
                        style={{ position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '80%' }}
                        autoFocus
                    />
                </div>
            )}
            <div id="gameOverMessage" style={{ display: mistakes >= maxMistakes ? 'block' : 'none' }}>Game Over!</div>
        </div>
    );
}

export default App;