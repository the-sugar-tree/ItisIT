var pressed = false;
const apply_button = document.getElementById('apply-button');

apply_button.addEventListener('click', function (event) {
  if (!pressed) {
    event.preventDefault();
    apply_button.innerText =
      '신청 바로가기 \n(설마 밑에 안 읽으신건 아니죠..?)';
    pressed = true;
  }
});
