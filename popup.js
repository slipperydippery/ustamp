// Get fields
const closeButtons = document.querySelectorAll('.should-close');
const copyTimestampButton = document.getElementById('copy-timestamp');
const startStopButton = document.getElementById('startstop');
const highlightTimestampsButton = document.getElementById('highlightTimestamps');

const yearField = document.getElementById('year');
const monthField = document.getElementById('month');
const dayField = document.getElementById('day');
const hourField = document.getElementById('hour');
const minuteField = document.getElementById('minute');
const secondField = document.getElementById('second');

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
  yearField.value = date.getFullYear();
  monthField.value = monthNames[date.getMonth()];
  dayField.value = date.getDate();
  hourField.value = String(date.getHours()).padStart(2, '0');
  minuteField.value = String(date.getMinutes()).padStart(2, '0');
  secondField.value = String(date.getSeconds()).padStart(2, '0');
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

  if (event.target === yearField) {
    date.setFullYear(date.getFullYear() + (event.deltaY > 0 ? -1 : 1));
  } else if (event.target === monthField) {
    date.setMonth(date.getMonth() + (event.deltaY > 0 ? -1 : 1));
  } else if (event.target === dayField) {
    date.setDate(date.getDate() + (event.deltaY > 0 ? -1 : 1));
  } else if (event.target === hourField) {
    date.setHours(date.getHours() + (event.deltaY > 0 ? -1 : 1));
  } else if (event.target === minuteField) {
    date.setMinutes(date.getMinutes() + (event.deltaY > 0 ? -1 : 1));
  } else if (event.target === secondField) {
    date.setSeconds(date.getSeconds() + (event.deltaY > 0 ? -1 : 1));
  }

  // Check if the date is before the Unix Epoch
  if (date < new Date(1970, 0, 1, 0, 0, 0)) {
    date = new Date(1970, 0, 1, 0, 0, 0);
  }

  updateFields();
}

function truncateDateTo(field) {
  switch(field) {
    case 'year':
      date = new Date(date.getFullYear(), 0);
      break;
    case 'month':
      date = new Date(date.getFullYear(), date.getMonth(), 1);
      break;
    case 'day':
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      break;
    case 'hour':
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
      break;
    case 'minute':
    case 'second':
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
      break;
  }
  updateFields();
}

function copyCurrentTimestamp() {
  let timestampDate = new Date(
    yearField.value,
    monthNames.indexOf(monthField.value),
    dayField.value,
    +hourField.value,
    +minuteField.value,
    +secondField.value
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

yearField.addEventListener('wheel', stopUpdating);
yearField.addEventListener('click', stopUpdating);
monthField.addEventListener('wheel', stopUpdating);
monthField.addEventListener('click', stopUpdating);
dayField.addEventListener('wheel', stopUpdating);
dayField.addEventListener('click', stopUpdating);
hourField.addEventListener('wheel', stopUpdating);
hourField.addEventListener('click', stopUpdating);
minuteField.addEventListener('wheel', stopUpdating);
minuteField.addEventListener('click', stopUpdating);
secondField.addEventListener('wheel', stopUpdating);
secondField.addEventListener('click', stopUpdating);

yearField.addEventListener('wheel', scrollDateEvent);
monthField.addEventListener('wheel', scrollDateEvent);
dayField.addEventListener('wheel', scrollDateEvent);
hourField.addEventListener('wheel', scrollDateEvent);
minuteField.addEventListener('wheel', scrollDateEvent);
secondField.addEventListener('wheel', scrollDateEvent);

yearField.addEventListener('click', () => truncateDateTo('year'));
monthField.addEventListener('click', () => truncateDateTo('month'));
dayField.addEventListener('click', () => truncateDateTo('day'));
hourField.addEventListener('click', () => truncateDateTo('hour'));
minuteField.addEventListener('click', () => truncateDateTo('minute'));
secondField.addEventListener('click', () => truncateDateTo('second'));

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
