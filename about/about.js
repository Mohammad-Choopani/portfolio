const book = document.getElementById("book");
const totalPages = 10;

for (let i = 0; i < totalPages; i++) {
  const page = document.createElement("div");
  page.className = "page";
  page.style.zIndex = totalPages - i;

  const img = document.createElement("img");
  img.src = `/assets/images/pages/page${i + 1}.jpg`;
  img.alt = `Page ${i + 1}`;
  page.appendChild(img);

  page.addEventListener("click", () => {
    page.classList.toggle("flipped");
  });

  book.appendChild(page);
}
