// Envio de formulário simulado
document
  .getElementById("formContato")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;
    const statusDiv = document.getElementById("mensagem-status");

    function mostrarMensagem(texto, classe) {
      statusDiv.textContent = texto;
      statusDiv.className = `status-mensagem ${classe}`;
      statusDiv.classList.remove("escondido");
    }

    mostrarMensagem("Enviando mensagem...", "enviando");

    try {
      const resposta = await fetch("http://localhost:3000/enviar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, mensagem }),
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        mostrarMensagem("Mensagem enviada com sucesso! ✅", "sucesso");
        this.reset();
      } else {
        mostrarMensagem("Erro ao enviar. Tente novamente. ❌", "erro");
      }
    } catch (erro) {
      console.error(erro);
      mostrarMensagem("Erro de conexão. Verifique sua internet. ❌", "erro");
    }

    // Esconde a mensagem depois de 5 segundos
    setTimeout(() => {
      statusDiv.classList.add("escondido");
    }, 5000);
  });

// Scroll suave para seções com links âncora
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (href.length > 1) {
      // evita scroll para href="#"
      e.preventDefault();
      const alvo = document.querySelector(href);
      if (alvo) {
        alvo.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  });
});

// Esconde o loader após o carregamento
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("escondido");
    }, 1000); // tempo mínimo de exibição: 1 segundo
  }
});

// Destaque do link ativo na navbar com scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let scrollY = window.pageYOffset;

  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
});
