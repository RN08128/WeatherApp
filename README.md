# 🌤️ Weather App

Um aplicativo de previsão do tempo moderno e responsivo que consome dados em tempo real da API global do **OpenWeatherMap**. O projeto altera de forma dinâmica toda a atmosfera visual da página (cores de fundo e cartões) baseando-se no clima atual e se é dia ou noite na cidade pesquisada.

---

## 🚀 Demonstração Visual

* O plano de fundo do site e do painel principal mudam dinamicamente usando transições suaves no CSS.
* **Temas disponíveis:** ☀️ Ensolarado (Sunny), ☁️ Nublado (Cloudy), 🌧️ Chuvoso/Tempestade (Rainy) e 🌙 Noite (Night).

---

## ✨ Funcionalidades

* **Consumo de API em Tempo Real:** Comunicação assíncrona utilizando `Fetch API` e `Async/Await` para buscar dados meteorológicos globais.
* **Temas Dinâmicos:** Manipulação avançada do DOM para adicionar/remover classes de estilo no `body` e no painel conforme o clima retornado.
* **Efeitos Sonoros:** Reprodução de áudio interativo (`clicksound.mp3`) ao disparar as buscas.
* **Pesquisa Inteligente:** Permite realizar buscas clicando no botão ou simplesmente pressionando a tecla `Enter` dentro do campo de texto.
* **Tratamento de Erros Eficiente (Fallback):** Uso de estruturas `try/catch` para capturar falhas de conexão ou cidades não encontradas, limpando o fluxo de dados e aplicando um tema padrão seguro sem quebrar a aplicação.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estruturação semântica do painel de controle e exibição climática.
* **CSS3:** Estilização moderna utilizando variáveis, `Flexbox` para alinhamento e transições (`transition-duration`) para efeitos visuais elegantes.
* **JavaScript (ES6+):** Lógica assíncrona para consumo de API, tratamento de eventos de teclado/mouse e manipulação dinâmica de classes do DOM.
* **API OpenWeatherMap:** Provedora oficial de dados meteorológicos mundiais.

---

## 📂 Estrutura do Projeto

```text
├── index.html          # Estrutura principal da interface do usuário
├── style.css           # Estilização completa e gradientes dinâmicos de clima
├── script.js          # Consumo da API, gerenciamento do DOM e lógica de som
└── sound/
    └── clicksound.mp3  # Efeito sonoro dos botões de busca
