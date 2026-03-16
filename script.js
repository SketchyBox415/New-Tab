const input = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

let selectedIndex = -1;
let timer;

async function fetchSuggestions() {

    const query = input.value.trim();

    if (!query) {
        suggestionsBox.style.display = "none";
        return;
    }

    try {

        const res = await fetch(
            `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
        );

        const data = await res.json();
        const suggestions = data[1];

        if (!suggestions || suggestions.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        suggestionsBox.innerHTML = suggestions
            .map(s => `<div class="suggestion">${s}</div>`)
            .join("");

        suggestionsBox.style.display = "block";

        document.querySelectorAll(".suggestion").forEach(item => {
            item.onclick = () => {
                input.value = item.innerText;
                search();
            };
        });

        selectedIndex = -1;

    } catch (error) {
        console.error(error);
    }
}

input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(fetchSuggestions, 200);
});

input.addEventListener("keydown", (e) => {

    const items = document.querySelectorAll(".suggestion");

    if (e.key === "ArrowDown") {
        selectedIndex++;
        if (selectedIndex >= items.length) selectedIndex = 0;
        updateSelection(items);
        e.preventDefault();
    }

    else if (e.key === "ArrowUp") {
        selectedIndex--;
        if (selectedIndex < 0) selectedIndex = items.length - 1;
        updateSelection(items);
        e.preventDefault();
    }

    else if (e.key === "Enter") {
        if (selectedIndex > -1 && items[selectedIndex]) {
            input.value = items[selectedIndex].innerText;
        }
        search();
    }

});

function updateSelection(items) {

    items.forEach(i => i.classList.remove("active"));

    if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].classList.add("active");
        input.value = items[selectedIndex].innerText;
    }

}

function search() {

    const query = input.value.trim();

    if (query) {
        window.location.href =
            "https://www.google.com/search?q=" + encodeURIComponent(query);
    }

}

document.addEventListener("click", (e) => {

    if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = "none";
    }

});
