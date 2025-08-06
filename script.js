// Envio de formulário simulado
document
  .getElementById("formContato")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;

    try {
      const resposta = await fetch("http://localhost:3000/enviar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, mensagem }),
      });

      const resultado = await resposta.json();

      if (resultado.sucesso) {
        alert("Mensagem enviada com sucesso!");
        this.reset();
      } else {
        alert("Erro ao enviar. Tente novamente.");
      }
    } catch (erro) {
      console.error(erro);
      alert("Erro de conexão.");
    }
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
