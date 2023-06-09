/* Yin Yang Coin code goes here */
/*
    Steps:

    1.  After the user clicks the Yin Yang continent, the Title Screen should
        display, with a center div showing expositionary text.
        Bottom button should say "Start".
    2.  After the user clicks "Start", the center div's text disappears and
        in its place instructions show up.
        Bottom button should say "Concentrate on your question... then continue!"
    3.  After the user clicks on the button, the center div should disappear and
        in its place two divs as in the Fortune Telling Screen design.
        Bottom button should now say "Toss Coins".
    4.  Keep a counter that's currently 0. Every time the user presses "Toss Coins"
        the counter increases, generate a random result for the 3 coins getting
        tossed in the large right div, then show the result in the left div (the
        "Toss Coins" button should be made inactive while this is happening so that
        the user can't skip through and toss 6 times really fast)
    5.  Once the counter reaches 6, the bottom button should say "See Results"
    6.  Once the user clicks on See Results, the left div should show the graphic
        of the resulting hexagram while the right div should show "You received the
        _ hexagram" + meaning as shown in the design.
        There should now be two bottom buttons - "Return to Map" and "Toss Again?"
        (Alternatively: same button says "Toss Again?" with Home button always
        being available)
*/

import FortuneEngine from '../../engine.js';

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  // Read contents from JSON using FortuneEngine
  const engine = new FortuneEngine('ying_yang_coin');
  await engine.db_reader('yin_yang_coin.json');

  /**
   * Count up to 6 times for tossing
   */
  let tossCounter = 0;

  /**
   * After 6 times tossing, it will access to the index in JSON file and pull out the result
   */
  let hexagramIndex = 0;

  /**
   * Stores the current power of 2 (shifted once to the left in each iteration)
   */
  let powerOfTwo = 1;

  /**
   * Contents of the ying_yang_coin.json file.
   */
  const jsonFile = engine.get_json_contents();

  /**
   * Array of 64 hexagram objects.
   */
  const hexagrams = jsonFile.hexagrams; // eslint-disable-line

  /**
   * Start button element
   */
  const buttonElement = document.querySelector('.action-button');
  const musicButton = document.getElementById('music-button');
  const infoButton = document.getElementById('info-button');

  const lineImg = document.querySelector('.line-image');
  const lineTxt = document.getElementById('line-text');
  const gridList = document.querySelectorAll('#grid');
  const contentGrid = document.querySelector('.content-grid');

  const instructionImg = document.getElementById('instruction-image');
  const instructionTxt = document.getElementById('instruction-text');
  const intepretationTxt = document.getElementById('interpretation-text');
  const character = document.getElementById('character');
  const coinDisplay = document.querySelector('.coin-display');
  const coins = document.getElementsByClassName('coins');

  let musicEnabled = true;
  let showInfo = false;

  // Background music
  const bgm = new Audio('background_music1.mp3');
  const flipSound = new Audio('coin_flipv3.ogg');
  bgm.loop = true;
  bgm.volume = 0.3;
  flipSound.volume = 0.4;
  bgm.play();

  // Music Button
  musicButton.addEventListener('click', (event) => {
    console.log('music');
    const musicImg = document.getElementById('music');
    if (musicEnabled) {
      musicImg.src = '../../assets/audio_off.png';
      bgm.pause();
    } else {
      musicImg.src = '../../assets/audio_on.png';
      bgm.play();
    }
    musicEnabled = !musicEnabled;
  });

  // Info Button
  infoButton.addEventListener('click', (event) => {
    const infoPopup = document.getElementById('info-popup');
    infoPopup.style.display = !showInfo ? 'flex' : 'none';
    showInfo = !showInfo;
  });

  /**
   *  Create the action for the button when it's clicked
   */
  buttonElement.addEventListener('click', (event) => {
    const buttonElement = event.target;
    const buttonValue = buttonElement.value;
    console.log(buttonValue);

    // Start State
    switch (buttonValue) {
      case 'start':
        // Update Button State
        buttonElement.value = 'toss';
        buttonElement.innerText = 'Toss Coins';

        // Update Content Screen
        lineTxt.innerText = 'Record';
        lineTxt.style.fontSize = '3rem';

        instructionImg.style.display = 'none';
        instructionTxt.style.display = 'none';
        lineImg.style.display = 'none';
        coinDisplay.style.display = 'block';

        break;

      case 'toss':
        // Backend Generation
        //  Generate a random result for tossing 3 coins
        const coinResult = engine.get_random_subset(1)[0];  //  eslint-disable-line
        console.log('coinResult:', coinResult.value);
        console.log('Power of two:', powerOfTwo);

        //  Calculate the Hexagram Index
        hexagramIndex += coinResult.value * powerOfTwo;
        powerOfTwo = powerOfTwo << 1;

        console.log('Hexagram Index:', hexagramIndex);

        tossCounter++;
        console.log('Tossing coins! tossCounter =', tossCounter);

        // UI Generation

        /* if (tossCounter === 6) {
          buttonElement.value = 'result';
          buttonElement.innerText = 'Get Result';
        } */

        // Lines Animation
        console.log(gridList[tossCounter]);
        if (coinResult.type === 'Yin') {
          setTimeout(function () {
            gridList[tossCounter - 1].innerHTML += '<img class="animated-line-image" src="broken_line.PNG" alt="instruction image display failed."/>';
          }, 4500);
        } else {
          setTimeout(function () {
            gridList[tossCounter - 1].innerHTML += '<img class="animated-line-image" src="solid_line.PNG" alt="instruction image display failed."/>';
          }, 4500);
        }

        // Coin Rotation
        const coinStates = coinResult.coins.toLowerCase();  //  eslint-disable-line
        const coinState1 = coinStates.slice(0, 1);          //  eslint-disable-line
        const coinState2 = coinStates.slice(1, 2);          //  eslint-disable-line
        const coinState3 = coinStates.slice(2, 3);          //  eslint-disable-line

        coins[0].style.animation = `${coinState1}-rotate-${tossCounter % 2} 4.3s ease forwards`;
        coins[1].style.animation = `${coinState2}-rotate-${tossCounter % 2} 4.3s ease forwards`;
        coins[2].style.animation = `${coinState3}-rotate-${tossCounter % 2} 4.3s ease forwards`;
        flipSound.play();

        // Set button delay
        buttonElement.style.pointerEvents = 'none';
        buttonElement.innerText = 'Tossing Coins...';
        setTimeout(() => {
          buttonElement.style.pointerEvents = 'all';
          buttonElement.innerText = 'Toss Coins';
          // Update Button State
          if (tossCounter === 6) {
            buttonElement.value = 'result';
            buttonElement.innerText = 'Get Result';
          }
        }, 5500);

        break;

      case 'result':
        // Map hexigram to intepretation
        const hexagram = hexagrams[hexagramIndex];  //  eslint-disable-line
        console.log('Hexagram Result:', hexagram);

        // Update Button State
        buttonElement.value = 'reset';
        buttonElement.innerText = 'New Round';

        // Update Content Screen
        character.innerHTML = hexagram.character;
        instructionTxt.innerHTML = `"${hexagram.name}"`;
        intepretationTxt.innerHTML = `"${hexagram.meaning}"`;

        setTimeout(() => {
          character.className = 'active';
          if (hexagram.character.length === 2) {
            character.style.marginRight = '1%';
          } else {
            character.style.marginRight = '3%';
          }
        }, 3500);

        instructionTxt.style.animation = 'blurFadeIn 3s ease-in forwards';
        instructionTxt.style.fontSize = '3rem';
        instructionTxt.style.display = 'block';
        coinDisplay.style.display = 'none';

        contentGrid.style.display = 'grid';

        // Set animation delay
        setTimeout(() => {
          intepretationTxt.style.display = 'inline-block';
        }, 7500);

        // Set button delay
        buttonElement.style.pointerEvents = 'none';
        setTimeout(() => {
          buttonElement.style.pointerEvents = 'all';
        }, 11000);

        break;

      case 'reset':
        hexagramIndex = 0;
        tossCounter = 0;
        powerOfTwo = 1;

        // Update Button State
        buttonElement.value = 'start';
        buttonElement.innerText = 'Start';

        // Update Content Screen
        for (const coin of coins) {
          coin.style.animation = 'none';
        }

        character.innerHTML = '';
        intepretationTxt.innerHTML = '';
        instructionTxt.innerHTML = 'Instruction';
        lineTxt.innerHTML = 'Side Info';

        character.className = 'inactive';
        instructionTxt.style.fontSize = '2rem';
        instructionTxt.style.animation = 'none';
        instructionImg.style.display = 'inline-block';
        intepretationTxt.style.display = 'none';

        contentGrid.style.display = 'inline';

        // Update Side Screen
        lineTxt.style.fontSize = '2rem';
        lineImg.style.display = 'inline-block';

        for (let i = 0; i < 6; i++) {
          console.log(gridList[i]);
          gridList[i].innerHTML = '';
        }

        break;
    }
  });
});
