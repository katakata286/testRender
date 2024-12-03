const dropdown_model = document.getElementById("dropdown-model");
const dropdown_btn = document.getElementById("dropdown-btn");
const item1 = document.getElementById("item1");
const item2 = document.getElementById("item2");

dropdown_model.addEventListener("mouseleave", () => {
	dropdown_model.classList.remove('active');
});

dropdown_btn.addEventListener("click", () => {
	dropdown_model.classList.toggle('active');
});

item1.addEventListener("click", (event) => {
	selectItem(event);  // 呼叫 selectItem 並傳遞事件物件
});

item2.addEventListener("click", (event) => {
	selectItem(event);  // 呼叫 selectItem 並傳遞事件物件
});

function selectItem(event) {
  event.preventDefault(); // 防止鏈接跳轉
  const selectedItem = event.target.textContent; // 獲取被點擊的文字
  dropdown_btn.innerHTML = `<span class="arrow">&#9662;</span> ${selectedItem}`; // 更新按鈕文字
  dropdown_model.classList.remove('active'); // 關閉下拉選單
}

document.addEventListener('click', (event) => {
  if (!dropdown_model.contains(event.target)) {
    dropdown_model.classList.remove('active');
  }
});