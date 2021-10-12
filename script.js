const Keyboard = {
  elements: {
      main: null,
      keysContainer: null,
      keys: []
  },

  eventHandlers: {
      oninput: null,
      onclose: null
  },

  properties: {
      value: "",
      language: "eng",
      capsLock: false
  },

  init() {
      // Create main elements
      this.elements.main = document.createElement("div");
      this.elements.keysContainer = document.createElement("div");

      // Setup main elements
      this.elements.main.classList.add("keyboard", "keyboard--hidden");
      this.elements.keysContainer.classList.add("keyboard__keys");
      this.elements.keysContainer.appendChild(this._createKeys());

      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

      // Add to DOM
      this.elements.main.appendChild(this.elements.keysContainer);
      document.body.appendChild(this.elements.main);

      // Automatically use keyboard for elements with .use-keyboard-input
      document.querySelectorAll(".use-keyboard-input").forEach(element => {
          element.addEventListener("focus", () => {
              this.open(element.value, currentValue => {
                  element.value = currentValue;
              });
          });
      });
  },

  _createKeys() {
      const fragment = document.createDocumentFragment();
      const keyLayoutEng = [
          "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
          "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
          "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";","'","enter",
          "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
          "space","lang"
      ];
      const keyLayoutBel = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "ў", "з",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д","ж","э", "enter",
        "done", "я", "ч", "с", "м", "і", "т", "ь", "б", "ю", ".",
        "space","lang"
    ];

      // Creates HTML for an icon
      const createIconHTML = (icon_name) => {
          return `<i class="material-icons">${icon_name}</i>`;
      };

      keyLayoutEng.forEach(key => {
          const keyElement = document.createElement("button");
          const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

          // Add attributes/classes
          keyElement.setAttribute("type", "button");
          keyElement.classList.add("keyboard__key");

          switch (key) {
              case "backspace":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = createIconHTML("backspace");

                  keyElement.addEventListener("click", () => {
                      this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                      this._triggerEvent("oninput");
                  });

                  break;

              case "caps":
                  keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                  keyElement.innerHTML = createIconHTML("keyboard_capslock");

                  keyElement.addEventListener("click", () => {
                      this._toggleCapsLock();
                      keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                  });

                  break;

              case "enter":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = createIconHTML("keyboard_return");

                  keyElement.addEventListener("click", () => {
                      this.properties.value += "\n";
                      this._triggerEvent("oninput");
                  });

                  break;

              case "space":
                  keyElement.classList.add("keyboard__key--extra-wide");
                  keyElement.innerHTML = createIconHTML("space_bar");

                  keyElement.addEventListener("click", () => {
                      this.properties.value += " ";
                      this._triggerEvent("oninput");
                  });

                  break;

              case "done":
                  keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                  keyElement.innerHTML = createIconHTML("check_circle");

                  keyElement.addEventListener("click", () => {
                      this.close();
                      this._triggerEvent("onclose");
                  });

                  break;
            
                case "lang":
                     keyElement.classList.add("keyboard__key--wide");
                     keyElement.textContent = this.properties.language;
                     keyElement.addEventListener("click", () => {
                        if(this.properties.language == "bel"){
                              this.properties.language = "eng";
                              keyElement.textContent = "eng";
                              this._toggleLanguage(keyLayoutEng);
                            }
                              else{
                                this.properties.language = "bel";
                                keyElement.textContent = "бел";
                                this._toggleLanguage(keyLayoutBel);
                              }
                        this._triggerEvent("oninput");
                    });
                    break;

              default:
                  keyElement.textContent = key.toLowerCase();
                  keyElement.dataset.value = key;
                  keyElement.addEventListener("click", () => {
                      const key = keyElement.dataset.value;
                      this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                      this._triggerEvent("oninput");
                  });

                  break;
          }

          fragment.appendChild(keyElement);

          if (insertLineBreak) {
              fragment.appendChild(document.createElement("br"));
          }
    });

      return fragment;
  },

  _triggerEvent(handlerName) {
      if (typeof this.eventHandlers[handlerName] == "function") {
          this.eventHandlers[handlerName](this.properties.value);
      }
  },

  _toggleCapsLock() {
      this.properties.capsLock = !this.properties.capsLock;

      for (const key of this.elements.keys) {
          if (key.childElementCount === 0) {
              key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
          }
      }
  },
  _toggleLanguage(keys) { 
      
     const totalNumberOfKeys = document.getElementsByClassName("keyboard__key");
     for(let i = 0; i < totalNumberOfKeys.length; i++){
        if(!(totalNumberOfKeys[i].classList.contains("keyboard__key--wide") || totalNumberOfKeys[i].classList.contains("keyboard__key--extra-wide"))){
            totalNumberOfKeys[i].textContent = keys[i];
            totalNumberOfKeys[i].dataset.value = keys[i];
        }
     }
  },
  open(initialValue, oninput, onclose) {
      this.properties.value = initialValue || "";
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
      this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
      this.properties.value = "";
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
      this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});

languageKey.addEventListener("click", () => {
    alert("1");
 })