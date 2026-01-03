# Nike D-Line | Digital Legacy 001

![Status](https://img.shields.io/badge/Status-Completed-success)
![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile-blue)
![License](https://img.shields.io/badge/License-MIT-green)

![Project Preview](assets/nike%20watches.jpg)

> **Disclaimer:** Este é um projeto de fã (Fan Art) sem afiliação oficial com a Nike Inc. O foco é demonstração de habilidades em WebGL e Front-end.

---

## 📋 Sobre

Uma experiência web imersiva que recria o relógio **Nike D-Line** (ícone Y2K) usando renderização 3D em tempo real. O projeto foca em resolver gargalos de performance comuns em WebGL para dispositivos móveis, garantindo 60 FPS e uma navegação fluida.

**Demo Online:** [Nike Watch 3D](https://nikewatch3d.vercel.app/)

## 🛠️ Tech Stack

* **Core:** HTML5, CSS3 (Modern Features), JavaScript (ES6+).
* **3D Engine:** [Three.js](https://threejs.org/) (WebGL).
* **Assets:** Formato GLB comprimido para web.
* **Design:** Estilo minimalista/tipográfico inspirado em portfólios de design de luxo.

## ✨ Destaques de Engenharia

Este não é apenas um modelo 3D numa página. Várias otimizações foram implementadas:

### ⚡ Performance & Otimização
* **Renderização Condicional:** Uso de `IntersectionObserver` para pausar o loop de renderização do Three.js quando o relógio sai da tela (economiza GPU/Bateria).
* **Pixel Ratio Cap:** Limita a renderização a 1.0x ou 1.5x em dispositivos móveis de alta densidade (Retina/OLED) para evitar travamentos.
* **Lazy Loading:** Imagens da galeria só carregam quando necessárias.
* **Shadow Mapping Otimizado:** Resolução de sombras dinâmica baseada no tipo de dispositivo.

### 📱 Experiência Mobile (UX)
* **Touch-Action Fix:** Implementação de um botão "Enable 3D" em celulares para evitar que o gesto de girar o relógio bloqueie o scroll da página.
* **Carrossel com Física:** Galeria com comportamento de arrastar (drag-to-scroll) nativo e suave.
* **Antialiasing Seletivo:** Desativado em telas pequenas para ganho de performance sem perda visual perceptível.

### 🌍 Internacionalização & Temas
* **Auto-i18n:** Detecta se o navegador está em Português ou Inglês e ajusta os textos automaticamente.
* **Dark/Light Mode:** Sincroniza com a preferência do sistema operacional e salva a escolha manual no `localStorage`.

## 📂 Estrutura de Pastas

```text
nike-dline-project/
├── assets/          # Modelos 3D e Imagens otimizadas
├── css/
│   └── style.css    # Variáveis CSS, Grid e Responsividade
├── js/
│   └── main.js      # Lógica, Cenas 3D e Eventos
└── index.html       # Markup Semântico

```

## 🚀 Como Rodar

Devido às políticas de segurança de CORS (Cross-Origin Resource Sharing) para carregar modelos 3D, este projeto precisa de um servidor local.

**Opção 1: VS Code (Live Server)**

1. Instale a extensão "Live Server".
2. Abra o `index.html`.
3. Clique em "Go Live".

**Opção 2: Python**

```bash
# No terminal, dentro da pasta do projeto:
python -m http.server 8000
# Acesse: http://localhost:8000

```

**Opção 3: Node.js**

```bash
npx serve

```

## 🤝 Créditos

Desenvolvido por **mz**.

* [GitHub](https://github.com/mzzvxm)
* [LinkedIn](https://linkedin.com/in/mzzvxm)

* Imagens por [Phil Frank Design](https://phil-frank.com/nike-d-line-watches)
