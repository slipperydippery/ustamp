document.body.addEventListener('mouseover', (event) => {
  const target = event.target;
  if (target && target.textContent && !isNaN(target.textContent)) {
    const timestamp = parseInt(target.textContent, 10);
    if (!isNaN(timestamp) && timestamp.toString().length >= 10) {
      const date = new Date(timestamp * 1000);
      const localDate = fmt(date, '');
      const utcDate = fmt(date, 'UTC');
      const tooltip = `Local: ${localDate} UTC: ${utcDate}`;
      target.title = tooltip;
    }
  }

  function fmt(date, sfx) {
    const p = `get${sfx}`;
    return (
      `${date[`${p}FullYear`]()}-${
        zpad(date[`${p}Month`]() + 1)}-${
        zpad(date[`${p}Date`]())} ${
        zpad(date[`${p}Hours`]())}:${
        zpad(date[`${p}Minutes`]())}:${
        zpad(date[`${p}Seconds`]())}`
    );
  }

  function zpad(v) {
    return (`0${v}`).slice(-2);
  }

});


