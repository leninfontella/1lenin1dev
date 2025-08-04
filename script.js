// Envio de formulário simulado
document.getElementById("formContato").addEventListener("submit", function (e) {
  e.preventDefault();

  alert("Mensagem enviada com sucesso!");

  this.reset(); // limpa os campos
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
