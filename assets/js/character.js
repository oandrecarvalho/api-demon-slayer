const params = new URLSearchParams(window.location.search);
let characterId = parseInt(params.get("id")) || 1;
console.log("ID do personagem:", characterId);

const container = document.getElementById("character-detail");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

async function getCharacter(id) {
  try {
    container.innerHTML = "Carregando...";
    const response = await fetch(
      `https://www.demonslayer-api.com/api/v1/characters?id=${id}`
    );
    const data = await response.json();
    console.log("Dados da API:", data);

    // Acessando o primeiro item do array "content"
    const character = data.content[0] || {};

    let imageUrl = character.img || "https://via.placeholder.com/150";

    // Criando a lista de estilos de combate
    let combatStylesHTML = "";
    if (character.combat_style && character.combat_style.length > 0) {
      combatStylesHTML = `
      <h2>Estilos de Combate:</h2>
      ${character.combat_style
        .map(
          (style) => `
        <p><strong>${style.name}:</strong> ${style.description}</p>
        `
        )
        .join("")}
        `;
    } else {
      combatStylesHTML =
        "<p><strong>Estilos de Combate:</strong> Nenhum registrado.</p>";
    }

    container.innerHTML = `
            <img src="${imageUrl}" alt="${character.name || "Desconhecido"}">
            <h2>${character.name || "Desconhecido"}</h2>
            <p><strong>Idade:</strong> ${character.age || "Desconhecida"}</p>
            <p><strong>Sexo:</strong> ${character.gender || "Desconhecido"}</p>
            <p><strong>Raça:</strong> ${character.race || "Desconhecida"}</p>
            <p><strong>Descrição:</strong> ${
              character.description || "Sem descrição disponível"
            }</p>
            <p><strong>Citação:</strong> "${
              character.quote || "Sem citação disponível"
            }"</p>
            ${combatStylesHTML} 
        `;

    prevButton.disabled = characterId === 1;
    nextButton.disabled = characterId === 45;

    prevButton.addEventListener("click", () => {
      if (characterId > 1) {
        characterId--;
        history.pushState(null, "", `?id=${characterId}`);
        getCharacter(characterId);
      }
    });

    nextButton.addEventListener("click", () => {
      characterId++;
      history.pushState(null, "", `?id=${characterId}`);
      getCharacter(characterId);
    });
  } catch (error) {
    console.error("Erro ao carregar personagem:", error);
    container.innerHTML = "Erro ao carregar personagem.";
  }
}

document.addEventListener("DOMContentLoaded", () => getCharacter(characterId));
