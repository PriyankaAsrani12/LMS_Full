$(() => {
  $.get("/quiz/database", (qa) => {
    for (let q of qa) {
      // console.log(p)
      $("#quiz").append(
        $(`
        <h3>Q-${q.id} ${q.question}</h3>
        <input type="checkbox" name="a" id="a">${q.optiona}</input>
        <input type="checkbox" name="b" id="b">${q.optionb}</input>
        <input type="checkbox" name="c" id="c">${q.optionc}</input>
        <input type="checkbox" name="d" id="d">${q.optiond}</input>
        <br>
    `)
      );
    }
  });
});

function submitfunc() {
  console.log("button clicked");
  var score = document.querySelector('input[name="question1"]:checked').value;
  console.log(score);
}
