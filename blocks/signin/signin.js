export default function decorate(block) {

  const items = block.querySelectorAll("p");

  const signIn = items[0];
  const lang = items[1];

  lang.classList.add("language");

  /* Create dropdown */

  const dropdown = document.createElement("div");
  dropdown.className = "lang-dropdown";

  dropdown.innerHTML = `
    <div>EN-US</div>
    <div>FR</div>
    <div>DE</div>
  `;

  lang.appendChild(dropdown);

  /* Toggle dropdown */

  lang.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

  /* Select language */

  dropdown.querySelectorAll("div").forEach((item) => {
    item.addEventListener("click", () => {
      lang.firstChild.textContent = item.textContent;
      dropdown.style.display = "none";
    });
  });

}