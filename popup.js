// Get fields
const closeButtons = document.querySelectorAll('.should-close');
const copyTimestampButton = document.getElementById('copy-timestamp');
const startStopButton = document.getElementById('startstop');
const highlightTimestampsButton = document.getElementById('highlightTimestamps');

const yearField = document.getElementById('year');
const monthField = document.getElementById('month');
const dayField = document.getElementById('day');
const dayOfMonthField = document.getElementById('day-of-month');
const dayOfWeekField = document.getElementById('day-of-week');
const hourField = document.getElementById('hour');
const minuteField = document.getElementById('minute');
const secondField = document.getElementById('second');
const timeBoxFields = [
  yearField,
  monthField,
  dayField,
  dayOfMonthField,
  dayOfWeekField,
  hourField,
  minuteField,
  secondField,
]

const dots = document.querySelectorAll('.dot');
const dot1 = document.getElementById('dot1');
const dot2 = document.getElementById('dot2');
const dot3 = document.getElementById('dot3');
const dot4 = document.getElementById('dot4');

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let date = new Date();
let isUpdating = true;

// Main Process
startUpdating();

// Functions
function startUpdating() {
  let sequenceStep = 0;

  date = new Date();
  updateFields();

  let now = new Date();
  let delay = 1000 - (now.getMilliseconds());

  setTimeout(() => {
    date = new Date();
    updateFields();
    updateDots(sequenceStep % 8);
    sequenceStep++;

    intervalId = setInterval(() => {
      date = new Date();
      updateFields();
      updateDots(sequenceStep % 8);
      sequenceStep++;
    }, 1000);
  }, delay);

  isUpdating = true;
}

function stopUpdating() {
  isUpdating = false;
  clearInterval(intervalId);
  activateDotHoldingPattern();
}

function updateFields() {
  yearField.textContent = date.getFullYear();
  monthField.textContent = monthNames[date.getMonth()];
  dayOfMonthField.textContent = date.getDate();
  dayOfWeekField.textContent = date.toLocaleString('default', { weekday: 'long' });
  hourField.textContent = String(date.getHours()).padStart(2, '0');
  minuteField.textContent = String(date.getMinutes()).padStart(2, '0');
  secondField.textContent = String(date.getSeconds()).padStart(2, '0');
}

function updateDots(sequenceStep) {

  if ([0, 1, 2, 3].includes(sequenceStep)) {
    dot1.classList.add('active');
  } else {
    dot1.classList.remove('active');
  }

  if ([1, 2, 3, 4].includes(sequenceStep)) {
    dot2.classList.add('active');
  } else {
    dot2.classList.remove('active');
  }

  if ([2, 3, 4, 5].includes(sequenceStep)) {
    dot3.classList.add('active');
  } else {
    dot3.classList.remove('active');
  }

  if ([3, 4, 5, 6].includes(sequenceStep)) {
    dot4.classList.add('active');
  } else {
    dot4.classList.remove('active');
  }
}

function activateDotHoldingPattern() {
  dots.forEach(dot => dot.classList.add('active'));
  dots.forEach(dot => dot.classList.add('holding-animation'));
}

function deactivateDotHoldingPattern() {
  dots.forEach(dot => dot.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('holding-animation'));
}

function toggleUpdating() {
  if (isUpdating) {
    stopUpdating();
    activateDotHoldingPattern();
  } else {
    startUpdating();
    deactivateDotHoldingPattern();
  }
}

function scrollDateEvent(event) {
  event.preventDefault();

  switch (event.target) {
    case yearField:
      date.setFullYear(date.getFullYear() + (event.deltaY > 0 ? -1 : 1));
      break;
    case monthField:
      date.setMonth(date.getMonth() + (event.deltaY > 0 ? -1 : 1));
      break;
    case dayOfWeekField:
      date.setDate(date.getDate() + Math.sign(event.deltaY) * 7);
      break;
    case dayField:
    case dayOfMonthField:
      date.setDate(date.getDate() + (event.deltaY > 0 ? -1 : 1));
      break;
    case hourField:
      date.setHours(date.getHours() + (event.deltaY > 0 ? -1 : 1));
      break;
    case minuteField:
      date.setMinutes(date.getMinutes() + (event.deltaY > 0 ? -1 : 1));
      break;
    case secondField:
      date.setSeconds(date.getSeconds() + (event.deltaY > 0 ? -1 : 1));
      break;
    default:
      break;
  }

  // Check if the date is before the Unix Epoch
  if (date.getTime() < Date.UTC(1970, 0, 1, 0, 0, 0)) {
    date = new Date(Date.UTC(1970, 0, 1, 0, 0, 0));
  }

  updateFields();
}

