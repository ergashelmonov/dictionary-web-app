let wrapper = document.querySelector(".wrapper"),
  darkModebtn = document.querySelector(".dark-mode"),
  font = document.querySelectorAll(".font"),
  textMode_btn = document.querySelector(".text-mode_btn"),
  textMode = document.querySelector(".text-mode"),
  search = document.querySelector(".search"),
  main = document.querySelector("main"),
  form = document.querySelector("form"),
  audio = document.querySelector("audio");

darkModebtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-colors");
  document.body.className.includes("dark-colors")
    ? (darkModebtn.innerHTML = `
  <svg width="81" height="22" viewBox="0 0 81 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="1" width="40" height="20" rx="10" fill="#A445ED" />
        <circle cx="30" cy="11" r="7" fill="white" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M60 10.449C59.9985 12.8283 60.8017 15.1383 62.2791 17.0033C63.7566 18.8683 65.8214 20.1788 68.138 20.7218C70.4545 21.2647 72.8866 21.0082 75.039 19.994C77.1912 18.9797 78.9373 17.2673 79.9931 15.1352C70.5442 15.1352 65.858 10.4479 65.858 1C64.0984 1.87311 62.6177 3.22033 61.5827 4.88981C60.5476 6.5593 59.9995 8.48469 60 10.449Z" stroke="#A445ED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`)
    : (darkModebtn.innerHTML = `  
            <svg
              width="81"
              height="22"
              viewBox="0 0 81 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="1" width="40" height="20" rx="10" fill="#757575" />
              <circle cx="10" cy="11" r="7" fill="white" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M60 10.449C59.9985 12.8283 60.8017 15.1383 62.2791 17.0033C63.7566 18.8683 65.8214 20.1788 68.138 20.7218C70.4545 21.2647 72.8866 21.0082 75.039 19.994C77.1912 18.9797 78.9373 17.2673 79.9931 15.1352C70.5442 15.1352 65.858 10.4479 65.858 1C64.0984 1.87311 62.6177 3.22033 61.5827 4.88981C60.5476 6.5593 59.9995 8.48469 60 10.449Z"
                stroke="#757575"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>`);
});

font.forEach((element) => {
  element.addEventListener("click", () => {
    textMode_btn.innerHTML =
      element.textContent + ` <img src="./src/img/path.svg" alt="" />`;
    if (element.textContent == "Mono") {
      document.body.classList.add("mono");
      document.body.classList.remove("serif");
      textMode.classList.add("hide");
    } else if (element.textContent == "Serif") {
      document.body.classList.add("serif");
      document.body.classList.remove("mono");
      textMode.classList.add("hide");
    } else {
      document.body.classList.remove("mono");
      document.body.classList.remove("serif");
      textMode.classList.add("hide");
    }
  });
});

textMode_btn.addEventListener("click", () =>
  textMode.className.includes("hide")
    ? textMode.classList.remove("hide")
    : textMode.classList.add("hide")
);

form.addEventListener("submit", (e) => e.preventDefault());

wrapper.addEventListener("click", (e) => {
  const target = e.target;
  !target.className == "text-mode_btn"
    ? textMode.classList.add("hide")
    : textMode;
});
dictionary(search.value).then((data) => {
  innerHtml(data);
});

search.addEventListener("blur", () => {
  if (search.value.length == 0) {
    search.style.border = `1px solid #ff5252`;
    search.nextElementSibling.innerText = `Whoops, can’t be empty…`;
  } else {
    search.style.border = ``;
    search.nextElementSibling.innerHTML = ``;
  }
  dictionary(search.value).then((data) => {
    try {
      innerHtml(data);
    } catch (err) {
      main.innerHTML = `
        <p class="smile">😕</p>
        <h3 class="err">${data.title}</h3>
        <p class="err-text">
          ${data.message} ${data.resolution}
        </p>`;
    }
  });
});

async function dictionary(inp) {
  let word = inp;
  let req = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  let data = req.json();
  return data;
}

function innerHtml(data) {
  return (
    (main.innerHTML = `
      <div class="word">
          <div class="speach">
            <h1>${data[0].word}</h1>
            <p class="read">${data[0].phonetic}</p>
          </div>
          <button class="listen" onclick="onAclick()">
            
          </button>
        </div>
        ${data[0].meanings
          .map((a) => {
            return ` <p class="word-type">${a.partOfSpeech}</p>
          <div class="meaning">
            <h2>Meaning</h2>
            <ul>
            ${a.definitions
              .map((b) => {
                return `
               <li>
              ${b.definition}
               </li>
              ${
                b.example != undefined
                  ? `
            <li type="none">
              “${b.example}”
            </li>`
                  : ""
              }
            `;
              })
              .join("")}
              </ul>
            ${
              a.synonyms != []
                ? a.synonyms
                    .map((c) => {
                      return `<p class="synonym">Synonyms <span>${c}</span></p>`;
                    })
                    .join("")
                : ""
            }
          </div>
          `;
          })
          .join("")}
        
        <div class="source"><a href="${
          data[0].sourceUrls
        }">Source</a><a class='source-link' href="${data[0].sourceUrls}">${
      data[0].sourceUrls
    }</a></div>
      
  `),
    (audio.src =
      data[0].phonetics.filter((a) => a.audio != "")[0] != undefined
        ? data[0].phonetics.filter((a) => a.audio != "")[0].audio
        : "")
  );
}

function onAclick() {
  audio.play();
}
