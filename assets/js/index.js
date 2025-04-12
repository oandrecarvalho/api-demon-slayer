let currentPage = 1;
const container = document.getElementById("character-container");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

async function getCharacters(page) {
    try {
        container.innerHTML = "Carregando...";

        const response = await fetch(
            `https://www.demonslayer-api.com/api/v1/characters?page=${page}`
        );
        const data = await response.json();

        container.innerHTML = "";
        console.log(data);

        const characters = data.content || [];

        characters.forEach((character) => {
            const card = document.createElement("div");
            card.className = "card";

            let imageUrl = character.img || "https://via.placeholder.com/150";

            card.innerHTML = `
                <img src="${imageUrl}" alt="${character.name}" onerror="this.src='https://via.placeholder.com/150'">
                <p>${character.name}</p>
            `;

            card.addEventListener("click", () => {
                window.location.href = `character.html?id=${character.id}`;
            });

            container.appendChild(card);
        });

        prevButton.disabled = !data.pagination.previousPage;
        nextButton.disabled = !data.pagination.nextPage;

        prevButton.onclick = () => {
            if (data.pagination.previousPage) {
                currentPage--;
                getCharacters(currentPage);
            }
        };

        nextButton.onclick = () => {
            if (data.pagination.nextPage) {
                currentPage++;
                getCharacters(currentPage);
            }
        };
    } catch (error) {
        console.error("Erro ao carregar personagens", error);
        container.innerHTML = "Erro ao carregar personagens";
    }
}

document.addEventListener("DOMContentLoaded", () => getCharacters(currentPage));