function truncateDateTo(event) {
  switch (event.target) {
    case yearField:
      date = new Date(date.getFullYear(), 0);
      break;
    case monthField:
      date = new Date(date.getFullYear(), date.getMonth(), 1);
      break;
    case dayField:
    case dayOfMonthField:
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      break;
    case dayOfWeekField:
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
      break;
    case hourField:
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
      break;
    case minuteField:
    case secondField:
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
      break;
    default:
      break;
  }
  updateFields();
}

function copyCurrentTimestamp() {
  let timestampDate = new Date(
    +yearField.textContent,
    +monthNames.indexOf(monthField.textContent),
    +dayOfMonthField.textContent,
    +hourField.textContent,
    +minuteField.textContent,
    +secondField.textContent
  );

  let timestamp = Math.floor(timestampDate.getTime() / 1000);

  navigator.clipboard.writeText(String(timestamp))
    .then(() => {
      showNotification(timestamp)
    })
    .catch(err => {
      console.error('Could not copy timestamp to clipboard: ', err);
    });
}

function showNotification(message) {
  const originalText = copyTimestampButton.textContent;

  copyTimestampButton.innerHTML = `Copied ${message} 
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style="vertical-align: middle;">
  <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>`;

  copyTimestampButton.style.backgroundColor = 'var(--lipstick-red)';
  copyTimestampButton.style.color = 'var(--background)';

  setTimeout(() => {
    copyTimestampButton.textContent = originalText;
    copyTimestampButton.style.backgroundColor = '';
    copyTimestampButton.style.color = '';
  }, 1000);
}

function closeWindowOnClickedButton(button) {
  button.addEventListener('click', function () {
    setTimeout(() => {
      window.close();
    }, 1000);
  });
}

// Event listeners
copyTimestampButton.addEventListener('click', copyCurrentTimestamp);

startStopButton.addEventListener('click', () => {
  date = new Date();
  updateFields();
  toggleUpdating();
});

timeBoxFields.forEach(field => {
  field.addEventListener('wheel', stopUpdating);
  field.addEventListener('click', stopUpdating);
  field.addEventListener('wheel', scrollDateEvent);
  field.addEventListener('click', truncateDateTo);
});

closeButtons.forEach(closeWindowOnClickedButton);

highlightTimestampsButton.addEventListener('click', highlightActiveTabTimestamps);

function highlightActiveTabTimestamps() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: highlightTimestamps
    });
  });
}

function highlightTimestamps() {
  const regex = /\b\d{10}\b/g;

  function traverseNodes(node) {
    if (node.nodeType === 3) {
      const matches = [...node.textContent.matchAll(regex)];
      if (matches.length > 0) {
        const parent = node.parentNode;
        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        matches.forEach(match => {
          const timestamp = match[0];

          frag.appendChild(document.createTextNode(node.textContent.substring(lastIndex, match.index)));

          let span;
          if (node.parentNode.nodeName === 'SPAN') {
            span = node.parentNode;
            span.innerHTML = span.innerHTML.replace(timestamp, '');
          } else {
            span = document.createElement('span');
            frag.appendChild(span);
          }

          span.style.backgroundColor = 'yellow';
          span.textContent = timestamp;

          lastIndex = match.index + timestamp.length;
        });

        frag.appendChild(document.createTextNode(node.textContent.substring(lastIndex)));

        if (node.parentNode) {
          node.parentNode.replaceChild(frag, node);
        }
      }
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
      node.childNodes.forEach(child => traverseNodes(child));
    }
  }

  traverseNodes(document.body);
}
