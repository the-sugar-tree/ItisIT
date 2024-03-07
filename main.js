var pressed = false;
const apply_button = document.getElementById("apply-button");

apply_button.addEventListener("click", function (event) {
    if (!pressed) {
        event.preventDefault();
        apply_button.innerText = "신청 바로가기 (아래 내용 꼭 읽어주세요!)\n(한 번 더 누르면 내려갑니다)"
        pressed = true;
    }
})