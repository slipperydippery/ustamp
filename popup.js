document.getElementById('copy-timestamp').addEventListener('click', copyCurrentTimestamp);

// Get the current date and time
const now = new Date();

// Get the input fields
const yearField = document.getElementById('year');
const monthField = document.getElementById('month');
const dayField = document.getElementById('day');
const hourField = document.getElementById('hour');
const minuteField = document.getElementById('minute');
const secondField = document.getElementById('second');

// Array of month names
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Set the value of each input field based on the current date and time
yearField.value = now.getFullYear();
monthField.value = monthNames[now.getMonth()]; // Use the current month number as an index to get the month name
dayField.value = now.getDate();
hourField.value = now.getHours();
minuteField.value = now.getMinutes();
secondField.value = now.getSeconds();

// Create a Date object
let date = new Date();

// Function to update the input fields based on the date
function updateFields() {
  yearField.value = date.getFullYear();
  monthField.value = monthNames[date.getMonth()];
  dayField.value = date.getDate();
  hourField.value = String(date.getHours()).padStart(2, '0'); // Pad the start of the string with '0' until it is 2 characters long
  minuteField.value = String(date.getMinutes()).padStart(2, '0'); // Pad the start of the string with '0' until it is 2 characters long
  secondField.value = String(date.getSeconds()).padStart(2, '0'); // Pad the start of the string with '0' until it is 2 characters long
}

function updateDots(sequenceStep) {
  const dot1 = document.getElementById('dot1');
  const dot2 = document.getElementById('dot2');
  const dot3 = document.getElementById('dot3');
  const dot4 = document.getElementById('dot4');

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

// Update the input fields initially
let isUpdating = true;
updateFields();
startUpdating();

// Function to start updating the fields
function startUpdating() {
  // Calculate the time remaining until the next full second
  let now = new Date();
  let delay = 1000 - (now.getMilliseconds());

  // Update the fields after the remaining time, then every full second
  setTimeout(() => {
    date = new Date(Math.floor(Date.now() / 1000));
    updateFields();
    updateDots((Math.floor(date.getTime() / 1000)) % 8);
    intervalId = setInterval(() => {
      date = new Date();
      updateFields();
      updateDots((Math.floor(date.getTime() / 1000)) % 8);
    }, 1000);
  }, delay);

  isUpdating = true;
}

// Function to stop updating the date fields
function stopUpdating() {
  isUpdating = false;
  clearInterval(intervalId);
}

// Get the start/stop button
const startStopButton = document.getElementById('startstop');

// Function to start or stop updating the fields
function toggleUpdating() {
  if (isUpdating) {
    clearInterval(intervalId);
  } else {
    startUpdating();
  }
  // Toggle the isUpdating flag
  isUpdating = !isUpdating;
}

// Add an event listener to the start/stop button
startStopButton.addEventListener('click', () => {
  date = new Date();
  updateFields();
  toggleUpdating();
});

// Add event listeners to stop updating the date fields when the user interacts with them
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

// Function to update the date and the fields
function updateDateAndFields(event) {
  event.preventDefault();

  // Update the date
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
    // Reset the date to the Unix Epoch
    date = new Date(1970, 0, 1, 0, 0, 0);
  }

  // Update the fields
  updateFields();
}

// Add wheel event listeners to the fields
yearField.addEventListener('wheel', updateDateAndFields);
monthField.addEventListener('wheel', updateDateAndFields);
dayField.addEventListener('wheel', updateDateAndFields);
hourField.addEventListener('wheel', updateDateAndFields);
minuteField.addEventListener('wheel', updateDateAndFields);
secondField.addEventListener('wheel', updateDateAndFields);

// Add a click event listener to the year field
yearField.addEventListener('click', () => {
  date = new Date(date.getFullYear(), 0);
  updateFields();
});

monthField.addEventListener('click', () => {
  date = new Date(date.getFullYear(), date.getMonth(), 1);
  updateFields();
});

dayField.addEventListener('click', () => {
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  updateFields();
});

hourField.addEventListener('click', () => {
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
  updateFields();
});

minuteField.addEventListener('click', () => {
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
  updateFields();
});

secondField.addEventListener('click', () => {
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
  updateFields();
});

// Function to handle the "copy current timestamp" functionality
function copyCurrentTimestamp() {
  let timestampDate = new Date(
    yearField.value,
    monthNames.indexOf(monthField.value),
    dayField.value,
    hourField.value,
    minuteField.value,
    secondField.value
  );

  let timestamp = timestampDate.getTime();

  navigator.clipboard.writeText(String(timestamp))
    .then(() => {
      showNotification(timestamp)
    })
    .catch(err => {
      console.error('Could not copy timestamp to clipboard: ', err);
    });
}

// Select all buttons with the class "should-close"
const closeButtons = document.querySelectorAll('.should-close');

// Add the event listener to each button
closeButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Your existing code...

    // Close the popup after a delay
    setTimeout(() => {
      window.close();
    }, 1000);  // Change this value to the number of milliseconds you want to delay
  });
});


document.getElementById('highlightTimestamps').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: highlightTimestamps
        });
    });
});

function showNotification(message) {
  const copyTimestampButton = document.getElementById('copy-timestamp');

  const originalText = copyTimestampButton.textContent;

  copyTimestampButton.innerHTML = `Copied ${message} 
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style="vertical-align: middle;">
  <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>`;

  copyTimestampButton.style.backgroundColor = 'var(--lipstick-red)';
  copyTimestampButton.style.color = 'var(--background)';

  // Reset the button's text after 3 seconds
  setTimeout(() => {
    copyTimestampButton.textContent = originalText;
    copyTimestampButton.style.backgroundColor = '';
    copyTimestampButton.style.color = '';
  }, 1000);
}


function highlightTimestamps() {
    const regex = /\b\d{10}\b/g;  // Regex to find 10 digit numbers which could be Unix timestamps

    function traverseNodes(node) {
        if (node.nodeType === 3) { // Text node
            const matches = [...node.textContent.matchAll(regex)];
            if (matches.length > 0) {
                const parent = node.parentNode;
                const frag = document.createDocumentFragment();
                let lastIndex = 0;
                matches.forEach(match => {
                  const timestamp = match[0];
              
                  // Add text before the match
                  frag.appendChild(document.createTextNode(node.textContent.substring(lastIndex, match.index)));
              
                  let span;
                  // Check if the parent node is a span
                  if (node.parentNode.nodeName === 'SPAN') {
                      span = node.parentNode;
                      // Replace only the timestamp within the span
                      span.innerHTML = span.innerHTML.replace(timestamp, '');
                  } else {
                      // Create the highlighted span
                      span = document.createElement('span');
                      frag.appendChild(span);
                  }
              
                  span.style.backgroundColor = 'yellow';
                  // Append the timestamp to the span
                  span.textContent = timestamp;
              
                  lastIndex = match.index + timestamp.length;
              });
              
// Add any remaining text after the last match
frag.appendChild(document.createTextNode(node.textContent.substring(lastIndex)));

// Replace the original text node with the new fragment
if (node.parentNode) {
    node.parentNode.replaceChild(frag, node);
}
            }
        } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') { // Element node
            node.childNodes.forEach(child => traverseNodes(child));
        }
    }

    traverseNodes(document.body);
}