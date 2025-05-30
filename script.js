let language = 'eng';




function nextSection(sectionNum) {
  document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
  document.getElementById('section' + sectionNum).style.display = 'block';
}

function previousSection(sectionNum) {
  document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
  document.getElementById('section' + sectionNum).style.display = 'block';
}

function openSection(sectionNum) {
  document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
  document.getElementById('section' + sectionNum).style.display = 'block';
}
// === Анимация движения мячика ===

let canvas, ctx;
let ball = { x: 70, y: 150, radius: 10 };
let animationTimer = null;
let currentStep = 0;
let directions = ["RIGHT", "DOWN", "LEFT", "UP", "RIGHT", "DOWN", "LEFT", "UP", "RIGHT", "DOWN", "LEFT", "UP", "RIGHT"];
let moveSteps = 0;
let moveDirection = "";

function startAnimation() {
  canvas = document.getElementById('animationCanvas');
  ctx = canvas.getContext('2d');
  if (animationTimer) clearInterval(animationTimer);
  moveSteps = 0;
  currentStep = 0;
  moveDirection = directions[currentStep];
  animationTimer = setInterval(animateBall, 30);
}

function animateBall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bg = new Image();
  bg.src = 'assets/img/animation_background.png';
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  if (moveSteps >= 50) {
    currentStep++;
    if (currentStep >= directions.length) {
      clearInterval(animationTimer);
      return;
    }
    moveSteps = 0;
    moveDirection = directions[currentStep];
  } else {
    moveSteps++;
    moveBall();
  }

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function moveBall() {
  switch (moveDirection) {
    case "RIGHT": ball.x += 2; break;
    case "DOWN": ball.y += 2; break;
    case "LEFT": ball.x -= 2; break;
    case "UP": ball.y -= 2; break;
  }
}

function stopAnimation() {
  if (animationTimer) clearInterval(animationTimer);
}

function backAnimation() {
  if (animationTimer) clearInterval(animationTimer);
  currentStep = 0;
  ball.x = 70;
  ball.y = 150;
  moveSteps = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const bg = new Image();
  bg.src = 'assets/img/animation_background.png';
  bg.onload = () => {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  };
}

// === Генерация ключей DES ===

const pc1 = [
  57, 49, 41, 33, 25, 17, 9,
  1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27,
  19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15,
  7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29,
  21, 13, 5, 28, 20, 12, 4
];

const pc2 = [
  14, 17, 11, 24, 1, 5,
  3, 28, 15, 6, 21, 10,
  23, 19, 12, 4, 26, 8,
  16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55,
  30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53,
  46, 42, 50, 36, 29, 32
];

const shifts = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

function leftShift(bits, n) {
  return bits.slice(n).concat(bits.slice(0, n));
}

function generateDESKeys() {
  const input = document.getElementById("inputKey").value.trim();
  const output = document.getElementById("keyOutput");

  if (input.length !== 64 || !/^[01]+$/.test(input)) {
    output.innerHTML = "<p style='color:red;'>Please enter a valid 64-bit binary key.</p>";
    return;
  }

  const permutedKey = pc1.map(i => input[i - 1]);
  let C = permutedKey.slice(0, 28);
  let D = permutedKey.slice(28, 56);
  let roundKeys = [];

  for (let i = 0; i < 16; i++) {
    C = leftShift(C, shifts[i]);
    D = leftShift(D, shifts[i]);
    const combined = C.concat(D);
    const roundKey = pc2.map(j => combined[j - 1]).join('');
    roundKeys.push(roundKey);
  }

  output.innerHTML = `<h3>Generated Round Keys:</h3><ol style="padding-left: 20px;">${
    roundKeys.map((k, i) => `<li>Round ${i + 1}: <code>${k}</code></li>`).join('')
  }</ol>`;

  // ✅ Показываем изображение
  console.log("✅ Показываю изображение");
  document.getElementById("keyImageContainer").style.display = "block";
}

function checkQuiz() {
  const answers = {
    q1: "a",
    q2: "c",
    q3: "a",
    q4: "b",
    q5: "c",
    q6: "b",
    q7: "c",
    q8: "c",
    q9: "c",
    q10: "b",
    q11: "b",
    q12: "c",
    q13: "b"
  };

  const explanations = {
    q1: "DES stands for Data Encryption Standard, a symmetric-key algorithm.",
    q2: "DES has 16 rounds of processing in its algorithm.",
    q3: "The DES key size is 56 bits after removing parity bits from the 64-bit input key.",
    q4: "DES operates on 64-bit blocks.",
    q5: "DES uses a Feistel network internally.",
    q6: "DES applies an initial permutation at the start of encryption.",
    q7: "During key scheduling, DES generates 16 subkeys.",
    q8: "XOR operation is used after expansion with the subkey in each round.",
    q9: "DES was replaced by AES because it became vulnerable to brute-force attacks due to its small key size.",
    q10: "DES ends with a final permutation (inverse of initial permutation).",
    q11: "PC-1 selects 56 bits from the 64-bit key by dropping parity bits.",
    q12: "Left shifts (rotations) are applied to halves C and D during key scheduling.",
    q13: "PC-2 compresses and permutes the halves to generate a 48-bit subkey."
  };

  let totalQuestions = Object.keys(answers).length;
  let correctCount = 0;
  let resultsHTML = '';

  for (let i = 1; i <= totalQuestions; i++) {
    let q = "q" + i;
    let userAnswerElem = document.querySelector(`input[name=${q}]:checked`);
    let userAnswer = userAnswerElem ? userAnswerElem.value : null;
    let isCorrect = userAnswer === answers[q];

    if (isCorrect) correctCount++;

    // Формируем HTML с результатом для каждого вопроса
    resultsHTML += `
      <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;
          background-color: ${isCorrect ? '#d4edda' : '#f8d7da'};">
        <p><strong>Question ${i}:</strong></p>
        <p>Your answer: <strong>${userAnswer ? userAnswer.toUpperCase() : '<em>Not answered</em>'}</strong></p>
        <p>Correct answer: <strong>${answers[q].toUpperCase()}</strong></p>
        ${!isCorrect ? `<p><em>Explanation:</em> ${explanations[q]}</p>` : ''}
      </div>
    `;
  }

  let scorePercent = ((correctCount / totalQuestions) * 100).toFixed(2);
  resultsHTML = `<h3 style="text-align:center;">You answered ${correctCount} out of ${totalQuestions} correctly (${scorePercent}%)</h3>` + resultsHTML;

  // Скрываем секшен с тестом и показываем результаты
  document.getElementById("section13").style.display = "none";
  let resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = resultsHTML;
  document.getElementById("section14").style.display = "block";
}

// Функция кнопки "Back to Quiz"
function backToQuiz() {
  document.getElementById("section14").style.display = "none";
  document.getElementById("section13").style.display = "block";
}




